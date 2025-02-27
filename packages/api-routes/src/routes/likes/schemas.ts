import { z } from "zod";

export const likePostSchema = () => z.object({
  id: z.string(),
  postId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  state: z.enum(["like", "unlike"]),
})

export const postLikeSchema = () =>
  likePostSchema().pick({
    state: true,
    postId: true,
    userId: true,
  })

export const postLikeResponseSchema = () => z.object({
  status: z.string(),
})

export const getLikesSchema = () => z.object({
  postId: z.string(),
})

export const userLikeSchema = () => z.object({
  userId: z.string(),
  state: z.enum(["like", "unlike"]),
})

export const userLikeResponseSchema = () => z.object({
  status: z.string(),
})

export const getUserLikesSchema = () => z.object({
  userId: z.string(),
})

export const userProfileLikeSchema = () =>
  z.object({
    userId: z.string(),
    state: z.enum(["like", "unlike"]),
  })
