import { protectedProcedure, router } from "../../lib/trpc"

import { createPost, deletePost, getAllPosts, getPostById } from "./mutations"
import {
  createPostResponseSchema,
  deletePostResponseSchema,
  deletePostSchema,
  getPostByIdResponseSchema,
  getPostByIdSchema,
  getPostsRequestSchema,
  getPostsResponseSchema,
  postSchema,
} from "./schemas"

export const postRouter = router({
  createPost: protectedProcedure.input(postSchema()).output(createPostResponseSchema()).mutation(createPost),
  deletePost: protectedProcedure.input(deletePostSchema()).output(deletePostResponseSchema()).mutation(deletePost),
  getPostById: protectedProcedure.input(getPostByIdSchema()).output(getPostByIdResponseSchema()).query(getPostById),
  getPosts: protectedProcedure.input(getPostsRequestSchema()).output(getPostsResponseSchema()).query(getAllPosts),
})
