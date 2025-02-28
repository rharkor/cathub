import { z } from "zod"

import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"

import { getMeResponseSchema } from "./schemas"

export async function getMe({ ctx: { session } }: apiInputFromSchema<typeof undefined>) {
  try {
    ensureLoggedIn(session)

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      include: {
        profilePicture: true,
        likedUsers: true,
        postLikes: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" })
    }

    const data: z.infer<ReturnType<typeof getMeResponseSchema>> = {
      user,
    }
    return data
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error
    }
    logger.error("Error in getMe", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve user" })
  }
}
