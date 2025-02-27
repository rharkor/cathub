import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema } from "../../lib/types"

import { getLikesSchema, getUserLikesSchema } from "./schemas"
export async function getLikes({ input }: apiInputFromSchema<typeof getLikesSchema>) {
  try {
    const likes = await prisma.postLike.findMany({
      where: {
        postId: input.postId,
      },
    })

    return likes
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error
    }
    logger.error("Error in getLikes", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve likes" })
  }
}

export async function getUserLikes({ input }: apiInputFromSchema<typeof getUserLikesSchema>) {
  try {
    const likes = await prisma.userProfileLike.findMany({
      where: {
        userId: input.userId,
      },
    })

    return likes
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error
    }
    logger.error("Error in getUserLikes", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve user likes" })
  }
}
