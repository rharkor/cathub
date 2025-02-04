import { z } from "zod"

import { logger } from "@rharkor/logger"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"
import { getImageUploading } from "../../lib/uploads"

import { updateResponseSchema, updateSchema } from "./schemas"

export async function update({ input, ctx: { session } }: apiInputFromSchema<typeof updateSchema>) {
  try {
    ensureLoggedIn(session)

    const { profilePictureKey } = input

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      include: {
        profilePicture: true,
      },
    })
    if (!user) {
      throw new Error("User not found")
    }

    const profilePicture =
      profilePictureKey === null || profilePictureKey === undefined
        ? profilePictureKey
        : await getImageUploading(profilePictureKey)

    //* Disconnect old profile picture (when null or set to null)
    if (profilePictureKey !== undefined && user.profilePicture) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          profilePictureId: null,
        },
      })
    }

    //* Update the user
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        profilePicture:
          profilePicture !== undefined && profilePicture !== null
            ? {
                connectOrCreate: {
                  where: { key: profilePicture.key },
                  create: profilePicture,
                },
              }
            : undefined,
      },
      include: {
        profilePicture: true,
      },
    })

    const data: z.infer<ReturnType<typeof updateResponseSchema>> = { success: true }
    return data
  } catch (error) {
    logger.error("Error updating user", error)
    throw new Error("Failed to update user")
  }
}
