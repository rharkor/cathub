import { TRPCError } from "@trpc/server"

import { prisma } from "../../../lib/prisma"
import { getComments } from "../queries"

// Mock des dépendances
jest.mock("../../../lib/prisma", () => ({
  prisma: {
    postComment: {
      findMany: jest.fn(),
    },
  },
}))

jest.mock("@rharkor/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe("Comment Queries", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getComments", () => {
    it("should return comments for a post", async () => {
      // Arrange
      const mockInput = {
        postId: "post123",
      }

      const mockComments = [
        {
          id: "comment1",
          text: "First comment",
          postId: "post123",
          userId: "user1",
          createdAt: new Date(),
          isDeleted: false,
        },
        {
          id: "comment2",
          text: "Second comment",
          postId: "post123",
          userId: "user2",
          createdAt: new Date(),
          isDeleted: false,
        },
      ]

      ;(prisma.postComment.findMany as jest.Mock).mockResolvedValue(mockComments)

      // Act
      const result = await getComments({
        input: mockInput,
        ctx: { session: null }, // Public procedure, no session needed
      })

      // Assert
      expect(prisma.postComment.findMany).toHaveBeenCalledWith({
        where: { postId: mockInput.postId },
      })
      expect(result).toEqual(mockComments)
    })

    it("should handle empty results", async () => {
      // Arrange
      const mockInput = {
        postId: "post123",
      }

      ;(prisma.postComment.findMany as jest.Mock).mockResolvedValue([])

      // Act
      const result = await getComments({
        input: mockInput,
        ctx: { session: null },
      })

      // Assert
      expect(result).toEqual([])
    })

    it("should throw an error when database query fails", async () => {
      // Arrange
      const mockInput = {
        postId: "post123",
      }

      ;(prisma.postComment.findMany as jest.Mock).mockRejectedValue(new Error("Database error"))

      // Act & Assert
      await expect(
        getComments({
          input: mockInput,
          ctx: { session: null },
        })
      ).rejects.toThrow(TRPCError)
    })
  })
})
