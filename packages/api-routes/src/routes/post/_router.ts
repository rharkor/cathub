import { protectedProcedure, router } from "@/lib/trpc"

import { createPost, deletePost } from "./mutations"
import { deletePostResponseSchema, deletePostSchema, postResponseSchema, postSchema } from "./schemas"

export const postRouter = router({
  createPost: protectedProcedure.input(postSchema()).output(postResponseSchema()).mutation(createPost),
  deletePost: protectedProcedure.input(deletePostSchema()).output(deletePostResponseSchema()).mutation(deletePost),
})
