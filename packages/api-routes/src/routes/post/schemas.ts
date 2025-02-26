import { z } from "zod"

import { Category } from "@prisma/client"

import { fileMinimalSchema } from "../me/schemas"

export const postSchema = () =>
  z.object({
    id: z.string(),
    image: fileMinimalSchema().nullable(),
    text: z.string(),
    createdAt: z.date(),
    category: z.array(z.nativeEnum(Category)),
    userId: z.string(),
  })

export const createPostSchema = () =>
  postSchema()
    .pick({
      text: true,
      category: true,
    })
    .extend({
      image: z.string().nullable(),
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
