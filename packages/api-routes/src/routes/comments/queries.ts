import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema } from "../../lib/types"

import { getCommentsPostSchema } from "./schemas"

export const getComments = async ({ input }: apiInputFromSchema<typeof getCommentsPostSchema>) => {
  try {
    const comments = await prisma.postComment.findMany({
      where: {
        postId: input.postId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const count = await prisma.postComment.count({
      where: {
        postId: input.postId,
      },
    })

    return { comments, count }
  } catch (error) {
    logger.error("Error in getComments", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve comments" })
  }
}
