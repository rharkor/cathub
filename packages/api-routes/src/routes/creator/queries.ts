import { z } from "zod"

import { Prisma } from "@prisma/client"
import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema } from "../../lib/types"

import { getCreatorSchema, getCreatorsResponseSchema, getCreatorsSchema } from "./schemas"

export async function getCreator({ input }: apiInputFromSchema<typeof getCreatorSchema>) {
  try {
    const creator = await prisma.user.findUnique({
      where: {
        id: input.id,
        isCathub: true, // Only return users who have enabled profile discovery
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

    if (!creator) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Creator not found" })
    }

    return creator
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error
    }
    logger.error("Error in getCreator", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve creator" })
  }
}

export async function getCreators({ input }: apiInputFromSchema<typeof getCreatorsSchema>) {
  try {
    const where: Prisma.UserWhereInput = {
      isCathub: true, // Only return users who have enabled profile discovery
      ...(input.search && {
        username: {
          contains: input.search,
          mode: "insensitive",
        },
      }),
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where })

    const creators = await prisma.user.findMany({
      where,
      include: {
        profilePicture: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: input.limit ?? 20,
      skip: (input.page ?? 0) * (input.limit ?? 20),
    })

    // Calculate if there are more results
    const hasMore = total > (input.page ?? 0 + 1) * (input.limit ?? 20)

    const data: z.infer<ReturnType<typeof getCreatorsResponseSchema>> = {
      creators,
      total,
      hasMore,
    }

    return data
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error
    }
    logger.error("Error in getCreators", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve creators" })
  }
}
