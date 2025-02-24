import { protectedProcedure, router } from "@/lib/trpc"

import { createPost, deletePost } from "./mutations"
import { createPostResponseSchema, deletePostResponseSchema, deletePostSchema, postSchema } from "./schemas"

export const postRouter = router({
  createPost: protectedProcedure.input(postSchema()).output(createPostResponseSchema()).mutation(createPost),
  deletePost: protectedProcedure.input(deletePostSchema()).output(deletePostResponseSchema()).mutation(deletePost),
})
