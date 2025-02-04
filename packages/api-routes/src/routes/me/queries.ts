import { logger } from "@rharkor/logger"

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
      },
    })

    return user
  } catch (error) {
    logger.error("Error signing in", error)
    throw new Error("Failed to sign in")
  }
}
