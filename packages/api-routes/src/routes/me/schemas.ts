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
  })

export const updateResponseSchema = () =>
  z.object({
    status: z.string(),
  })

export const deleteMeResponseSchema = () =>
  z.object({
    status: z.string(),
  })
