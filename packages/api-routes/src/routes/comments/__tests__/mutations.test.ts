import { TRPCError } from "@trpc/server"

import { prisma } from "../../../lib/prisma"
import { Session } from "../../../lib/types"
import { postComment, updateComment } from "../mutations"

// Mock des dépendances
jest.mock("../../../lib/prisma", () => ({
  prisma: {
    postComment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock("@rharkor/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe("Comment Mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("postComment", () => {
    it("should create a comment successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        text: "This is a test comment",
        postId: "post123",
      }

      ;(prisma.postComment.create as jest.Mock).mockResolvedValue({
        id: "comment123",
        ...mockInput,
        userId: mockSession.userId,
        createdAt: new Date(),
        isDeleted: false,
      })

      // Act
      const result = await postComment({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.postComment.create).toHaveBeenCalledWith({
        data: {
          text: mockInput.text,
          postId: mockInput.postId,
          userId: mockSession.userId,
        },
      })
      expect(result).toEqual({ status: "success" })
    })

    it("should throw an error if user is not logged in", async () => {
      // Arrange
      const mockInput = {
        text: "This is a test comment",
        postId: "post123",
      }

      // Act & Assert
      await expect(postComment({ input: mockInput, ctx: { session: null } })).rejects.toThrow()
    })

    it("should throw an error when database operation fails", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        text: "This is a test comment",
        postId: "post123",
      }

      ;(prisma.postComment.create as jest.Mock).mockRejectedValue(new Error("Database error"))

      // Act & Assert
      await expect(
        postComment({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow(TRPCError)
    })
  })

  describe("updateComment", () => {
    it("should mark a comment as deleted successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        id: "comment123",
        isDeleted: true,
      }

      const mockComment = {
        id: "comment123",
        text: "This is a test comment",
        postId: "post123",
        userId: mockSession.userId,
        createdAt: new Date(),
        isDeleted: false,
      }

      ;(prisma.postComment.findUnique as jest.Mock).mockResolvedValue(mockComment)
      ;(prisma.postComment.update as jest.Mock).mockResolvedValue({
        ...mockComment,
        isDeleted: true,
      })

      // Act
      const result = await updateComment({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.postComment.findUnique).toHaveBeenCalledWith({
        where: { id: mockInput.id },
      })
      expect(prisma.postComment.update).toHaveBeenCalledWith({
        where: { id: mockInput.id },
        data: {
          isDeleted: true,
        },
      })
      expect(result).toEqual({ status: "success" })
    })

    it("should throw an error if comment is not found", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        id: "nonexistent",
        isDeleted: true,
      }

      ;(prisma.postComment.findUnique as jest.Mock).mockResolvedValue(null)

      // Act & Assert
      await expect(
        updateComment({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow(TRPCError)
      expect(prisma.postComment.update).not.toHaveBeenCalled()
    })

    it("should throw an error if user is not the comment owner", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        id: "comment123",
        isDeleted: true,
      }

      const mockComment = {
        id: "comment123",
        text: "This is a test comment",
        postId: "post123",
        userId: "different-user", // Different user
        createdAt: new Date(),
        isDeleted: false,
      }

      ;(prisma.postComment.findUnique as jest.Mock).mockResolvedValue(mockComment)

      // Act & Assert
      await expect(
        updateComment({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow(TRPCError)
      expect(prisma.postComment.update).not.toHaveBeenCalled()
    })

    it("should throw an error if user is not logged in", async () => {
      // Arrange
      const mockInput = {
        id: "comment123",
        isDeleted: true,
      }

      // Act & Assert
      await expect(updateComment({ input: mockInput, ctx: { session: null } })).rejects.toThrow()
    })
  })
})
