import { z } from "zod"

export const updateSchema = () =>
  z.object({
    profilePictureKey: z.string().nullish(),
  })

export const updateResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })
