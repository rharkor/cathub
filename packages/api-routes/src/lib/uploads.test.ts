import { prisma } from "./prisma"
import { getImageUploading } from "./uploads"

// Mock des dépendances
jest.mock("./prisma", () => ({
  prisma: {
    fileUploading: {
      findUnique: jest.fn(),
    },
  },
}))

describe("Uploads", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getImageUploading", () => {
    it("should return file data when file exists", async () => {
      // Arrange
      const key = "test-file-key"
      const mockFile = {
        id: "file-123",
        key,
        bucket: "test-bucket",
        endpoint: "test-endpoint",
        filetype: "image/jpeg",
        expires: new Date(Date.now() + 3600 * 1000), // 1 heure dans le futur
      }

      ;(prisma.fileUploading.findUnique as jest.Mock).mockResolvedValue(mockFile)

      // Act
      const result = await getImageUploading(key)

      // Assert
      expect(prisma.fileUploading.findUnique).toHaveBeenCalledWith({
        where: { key },
      })
      expect(result).toEqual({
        key: mockFile.key,
        bucket: mockFile.bucket,
        endpoint: mockFile.endpoint,
        filetype: mockFile.filetype,
        fileUploading: {
          connect: {
            id: mockFile.id,
          },
        },
      })
    })

    it("should throw an error when file is not found", async () => {
      // Arrange
      const key = "nonexistent-key"
      ;(prisma.fileUploading.findUnique as jest.Mock).mockResolvedValue(null)

      // Act & Assert
      await expect(getImageUploading(key)).rejects.toThrow("File not found")
    })

    it("should throw an error when file has expired", async () => {
      // Arrange
      const key = "expired-file-key"
      const mockFile = {
        id: "file-123",
        key,
        bucket: "test-bucket",
        endpoint: "test-endpoint",
        filetype: "image/jpeg",
        expires: new Date(Date.now() - 3600 * 1000), // 1 heure dans le passé
      }

      ;(prisma.fileUploading.findUnique as jest.Mock).mockResolvedValue(mockFile)

      // Act & Assert
      const result = await getImageUploading(key)
      expect(result).toEqual({
        key: mockFile.key,
        bucket: mockFile.bucket,
        endpoint: mockFile.endpoint,
        filetype: mockFile.filetype,
        fileUploading: {
          connect: {
            id: mockFile.id,
          },
        },
      })
    })
  })
})
