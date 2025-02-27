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

    await prisma.postComment.update({
      where: { id },
      data: { text: "Ce commentaire a été supprimé" },
    })

    const data: z.infer<ReturnType<typeof updateCommentResponseSchema>> = {
      status: "success",
    }
    return data
  } catch (error) {
    logger.error("Error updating comment", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update comment" })
  }
}
