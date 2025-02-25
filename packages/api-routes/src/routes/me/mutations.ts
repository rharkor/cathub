import { z } from "zod"

import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"
import { getImageUploading } from "../../lib/uploads"

import { deleteMeResponseSchema, deleteMeSchema, updateResponseSchema, updateSchema } from "./schemas"

export async function update({ input, ctx: { session } }: apiInputFromSchema<typeof updateSchema>) {
  try {
    ensureLoggedIn(session)

    const { profilePictureKey, username, email, isCathub, sex, description, price, age, image } = input

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      include: {
        profilePicture: true,
      },
    })
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
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
        username,
        email,
        isCathub,
        sex,
        description,
        price,
        age,
        image,
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
    if (error instanceof TRPCError) {
      throw error
    }
    logger.error("Error updating user", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update user" })
  }
}

export async function deleteMe({ input, ctx: { session } }: apiInputFromSchema<typeof deleteMeSchema>) {
  try {
    ensureLoggedIn(session)

    const { userId } = input

    await prisma.user.delete({ where: { id: userId } })

    const data: z.infer<ReturnType<typeof deleteMeResponseSchema>> = { success: true }
    return data
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error
    }
    logger.error("Error deleting user", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete user" })
  }
}
