import { z } from "zod"

import { Sex } from "@prisma/client"

export const userSchema = () =>
  z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    profilePicture: fileMinimalSchema().nullable(),
    isCathub: z.boolean(),
    sex: z.nativeEnum(Sex).nullable(),
    description: z.string().nullable(),
    price: z.number().nullable(),
    age: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    _count: z.object({
      likes: z.number(),
    }),
  })

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

export const getMeResponseSchema = () =>
  z.object({
    user: userSchema(),
  })
