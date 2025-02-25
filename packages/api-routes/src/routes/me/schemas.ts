import { z } from "zod"

export const updateSchema = () =>
  z.object({
    profilePictureKey: z.string().nullish(),
    username: z.string().optional(),
    isCathub: z.boolean().optional(),
    sex: z.enum(["MALE", "FEMALE"]).optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    age: z.coerce.number().int().optional(),
  })

export const updateResponseSchema = () =>
  z.object({
    status: z.string(),
  })

export const deleteMeResponseSchema = () =>
  z.object({
    status: z.string(),
  })
