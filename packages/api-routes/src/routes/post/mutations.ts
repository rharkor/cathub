import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "@/lib/types"
import { Status } from "@/lib/types"
import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { deletePostSchema, getPostByIdResponseSchema, getPostByIdSchema, getPostsResponseSchema, postResponseSchema, postSchema } from "./schemas"

export async function createPost({ input, ctx: { session } }: apiInputFromSchema<typeof postSchema>) {
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
    const data: z.infer<ReturnType<typeof postResponseSchema>> = {
      status: Status.SUCCESS
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
    const data: z.infer<ReturnType<typeof postResponseSchema>> = {
      status: Status.SUCCESS
    }
    return data
  } catch (error) {
    logger.error("Error deleting post", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete post" })
  }
}

export async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany()
    const data: z.infer<ReturnType<typeof getPostsResponseSchema>> = {
      status: Status.SUCCESS,
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
      status: Status.SUCCESS,
    post,
  }
    return data
  } catch (error) {
    logger.error("Error getting post by id", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get post by id" })
  }
}
