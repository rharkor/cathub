import { z } from "zod"

import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"

import { postCommentResponseSchema, postCommentSchema } from "./schemas"

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