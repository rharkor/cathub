import { z } from "zod"

import { Category } from "@prisma/client"

export const postSchema = () =>
  z.object({
    image: z.string(),
    text: z.string(),
    category: z.array(z.nativeEnum(Category)),
    userId: z.string(),
  })

export const postResponseSchema = () =>
  z.object({
    status: z.string(),
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
