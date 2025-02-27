import { z } from "zod"

import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"
import { getImageUploading } from "../../lib/uploads"

import { createPostResponseSchema, createPostSchema, deletePostResponseSchema, deletePostSchema } from "./schemas"

export async function createPost({ input, ctx: { session } }: apiInputFromSchema<typeof createPostSchema>) {
  try {
    ensureLoggedIn(session)

    const { image, text, category } = input

    const fullImage = image === null || image === undefined ? image : await getImageUploading(image)

    await prisma.post.create({
      data: {
        image:
          fullImage !== undefined && fullImage !== null
            ? {
                connectOrCreate: {
                  where: { key: fullImage.key },
                  create: fullImage,
                },
              }
            : undefined,
        text,
        category,
        user: {
          connect: {
            id: session.userId,
          },
        },
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
