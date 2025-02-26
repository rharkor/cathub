import { z } from "zod"

import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema } from "../../lib/types"

import { getPostByIdResponseSchema, getPostByIdSchema, getPostsRequestSchema, getPostsResponseSchema } from "./schemas"

export async function getAllPosts({ input }: apiInputFromSchema<typeof getPostsRequestSchema>) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: input.userId,
      },
      include: {
        image: true,
      },
    })
    const data: z.infer<ReturnType<typeof getPostsResponseSchema>> = {
      posts,
    }
    return data
  } catch (error) {
    logger.error("Error getting all posts", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get all posts" })
  }
}

export async function getPostById({ input }: apiInputFromSchema<typeof getPostByIdSchema>) {
  try {
    const { id } = input
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        image: true,
        user: {
          include: {
            profilePicture: true,
          },
        },
      },
    })

    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" })
    }

    const data: z.infer<ReturnType<typeof getPostByIdResponseSchema>> = {
      post,
    }
    return data
  } catch (error) {
    logger.error("Error getting post by id", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get post by id" })
  }
}
