import { z } from "zod"


export const commentSchema = () =>
  z.object({
    id: z.string(),
    text: z.string(),
    createdAt: z.date(),
    postId: z.string(),
    userId: z.string()
  })

export const postCommentSchema = () =>
  commentSchema().pick({
    text: true,
    postId: true,
  })

export const postCommentResponseSchema = () =>
  z.object({
    status: z.string(),
  })