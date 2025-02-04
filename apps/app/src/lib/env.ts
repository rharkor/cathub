/* eslint-disable no-process-env */
import { createEnv } from "@t3-oss/env-nextjs"
import { config } from "dotenv"
import { z } from "zod"

if (!process.env.NEXT_PUBLIC_ENV) {
  config()
}

export const env = createEnv({
  server: {
    ENV: z.enum(["development", "staging", "preproduction", "production"]),
  },
  client: {
    NEXT_PUBLIC_ENV: z.enum(["development", "staging", "preproduction", "production"]).optional(),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    ENV: process.env.ENV,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  onValidationError: (error) => {
    console.error(error)
    throw "Invalid environment variables"
  },
  onInvalidAccess(variable) {
    console.error(`Invalid access to ${variable}`)
    throw "Invalid environment variables"
  },
})
