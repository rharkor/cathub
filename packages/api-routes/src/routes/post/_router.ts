import { publicProcedure, router } from "@/lib/trpc"

import { createPost, deletePost } from "./mutations"
import { deletePostResponseSchema, deletePostSchema, postResponseSchema, postSchema } from "./schemas"


export const postRouter = router({
  createPost: publicProcedure.input(postSchema()).output(postResponseSchema()).mutation(createPost),
  deletePost: publicProcedure.input(deletePostSchema()).output(deletePostResponseSchema()).mutation(deletePost),
})
