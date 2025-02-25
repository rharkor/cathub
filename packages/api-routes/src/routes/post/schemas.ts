import { z } from "zod"

import { Category } from "@prisma/client"

export const postSchema = () =>
  z.object({
    id: z.string(),
    image: z.string(),
    text: z.string(),
    createdAt: z.date(),
    category: z.array(z.nativeEnum(Category)),
    userId: z.string(),
  })

export const createPostSchema = () =>
  postSchema().pick({
    image: true,
    text: true,
    category: true,
  })

export const createPostResponseSchema = () =>
  z.object({
    status: z.string(),
  })

export const getPostByIdResponseSchema = () =>
  z.object({
    post: postSchema(),
  })

export const getPostsRequestSchema = () =>
  z.object({
    userId: z.string(),
  })

export const getPostsResponseSchema = () =>
  z.object({
    posts: z.array(postSchema()),
  })

export const getPostByIdSchema = () =>
  z.object({
    id: z.string(),
  })

export const deletePostSchema = () =>
  z.object({
    id: z.string(),
  })

export const deletePostResponseSchema = () =>
  z.object({
    status: z.string(),
  })
