/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { prisma } from "../../../lib/prisma"
import { getLikes, getUserLikes } from "../queries"

// Créer un logger de test pour suivre l'exécution
const testLogger = {
  log: (message: string, ...args: any[]) => {
    console.log(`[TEST LOG] ${message}`, ...args)
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[TEST ERROR] ${message}`, ...args)
  },
}

// Mock des dépendances
jest.mock("../../../lib/prisma", () => ({
  prisma: {
    postLike: {
      findMany: jest.fn().mockImplementation((...args) => {
        testLogger.log("prisma.postLike.findMany called with:", ...args)
        return Promise.resolve([]) // Valeur par défaut, sera remplacée dans les tests
      }),
    },
  },
}))

describe("Like Queries", () => {
  beforeEach(() => {
    testLogger.log("\n----- STARTING NEW TEST -----\n")
    jest.clearAllMocks()
  })

  afterEach(() => {
    testLogger.log("\n----- TEST COMPLETED -----\n")
  })

  describe("getLikes", () => {
    it("should return likes for a post", async () => {
      testLogger.log("TEST: should return likes for a post")

      // Arrange
      const mockInput = {
        postId: "post123",
      }

      const mockLikes = [
        {
          id: "like1",
          postId: "post123",
          userId: "user1",
          createdAt: new Date(),
        },
        {
          id: "like2",
          postId: "post123",
          userId: "user2",
          createdAt: new Date(),
        },
      ]

      testLogger.log("Setting up mock data:", { mockLikes })
      ;(prisma.postLike.findMany as jest.Mock).mockResolvedValue(mockLikes)

      // Act
      testLogger.log("Calling getLikes with input:", mockInput)
      const result = await getLikes({
        input: mockInput,
        ctx: { session: null }, // Public procedure, no session needed
      })
      testLogger.log("Result received:", result)

      // Assert
      testLogger.log("Running assertions...")
      expect(prisma.postLike.findMany).toHaveBeenCalledWith({
        where: { postId: mockInput.postId },
      })
      expect(result).toEqual(mockLikes)
      testLogger.log("Assertions passed!")
    })

    it("should handle empty results", async () => {
      testLogger.log("TEST: should handle empty results")

      // Arrange
      const mockInput = {
        postId: "post-with-no-likes",
      }

      testLogger.log("Setting up mock for empty results")
      ;(prisma.postLike.findMany as jest.Mock).mockResolvedValue([])

      // Act
      testLogger.log("Calling getLikes with input:", mockInput)
      const result = await getLikes({
        input: mockInput,
        ctx: { session: null },
      })
      testLogger.log("Result received:", result)

      // Assert
      testLogger.log("Running assertions...")
      expect(prisma.postLike.findMany).toHaveBeenCalledWith({
        where: { postId: mockInput.postId },
      })
      expect(result).toEqual([])
      expect(result.length).toBe(0)
      testLogger.log("Assertions passed!")
    })
  })

  describe("getUserLikes", () => {
    it("should return likes for a user with post details", async () => {
      testLogger.log("TEST: should return likes for a user with post details")

      // Arrange
      const mockInput = {
        userId: "user123",
      }

      const mockDate = new Date()

      const mockUserLikes = [
        {
          id: "like1",
          postId: "post1",
          userId: "user123",
          createdAt: mockDate,
          post: {
            id: "post1",
            text: "Post 1 content",
            userId: "otheruser1",
            createdAt: mockDate,
            image: { id: "img1", key: "image1.jpg" },
            user: {
              id: "otheruser1",
              username: "otheruser1",
              profilePicture: null,
            },
          },
        },
        {
          id: "like2",
          postId: "post2",
          userId: "user123",
          createdAt: mockDate,
          post: {
            id: "post2",
            text: "Post 2 content",
            userId: "otheruser2",
            createdAt: mockDate,
            image: { id: "img2", key: "image2.jpg" },
            user: {
              id: "otheruser2",
              username: "otheruser2",
              profilePicture: { id: "pp1", key: "profile1.jpg" },
            },
          },
        },
      ]

      // Mise à jour du mock pour inclure getUserLikes
      jest.mock("../../../lib/prisma", () => ({
        prisma: {
          postLike: {
            findMany: jest.fn().mockImplementation((args) => {
              testLogger.log("prisma.postLike.findMany called with:", args)
              if (args.where.userId) {
                return Promise.resolve(mockUserLikes)
              }
              return Promise.resolve([])
            }),
          },
        },
      }))

      testLogger.log("Setting up mock data for user likes:", { mockUserLikes })
      ;(prisma.postLike.findMany as jest.Mock).mockResolvedValue(mockUserLikes)

      // Act
      testLogger.log("Calling getUserLikes with input:", mockInput)
      const result = await getUserLikes({
        input: mockInput,
        ctx: { session: null }, // Public procedure, no session needed
      })
      testLogger.log("Result received:", result)

      // Assert
      testLogger.log("Running assertions...")
      expect(prisma.postLike.findMany).toHaveBeenCalledWith({
        where: { userId: mockInput.userId },
        include: {
          post: {
            include: {
              image: true,
              user: {
                include: {
                  profilePicture: true,
                },
              },
            },
          },
        },
      })
      expect(result).toEqual(mockUserLikes)
      expect(result.length).toBe(2)
      expect(result[0].post.text).toBe("Post 1 content")
      expect(result[1].post.user.username).toBe("otheruser2")
      testLogger.log("Assertions passed!")
    })
  })
})
