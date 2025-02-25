import { z } from "zod"

import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"

import {
  createPostResponseSchema,
  createPostSchema,
  deletePostResponseSchema,
  deletePostSchema,
  getPostByIdResponseSchema,
  getPostByIdSchema,
  getPostsRequestSchema,
  getPostsResponseSchema,
} from "./schemas"

export async function createPost({ input, ctx: { session } }: apiInputFromSchema<typeof createPostSchema>) {
  try {
    ensureLoggedIn(session)

    const { image, text, category } = input
    await prisma.post.create({
      data: {
        image,
        text,
        category,
        userId: session.userId,
      },
    })
    const data: z.infer<ReturnType<typeof createPostResponseSchema>> = {
      status: "success",
    }
    return data
  } catch (error) {
    logger.error("Error creating post", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create post" })
  }
}

export async function deletePost({ input }: apiInputFromSchema<typeof deletePostSchema>) {
  try {
    const { id } = input
    await prisma.post.delete({ where: { id } })
    const data: z.infer<ReturnType<typeof deletePostResponseSchema>> = {
      status: "success",
    }
    return data
  } catch (error) {
    logger.error("Error deleting post", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete post" })
  }
}

export async function getAllPosts({ input }: apiInputFromSchema<typeof getPostsRequestSchema>) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: input.userId,
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
    const post = await prisma.post.findUnique({ where: { id } })
    const data: z.infer<ReturnType<typeof getPostByIdResponseSchema>> = {
      post: post ?? {
        id: "",
        image: "",
        text: "",
        createdAt: new Date(),
        category: [],
        userId: "",
      },
    }
    return data
  } catch (error) {
    logger.error("Error getting post by id", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get post by id" })
  }
}
