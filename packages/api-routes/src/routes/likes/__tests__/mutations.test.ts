import { TRPCError } from "@trpc/server"

import { prisma } from "../../../lib/prisma"
import { Session } from "../../../lib/types"
import { likePost, likeUserProfile } from "../mutations"

// Mock des dépendances
jest.mock("../../../lib/prisma", () => ({
  prisma: {
    post: {
      findUnique: jest.fn(),
    },
    postLike: {
      create: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    userProfileLike: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock("@rharkor/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe("Like Mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("likePost", () => {
    it("should like a post successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        postId: "post123",
        state: "like" as const,
        userId: "user123",
      }

      const mockPost = {
        id: "post123",
        text: "Post content",
        userId: "creator123",
      }

      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.postLike.create as jest.Mock).mockResolvedValue({
        id: "like123",
        postId: mockInput.postId,
        userId: mockSession.userId,
        createdAt: new Date(),
      })

      // Act
      const result = await likePost({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: mockInput.postId },
      })
      expect(prisma.postLike.create).toHaveBeenCalledWith({
        data: {
          postId: mockInput.postId,
          userId: mockSession.userId,
        },
      })
      expect(result).toEqual({ status: "success" })
    })

    it("should unlike a post successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        postId: "post123",
        state: "unlike" as const,
        userId: "user123",
      }

      const mockPost = {
        id: "post123",
        text: "Post content",
        userId: "creator123",
      }

      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.postLike.delete as jest.Mock).mockResolvedValue({})

      // Act
      const result = await likePost({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: mockInput.postId },
      })
      expect(prisma.postLike.delete).toHaveBeenCalledWith({
        where: {
          id: mockPost.id,
          userId: mockSession.userId,
        },
      })
      expect(result).toEqual({ status: "success" })
    })

    it("should throw an error if post is not found", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        postId: "nonexistent",
        state: "like" as const,
        userId: "user123",
      }

      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(null)

      // Act & Assert
      await expect(
        likePost({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow(TRPCError)
      expect(prisma.postLike.create).not.toHaveBeenCalled()
      expect(prisma.postLike.delete).not.toHaveBeenCalled()
    })

    it("should throw an error if user is not logged in", async () => {
      // Arrange
      const mockInput = {
        postId: "post123",
        state: "like" as const,
        userId: "user123",
      }

      // Act & Assert
      await expect(likePost({ input: mockInput, ctx: { session: null } })).rejects.toThrow()
    })
  })

  describe("likeUserProfile", () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it("should like a user profile successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        userId: "targetuser456",
        state: "like" as const,
      }

      const mockUser = {
        id: "targetuser456",
        username: "targetuser",
        email: "target@test.com",
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.userProfileLike.create as jest.Mock).mockResolvedValue({
        id: "like123",
        userId: mockSession.userId,
        likedUserId: mockInput.userId,
        createdAt: new Date(),
      })

      // Act
      const result = await likeUserProfile({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockInput.userId },
      })
      expect(prisma.userProfileLike.create).toHaveBeenCalledWith({
        data: {
          userId: mockSession.userId,
          likedUserId: mockInput.userId,
        },
      })
      expect(result).toEqual({ status: "success" })
    })

    it("should unlike a user profile successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        userId: "targetuser456",
        state: "unlike" as const,
      }

      const mockUser = {
        id: "targetuser456",
        username: "targetuser",
        email: "target@test.com",
      }

      const mockLike = {
        id: "like123",
        userId: mockSession.userId,
        likedUserId: mockInput.userId,
        createdAt: new Date(),
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.userProfileLike.findFirst as jest.Mock).mockResolvedValue(mockLike)
      ;(prisma.userProfileLike.delete as jest.Mock).mockResolvedValue({})

      // Act
      const result = await likeUserProfile({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockInput.userId },
      })
      expect(prisma.userProfileLike.findFirst).toHaveBeenCalledWith({
        where: {
          userId: mockSession.userId,
          likedUserId: mockInput.userId,
        },
      })
      expect(prisma.userProfileLike.delete).toHaveBeenCalledWith({
        where: { id: mockLike.id },
      })
      expect(result).toEqual({ status: "success" })
    })

    it("should handle case when like doesn't exist during unlike", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        userId: "targetuser456",
        state: "unlike" as const,
      }

      const mockUser = {
        id: "targetuser456",
        username: "targetuser",
        email: "target@test.com",
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.userProfileLike.findFirst as jest.Mock).mockResolvedValue(null)

      // Act
      const result = await likeUserProfile({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.userProfileLike.findFirst).toHaveBeenCalledWith({
        where: {
          userId: mockSession.userId,
          likedUserId: mockInput.userId,
        },
      })
      expect(prisma.userProfileLike.delete).not.toHaveBeenCalled()
      expect(result).toEqual({ status: "success" })
    })

    it("should throw an error if user is not found", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        userId: "nonexistent",
        state: "like" as const,
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      // Act & Assert
      await expect(
        likeUserProfile({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow(TRPCError)
      expect(prisma.userProfileLike.create).not.toHaveBeenCalled()
      expect(prisma.userProfileLike.findFirst).not.toHaveBeenCalled()
      expect(prisma.userProfileLike.delete).not.toHaveBeenCalled()
    })

    it("should throw an error if user is not logged in", async () => {
      // Arrange
      const mockInput = {
        userId: "targetuser456",
        state: "like" as const,
      }

      // Act & Assert
      await expect(likeUserProfile({ input: mockInput, ctx: { session: null } })).rejects.toThrow()
    })

    it("should prevent liking your own profile", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        userId: "user123", // Même ID que la session
        state: "like" as const,
      }

      // Act & Assert
      await expect(
        likeUserProfile({
          input: mockInput,
          ctx: { session: mockSession },
        })
      ).rejects.toThrow("You cannot like your own profile")
      expect(prisma.userProfileLike.create).not.toHaveBeenCalled()
    })

    it("should prevent multiple likes on the same post", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        postId: "post123",
        state: "like" as const,
        userId: "user123",
      }

      const mockPost = {
        id: "post123",
        text: "Post content",
        userId: "creator123",
      }

      const existingLike = {
        id: "like123",
        postId: mockInput.postId,
        userId: mockSession.userId,
        createdAt: new Date(),
      }

      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.postLike.findFirst as jest.Mock).mockResolvedValue(existingLike)

      // Act
      const result = await likePost({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.postLike.create).not.toHaveBeenCalled()
      expect(result).toEqual({ status: "success" })
    })
  })
})
