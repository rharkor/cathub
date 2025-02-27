import { protectedProcedure, router } from "../../lib/trpc"

import { createPost, deletePost } from "./mutations"
import { getAllPosts, getPostById } from "./queries"
import {
  createPostResponseSchema,
  createPostSchema,
  deletePostResponseSchema,
  deletePostSchema,
  getPostByIdResponseSchema,
  getPostByIdSchema,
  getPostsRequestSchema,
  getPostsResponseSchema,
} from "./schemas"

export const postRouter = router({
  createPost: protectedProcedure.input(createPostSchema()).output(createPostResponseSchema()).mutation(createPost),
  deletePost: protectedProcedure.input(deletePostSchema()).output(deletePostResponseSchema()).mutation(deletePost),
  getPostById: protectedProcedure.input(getPostByIdSchema()).output(getPostByIdResponseSchema()).query(getPostById),
  getPosts: protectedProcedure.input(getPostsRequestSchema()).output(getPostsResponseSchema()).query(getAllPosts),
})
