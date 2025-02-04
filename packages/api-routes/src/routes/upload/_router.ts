import { protectedProcedure, router } from "../../lib/trpc"

import { presignedUrl } from "./mutations"
import { presignedUrlResponseSchema, presignedUrlSchema } from "./schemas"

export const uploadRouter = router({
  presignedUrl: protectedProcedure
    .input(presignedUrlSchema())
    .output(presignedUrlResponseSchema())
    .mutation(presignedUrl),
})
