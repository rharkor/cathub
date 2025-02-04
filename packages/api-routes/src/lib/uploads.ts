import { prisma } from "./prisma"

export const getImageUploading = async (key: string) => {
  const uploadingFile = await prisma.fileUploading.findUnique({
    where: {
      key,
    },
  })
  if (!uploadingFile) {
    throw new Error("File not found")
  }

  return {
    bucket: uploadingFile.bucket,
    endpoint: uploadingFile.endpoint,
    key: uploadingFile.key,
    filetype: uploadingFile.filetype,
    fileUploading: {
      connect: {
        id: uploadingFile.id,
      },
    },
  }
}
