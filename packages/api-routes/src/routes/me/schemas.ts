import { z } from "zod"

export const updateSchema = () =>
  z.object({
    profilePictureKey: z.string().nullish(),
    username: z.string().optional(),
    isCathub: z.boolean().optional(),
    sex: z.enum(["MALE", "FEMALE"]).nullish(),
    description: z.string().nullish(),
    price: z.coerce.number().nullish(),
    age: z.coerce.number().int().nullish(),
  })

export const updateResponseSchema = () =>
  z.object({
    status: z.string(),
  })

export const deleteMeResponseSchema = () =>
  z.object({
    status: z.string(),
  })
