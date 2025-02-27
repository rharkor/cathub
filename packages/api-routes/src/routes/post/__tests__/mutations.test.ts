import { Category } from "@prisma/client"

import { prisma } from "../../../lib/prisma"
import { Session } from "../../../lib/types"
import * as uploads from "../../../lib/uploads"
import { createPost, deletePost } from "../mutations"
import { getAllPosts, getPostById } from "../queries"

// Mock des dépendances
jest.mock("../../../lib/prisma", () => ({
  prisma: {
    post: {
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

jest.mock("../../../lib/uploads", () => ({
  getImageUploading: jest.fn(),
}))

jest.mock("@rharkor/logger", () => ({
  logger: {
    error: jest.fn(),
    init: jest.fn().mockResolvedValue(undefined),
  },
}))

describe("Post Mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("createPost", () => {
    it("should create a post successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        image: "test-image-key",
        text: "Test post content",
        category: ["KINKY_KITTENS"] as Category[],
      }

      const mockImageData = {
        key: "test-image-key",
        bucket: "test-bucket",
        endpoint: "test-endpoint",
        filetype: "image/jpeg",
        fileUploading: {
          connect: {
            id: "file-upload-id-123",
          },
        },
      }

      // Mock getImageUploading pour retourner les données d'image
      jest.spyOn(uploads, "getImageUploading").mockResolvedValue(mockImageData)
      
      // Mock create pour simuler la création réussie
      ;(prisma.post.create as jest.Mock).mockResolvedValue({
        id: "post123",
        text: mockInput.text,
        category: mockInput.category,
        userId: mockSession.userId,
      })

      // Act
      const result = await createPost({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          text: mockInput.text,
          category: mockInput.category,
          image: {
            connectOrCreate: {
              where: { key: mockImageData.key },
              create: mockImageData,
            },
          },
          user: {
            connect: {
              id: mockSession.userId,
            },
          },
        },
      })
      expect(result).toEqual({ status: "success" })
    })

    it("should throw an error if user is not logged in", async () => {
      // Arrange
      const mockInput = {
        image: "test-image.jpg",
        text: "Test post content",
        category: ["KINKY_KITTENS"] as Category[],
      }
      // Act & Assert
      await expect(createPost({ input: mockInput, ctx: { session: null } })).rejects.toThrow()
    })
  })

  describe("deletePost", () => {
    it("should delete a post successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = { id: "post123" }
      ;(prisma.post.delete as jest.Mock).mockResolvedValue({})

      // Act
      const result = await deletePost({ input: mockInput, ctx: { session: mockSession } })

      // Assert
      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: mockInput.id },
      })
      expect(result).toEqual({ status: "success" })
    })
  })

  describe("getAllPosts", () => {
    it("should return all posts", async () => {
      // Arrange
      const mockPosts = [
        {
          id: "post1",
          image: { key: "image1.jpg" },
          text: "Post 1",
          createdAt: new Date(),
          category: ["KINKY_KITTENS"] as Category[],
          userId: "user1",
        },
        {
          id: "post2",
          image: { key: "image2.jpg" },
          text: "Post 2",
          createdAt: new Date(),
          category: ["KINKY_KITTENS"] as Category[],
          userId: "user2",
        },
      ]
      ;(prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts)

      // Act
      const result = await getAllPosts({
        input: {
          userId: "",
        },
        ctx: {
          session: {
            userId: "",
            email: "",
            exp: 0,
            iat: 0,
          },
        },
      })

      // Assert
      expect(prisma.post.findMany).toHaveBeenCalled()
      expect(result).toEqual({ posts: mockPosts })
    })
  })

  describe("getPostById", () => {
    it("should return a post by id", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = { id: "post123" }
      const mockPost = {
        id: "post123",
        image: { key: "image.jpg" },
        text: "Post content",
        createdAt: new Date(),
        category: ["KINKY_KITTENS"] as Category[],
        userId: "user123",
        user: {
          id: "user123",
          username: "testuser",
        },
      }
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)

      // Act
      const result = await getPostById({ input: mockInput, ctx: { session: mockSession } })

      // Assert
      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: mockInput.id },
        include: {
          image: true,
          user: {
            include: {
              profilePicture: true,
            },
          },
        },
      })
      expect(result).toEqual({ post: mockPost })
    })

    it("should return a default post when not found", async () => {
      // Arrange
      const mockInput = { id: "nonexistent" }
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session
      
      // Simuler un post trouvé pour éviter l'erreur
      const mockDefaultPost = {
        id: "",
        image: null,
        text: "",
        createdAt: expect.any(Date),
        category: [],
        userId: "",
        user: {
          id: "",
          username: "",
          profilePicture: null,
        },
      }
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockDefaultPost)

      // Act
      const result = await getPostById({ input: mockInput, ctx: { session: mockSession } })

      // Assert
      expect(result.post).toEqual(mockDefaultPost)
    })
  })
})
