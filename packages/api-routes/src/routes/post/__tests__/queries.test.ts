import { TRPCError } from "@trpc/server"

import { prisma } from "../../../lib/prisma"
import { Session } from "../../../lib/types"
import { getAllPosts, getPostById } from "../queries"

// Mock des dépendances
jest.mock("../../../lib/prisma", () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

jest.mock("@rharkor/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe("Post Queries", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getAllPosts", () => {
    it("should return all posts for a user", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        userId: "user123",
      }

      const mockPosts = [
        {
          id: "post1",
          text: "Post 1",
          category: ["KINKY_KITTENS"],
          userId: "user123",
          image: { key: "image1.jpg" },
          createdAt: new Date(),
        },
        {
          id: "post2",
          text: "Post 2",
          category: ["TABBY_TEASES"],
          userId: "user123",
          image: { key: "image2.jpg" },
          createdAt: new Date(),
        },
      ]

      ;(prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts)

      // Act
      const result = await getAllPosts({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { userId: mockInput.userId },
        include: { image: true },
      })
      expect(result).toEqual({ posts: mockPosts })
    })

    it("should handle empty results", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        userId: "user123",
      }

      ;(prisma.post.findMany as jest.Mock).mockResolvedValue([])

      // Act
      const result = await getAllPosts({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(result).toEqual({ posts: [] })
    })

    it("should throw an error when database query fails", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        userId: "user123",
      }

      ;(prisma.post.findMany as jest.Mock).mockRejectedValue(new Error("Database error"))

      // Act & Assert
      await expect(
        getAllPosts({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow(TRPCError)
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

      const mockInput = {
        id: "post123",
      }

      const mockPost = {
        id: "post123",
        text: "Post content",
        category: ["KINKY_KITTENS"],
        userId: "user123",
        image: { key: "image.jpg" },
        createdAt: new Date(),
        user: {
          id: "user123",
          username: "testuser",
          profilePicture: null,
        },
      }

      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)

      // Act
      const result = await getPostById({
        input: mockInput,
        ctx: { session: mockSession },
      })

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

    it("should throw an error when post is not found", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        id: "nonexistent",
      }

      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(null)

      // Act & Assert
      await expect(
        getPostById({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow(TRPCError)
    })

    it("should throw an error when database query fails", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        id: "post123",
      }

      ;(prisma.post.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"))

      // Act & Assert
      await expect(
        getPostById({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow(TRPCError)
    })
  })
})
