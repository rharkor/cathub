import { randomUUID } from "crypto"

import { createPresignedPost } from "@aws-sdk/s3-presigned-post"

import { prisma } from "../../../lib/prisma"
import { s3Client } from "../../../lib/s3"
import { Session } from "../../../lib/types"
import { presignedUrl } from "../mutations"

// Mock des dépendances
jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}))

jest.mock("@aws-sdk/s3-presigned-post", () => ({
  createPresignedPost: jest.fn(),
}))

jest.mock("../../../lib/prisma", () => ({
  prisma: {
    fileUploading: {
      create: jest.fn(),
    },
  },
}))

jest.mock("../../../lib/s3", () => ({
  s3Client: {},
}))

jest.mock("../../../lib/env", () => ({
  env: {
    S3_BUCKET_NAME: "test-bucket",
    S3_ENDPOINT: "test-endpoint",
  },
}))

jest.mock("@rharkor/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe("Upload Mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("presignedUrl", () => {
    it("should generate a presigned URL successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        filename: "test-image.jpg",
        filetype: "image/jpeg",
      }

      const mockUUID = "mock-uuid"
      ;(randomUUID as jest.Mock).mockReturnValue(mockUUID)

      const mockPresignedPostResponse = {
        url: "https://test-bucket.test-endpoint/",
        fields: {
          key: `${mockUUID}-test-image.jpg`,
          "Content-Type": mockInput.filetype,
          acl: "public-read",
        },
      }
      ;(createPresignedPost as jest.Mock).mockResolvedValue(mockPresignedPostResponse)
      ;(prisma.fileUploading.create as jest.Mock).mockResolvedValue({})

      // Act
      const result = await presignedUrl({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(randomUUID).toHaveBeenCalled()
      expect(prisma.fileUploading.create).toHaveBeenCalledWith({
        data: {
          key: expect.stringContaining(mockUUID),
          user: {
            connect: {
              id: mockSession.userId,
            },
          },
          expires: expect.any(Date),
          bucket: "test-bucket",
          endpoint: "test-endpoint",
          filetype: mockInput.filetype,
        },
      })
      expect(createPresignedPost).toHaveBeenCalledWith(s3Client, {
        Bucket: "test-bucket",
        Key: expect.stringContaining(mockUUID),
        Conditions: [
          ["content-length-range", 0, expect.any(Number)],
          ["starts-with", "$Content-Type", mockInput.filetype],
        ],
        Fields: {
          acl: "public-read",
          "Content-Type": mockInput.filetype,
        },
        Expires: 600,
      })
      expect(result).toEqual(mockPresignedPostResponse)
    })

    it("should throw an error if user is not logged in", async () => {
      // Arrange
      const mockInput = {
        filename: "test-image.jpg",
        filetype: "image/jpeg",
      }

      // Act & Assert
      await expect(presignedUrl({ input: mockInput, ctx: { session: null } })).rejects.toThrow()
    })

    it("should throw an error if S3 endpoint or bucket is not defined", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        filename: "test-image.jpg",
        filetype: "image/jpeg",
      }

      // Remplacer temporairement les valeurs d'environnement
      const originalEnv = await import("../../../lib/env").then((module) => module.env)
      jest.resetModules()
      jest.doMock("../../../lib/env", () => ({
        env: {
          ...originalEnv,
          S3_BUCKET_NAME: undefined,
        },
      }))

      // Réimporter la fonction avec le mock mis à jour
      const { presignedUrl: presignedUrlWithMockedEnv } = await import("../mutations")

      // Act & Assert
      await expect(
        presignedUrlWithMockedEnv({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow("S3 endpoint or bucket is not defined")

      // Restaurer l'environnement d'origine
      jest.resetModules()
      jest.doMock("../../../lib/env", () => ({
        env: originalEnv,
      }))
    })

    it("should format filename correctly", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        filename: "Test Image With Spaces & Special Chars!.jpg",
        filetype: "image/jpeg",
      }

      const mockUUID = "mock-uuid"
      ;(randomUUID as jest.Mock).mockReturnValue(mockUUID)
      ;(createPresignedPost as jest.Mock).mockResolvedValue({
        url: "https://test-bucket.test-endpoint/",
        fields: {},
      })
      ;(prisma.fileUploading.create as jest.Mock).mockResolvedValue({})

      // Act
      await presignedUrl({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.fileUploading.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            key: `${mockUUID}-test-image-with-spaces-special-charsjpg`,
          }),
        })
      )
    })
  })
}) 