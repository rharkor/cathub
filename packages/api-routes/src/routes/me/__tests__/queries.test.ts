import { TRPCError } from "@trpc/server"

import { prisma } from "../../../lib/prisma"
import { Session } from "../../../lib/types"
import { getMe } from "../queries"

// Mock des dépendances
jest.mock("../../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock("@rharkor/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe("Me Queries", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getMe", () => {
    it("should return user data successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockUser = {
        id: "user123",
        email: "test@test.com",
        username: "testuser",
        profilePicture: null,
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getMe({ input: undefined, ctx: { session: mockSession } })

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockSession.userId },
        include: { profilePicture: true },
      })
      expect(result).toEqual(mockUser)
    })

    it("should throw an error if user is not found", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      // Act & Assert
      await expect(getMe({ input: undefined, ctx: { session: mockSession } })).rejects.toThrow(TRPCError)
    })

    it("should throw an error if user is not logged in", async () => {
      // Act & Assert
      await expect(getMe({ input: undefined, ctx: { session: null } })).rejects.toThrow()
    })
  })
}) 