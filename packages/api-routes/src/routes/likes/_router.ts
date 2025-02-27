import { protectedProcedure, publicProcedure, router } from "../../lib/trpc"

import { likePost, likeUserProfile } from "./mutations"
import { getLikes, getUserLikes } from "./queries"
import { getLikesSchema, getUserLikesSchema, postLikeResponseSchema, postLikeSchema, userProfileLikeSchema } from "./schemas"

/**
 * Comment router
 */
export const likeRouter = router({
  likePost: protectedProcedure.input(postLikeSchema()).output(postLikeResponseSchema()).mutation(likePost),
  likeUserProfile: protectedProcedure
    .input(userProfileLikeSchema())
    .output(postLikeResponseSchema())
    .mutation(likeUserProfile),
  getLikes: publicProcedure.input(getLikesSchema()).query(getLikes),
  getUserLikes: publicProcedure.input(getUserLikesSchema()).query(getUserLikes),
})
