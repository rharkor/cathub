import { protectedProcedure, publicProcedure, router } from "../../lib/trpc";

import { postComment, updateComment } from "./mutations";
import { getComments } from "./queries";
import { getCommentsPostSchema, postCommentResponseSchema, postCommentSchema, updateCommentResponseSchema, updateCommentSchema } from "./schemas";

/**
 * Comment router
 */
export const commentRouter = router({
  postComment: protectedProcedure.input(postCommentSchema()).output(postCommentResponseSchema()).mutation(postComment),
  updateComment: protectedProcedure.input(updateCommentSchema()).output(updateCommentResponseSchema()).mutation(updateComment),
  getComments: publicProcedure.input(getCommentsPostSchema()).query(getComments)
})
