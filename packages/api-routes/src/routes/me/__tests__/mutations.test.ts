import { TRPCError } from "@trpc/server"

import { prisma } from "../../../lib/prisma"
import { Session } from "../../../lib/types"
import { deleteMe, update } from "../mutations"

// Mock des dépendances
jest.mock("../../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock("@rharkor/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe("Me Mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("update", () => {
    it("should update user successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      const mockInput = {
        username: "newUsername",
        isCathub: true,
        sex: "MALE" as const,
        description: "New description",
        price: 100,
        age: 25,
      }

      const mockUser = {
        id: "user123",
        email: "test@test.com",
        username: "oldUsername",
        profilePicture: null,
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.user.update as jest.Mock).mockResolvedValue({})

      // Act
      const result = await update({
        input: mockInput,
        ctx: { session: mockSession },
      })

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockSession.userId },
        include: { profilePicture: true },
      })
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockSession.userId },
        data: expect.objectContaining(mockInput),
        include: { profilePicture: true },
      })
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
        username: "newUsername",
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      // Act & Assert
      await expect(update({ input: mockInput, ctx: { session: mockSession } })).rejects.toThrow(TRPCError)
    })

    it("should throw an error if user is not logged in", async () => {
      // Arrange
      const mockInput = {
        username: "newUsername",
      }

      // Act & Assert
      await expect(update({ input: mockInput, ctx: { session: null } })).rejects.toThrow()
    })
  })

  describe("deleteMe", () => {
    it("should delete user successfully", async () => {
      // Arrange
      const mockSession = {
        userId: "user123",
        email: "test@test.com",
        iat: 1714158000,
        exp: 1714158000,
      } as Session

      ;(prisma.user.delete as jest.Mock).mockResolvedValue({})

      // Act
      const result = await deleteMe({ input: undefined, ctx: { session: mockSession } })

      // Assert
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: mockSession.userId },
      })
      expect(result).toEqual({ status: "success" })
    })

    it("should throw an error if user is not logged in", async () => {
      // Act & Assert
      await expect(deleteMe({ input: undefined, ctx: { session: null } })).rejects.toThrow()
    })
  })
})
