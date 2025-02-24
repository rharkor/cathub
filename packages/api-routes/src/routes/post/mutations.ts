import { prisma } from "@/lib/prisma"
import { apiInputFromSchema } from "@/lib/types"
import { Status } from "@/lib/types"
import { logger } from "@rharkor/logger"

import { deletePostSchema, getPostByIdSchema, postSchema } from "./schemas"

export async function createPost({ input }: apiInputFromSchema<typeof postSchema>) {
  try {
    const { image, text, category, userId } = input
    await prisma.post.create({
      data: {
        image,
        text,
        category,
        userId,
      },
    })
    return {
      status: Status.SUCCESS,
    }
  } catch (error) {
    logger.error("Error creating post", error)
    throw new Error("Failed to create post")
  }
}

export async function deletePost({ input }: apiInputFromSchema<typeof deletePostSchema>) {
  try {
    const { id } = input
    await prisma.post.delete({ where: { id } })
    return {
      status: Status.SUCCESS,
    }
  } catch (error) {
    logger.error("Error deleting post", error)
    throw new Error("Failed to delete post")
  }
}

export async function getAllPosts() {
  const posts = await prisma.post.findMany()
  return posts
}

export async function getPostById({ input }: apiInputFromSchema<typeof getPostByIdSchema>) {
  const { id } = input
  const post = await prisma.post.findUnique({ where: { id } })
  return post
}
