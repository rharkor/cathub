/* eslint-disable no-process-env */
import { config } from "dotenv";
import { z } from "zod";

import { createEnv } from "@t3-oss/env-core";

config();

export const env = createEnv({
  server: {
    ENV: z.enum(["development", "staging", "preproduction", "production"]),
    DATABASE_PRISMA_URL: z.string().min(1),
    DATABASE_URL_NON_POOLING: z.string().optional(),
    S3_REGION: z.string(),
    S3_ENDPOINT: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  onValidationError: (error) => {
    console.error(error);
    throw "Invalid environment variables";
  },
  onInvalidAccess(variable) {
    console.error(`Invalid access to ${variable}`);
    throw "Invalid environment variables";
  },
});
