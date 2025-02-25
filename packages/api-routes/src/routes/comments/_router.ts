import { protectedProcedure, router } from "../../lib/trpc";

import { postComment } from "./mutations";
import { postCommentResponseSchema, postCommentSchema } from "./schemas";

export const commentRouter = router({
  postComment: protectedProcedure.input(postCommentSchema()).output(postCommentResponseSchema()).mutation(postComment),
})
