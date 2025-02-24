import { S3Client } from "@aws-sdk/client-s3"

import { env } from "./env"

const s3Endpoint = env.S3_ENDPOINT
if (!s3Endpoint) throw new Error("S3 endpoint is not set")

export const s3Client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  endpoint: "https://" + s3Endpoint,
})
