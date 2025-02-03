import { publicProcedure, router } from "@/index";

import { presignedUrl } from "./mutations";
import { presignedUrlResponseSchema, presignedUrlSchema } from "./schemas";

export const uploadRouter = router({
  presignedUrl: publicProcedure
    .input(presignedUrlSchema())
    .output(presignedUrlResponseSchema())
    .mutation(presignedUrl),
});
