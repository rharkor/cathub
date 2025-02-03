import { randomUUID } from "crypto"
import { z } from "zod"

import { env } from "@/lib/env"
import { ApiError, handleApiError } from "@/lib/utils/server-utils"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { maxUploadSize } from "@dimension/core-lib/src/constants"
import { prisma } from "@dimension/core-lib/src/prisma"
import { rateLimiter } from "@dimension/core-lib/src/rate-limit"
import { s3Client } from "@dimension/core-lib/src/s3"
import { apiInputFromSchema } from "@dimension/core-lib/src/types"
import { stringToSlug } from "@dimension/core-lib/src/utils"
import { ensureLoggedIn } from "@dimension/core-lib/src/utils/server-utils"
import { logger } from "@rharkor/logger"

import { presignedUrlResponseSchema, presignedUrlSchema } from "./schemas"

export const presignedUrl = async ({ input, ctx: { session } }: apiInputFromSchema<typeof presignedUrlSchema>) => {
  ensureLoggedIn(session)
  try {
    if (!env.ENABLE_S3_SERVICE) {
      return ApiError("s3ServiceDisabled")
    }

    //* Rate limit (20 requests per hour)
    const { success } = await rateLimiter(`presigned-url:${session.user.id}`, 20, 60 * 60)
    if (!success) {
      return ApiError("tooManyAttempts", "TOO_MANY_REQUESTS")
    }

    const { filename, filetype } = input
    //? Slug and max length
    const filenameFormatted = stringToSlug(filename).slice(0, 50)
    const Key = randomUUID() + "-" + filenameFormatted
    const expiresInSeconds = 600 //? 10 minutes
    const expires = new Date(Date.now() + expiresInSeconds * 1000)
    const bucket = env.NEXT_PUBLIC_S3_BUCKET_NAME
    const endpoint = env.NEXT_PUBLIC_S3_ENDPOINT
    if (!endpoint || !bucket) {
      logger.error("S3 endpoint or bucket is not defined")
      return ApiError("s3ServiceDisabled")
    }

    await prisma.fileUploading.create({
      data: {
        key: Key,
        user: {
          connect: {
            id: session.user.id,
          },
        },
        expires,
        bucket,
        endpoint,
        filetype,
      },
    })
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key,
      Conditions: [
        ["content-length-range", 0, maxUploadSize], // up to 10 MB
        ["starts-with", "$Content-Type", filetype],
      ],
      Fields: {
        acl: "public-read",
        "Content-Type": filetype,
      },
      Expires: expiresInSeconds, //? Seconds before the presigned post expires. 3600 by default.
    })

    const response: z.infer<ReturnType<typeof presignedUrlResponseSchema>> = {
      url,
      fields,
    }
    return response
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
