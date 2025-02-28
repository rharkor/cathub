import { protectedProcedure, router } from "../../lib/trpc"

import { likePost, likeUserProfile } from "./mutations"
import { postLikeResponseSchema, postLikeSchema, userProfileLikeSchema } from "./schemas"

/**
 * Comment router
 */
export const likeRouter = router({
  likePost: protectedProcedure.input(postLikeSchema()).output(postLikeResponseSchema()).mutation(likePost),
  likeUserProfile: protectedProcedure
    .input(userProfileLikeSchema())
    .output(postLikeResponseSchema())
    .mutation(likeUserProfile),
})
