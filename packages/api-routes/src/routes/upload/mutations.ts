import { randomUUID } from "crypto"
import { z } from "zod"

import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { maxUploadSize } from "../../lib/constants"
import { env } from "../../lib/env"
import { prisma } from "../../lib/prisma"
import { s3Client } from "../../lib/s3"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"
import { stringToSlug } from "../../lib/utils"

import { presignedUrlResponseSchema, presignedUrlSchema } from "./schemas"

export const presignedUrl = async ({ input, ctx: { session } }: apiInputFromSchema<typeof presignedUrlSchema>) => {
  try {
    ensureLoggedIn(session)
    const { filename, filetype } = input
    //? Slug and max length
    const filenameFormatted = stringToSlug(filename).slice(0, 50)
    const Key = randomUUID() + "-" + filenameFormatted
    const expiresInSeconds = 600 //? 10 minutes
    const expires = new Date(Date.now() + expiresInSeconds * 1000)
    const bucket = env.S3_BUCKET_NAME
    const endpoint = env.S3_ENDPOINT
    if (!endpoint || !bucket) {
      logger.error("S3 endpoint or bucket is not defined")
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "S3 endpoint or bucket is not defined" })
    }

    await prisma.fileUploading.create({
      data: {
        key: Key,
        user: {
          connect: {
            id: session.userId,
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
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error
    }
    logger.error("Error generating presigned URL", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to generate presigned URL" })
  }
}
