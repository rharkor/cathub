import { z } from "zod"

import { Category } from "@prisma/client"

export const postSchema = () =>
  z.object({
    image: z.string(),
    text: z.string(),
    category: z.array(z.nativeEnum(Category)),
  })

export const postResponseSchema = () =>
  z.object({
    status: z.string(),
  })

export const getPostByIdResponseSchema = () =>
  z.object({
    status: z.string(),
    post: postSchema(),
  })

export const getPostsResponseSchema = () =>
  z.object({
    status: z.string(),
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
