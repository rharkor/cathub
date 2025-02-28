import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"

export async function getMe({ ctx: { session } }: apiInputFromSchema<typeof undefined>) {
  try {
    ensureLoggedIn(session)

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      include: {
        profilePicture: true,
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

    return user
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error
    }
    logger.error("Error in getMe", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve user" })
  }
}
