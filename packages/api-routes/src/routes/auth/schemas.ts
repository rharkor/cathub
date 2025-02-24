import { z } from "zod"

export const signInSchema = () =>
  z.object({
    email: z.string().email(),
    password: z.string(),
  })

export const signInResponseSchema = () =>
  z.object({
    token: z.string(),
  })

export const signUpSchema = () =>
  z.object({
    email: z.string(),
    password: z.string(),
    username: z.string(),
  })

export const signUpResponseSchema = () =>
  z.object({
    token: z.string(),
  })
