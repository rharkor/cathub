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
  })

export const getCreatorsResponseSchema = () => z.array(userSchema())
