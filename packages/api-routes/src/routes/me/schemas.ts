import { z } from "zod"

export const fileMinimalSchema = () =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    key: z.string(),
    filetype: z.string(),
    bucket: z.string(),
    endpoint: z.string(),
    fileUploadingId: z.string().nullable(),
  })

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
