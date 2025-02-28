/* eslint-disable no-process-env */
import { config } from "dotenv"
import { z } from "zod"

import { createEnv } from "@t3-oss/env-core"

config()

export const env = createEnv({
  server: {
    ENV: z.enum(["development", "staging", "preproduction", "production"]),
    PORT: z.coerce.number().optional(),
    DATABASE_PRISMA_URL: z.string().min(1),
    DATABASE_URL_NON_POOLING: z.string().optional(),
    ADMIN_EMAIL: z.string().min(1),
    ADMIN_PASSWORD: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  onValidationError: (error) => {
    console.error(error)
    throw "Invalid environment variables"
  },
  onInvalidAccess(variable) {
    console.error(`Invalid access to ${variable}`)
    throw "Invalid environment variables"
  },
})
