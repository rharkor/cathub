import { z } from "zod"

import { userSchema } from "../me/schemas"

export const getCreatorSchema = () =>
  z.object({
    id: z.string(),
  })

export const getCreatorResponseSchema = () => userSchema()

export const getCreatorsSchema = () =>
  z.object({
    page: z.number().min(0).optional(),
    limit: z.number().min(1).max(100).optional(),
    search: z.string().optional(),
  })

export const getCreatorsResponseSchema = () =>
  z.object({
    creators: z.array(userSchema()),
    total: z.number(),
    hasMore: z.boolean(),
  })
