import { z } from "zod"

export const updateSchema = () =>
  z.object({
    profilePictureKey: z.string().nullish(),
    username: z.string().optional(),
    email: z.string().email().optional(),
    isCathub: z.boolean().optional(),
    sex: z.enum(["MALE", "FEMALE"]).optional(),
    description: z.string().optional(),
    price: z.number().int().optional(),
    age: z.number().int().optional(),
    image: z.string().optional(),
  })

export const deleteMeSchema = () =>
  z.object({
    userId: z.string(),
  })

export const updateResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

export const deleteMeResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })
