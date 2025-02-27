import { z } from "zod"

import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"

import {
  postCommentResponseSchema,
  postCommentSchema,
  updateCommentResponseSchema,
  updateCommentSchema,
} from "./schemas"

/**
 * Post a comment
 * @param input - The input object containing the comment text and post ID
 * @param ctx - The context object containing the session
 * @returns The created comment
 */
export async function postComment({ input, ctx: { session } }: apiInputFromSchema<typeof postCommentSchema>) {
  try {
    ensureLoggedIn(session)

    const { text, postId } = input

    await prisma.postComment.create({
      data: {
        text,
        postId,
        userId: session.userId,
      },
    })

    const data: z.infer<ReturnType<typeof postCommentResponseSchema>> = {
      status: "success",
    }
    return data
  } catch (error) {
    logger.error("Error posting comment", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to post comment" })
  }
}

/**
 * Update a comment
 * @param input - The input object containing the comment ID
 * @param ctx - The context object containing the session
 * @returns The updated comment
 */
export async function updateComment({ input, ctx: { session } }: apiInputFromSchema<typeof updateCommentSchema>) {
  try {
    ensureLoggedIn(session)

    const { id } = input

    // First check if comment exists and belongs to user
    const comment = await prisma.postComment.findUnique({
      where: { id },
    })

    if (!comment) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Comment not found" })
    }

    if (comment.userId !== session.userId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "You can only modify your own comments" })
    }

    await prisma.postComment.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    })

    const data: z.infer<ReturnType<typeof updateCommentResponseSchema>> = {
      status: "success",
    }
    return data
  } catch (error) {
    logger.error("Error updating comment", error)
    if (error instanceof TRPCError) throw error
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update comment" })
  }
}
