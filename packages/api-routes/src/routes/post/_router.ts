import { protectedProcedure, publicProcedure, router } from "../../lib/trpc"

import { createPost, deletePost } from "./mutations"
import { getAllPosts, getPostById, getRecommendedPosts } from "./queries"
import {
  createPostResponseSchema,
  createPostSchema,
  deletePostResponseSchema,
  deletePostSchema,
  getPostByIdResponseSchema,
  getPostByIdSchema,
  getPostsRequestSchema,
  getPostsResponseSchema,
  getRecommendedPostsResponseSchema,
  getRecommendedPostsSchema,
} from "./schemas"

export const postRouter = router({
  createPost: protectedProcedure.input(createPostSchema()).output(createPostResponseSchema()).mutation(createPost),
  deletePost: protectedProcedure.input(deletePostSchema()).output(deletePostResponseSchema()).mutation(deletePost),
  getPostById: publicProcedure.input(getPostByIdSchema()).output(getPostByIdResponseSchema()).query(getPostById),
  getPosts: publicProcedure.input(getPostsRequestSchema()).output(getPostsResponseSchema()).query(getAllPosts),
  getRecommendedPosts: publicProcedure
    .input(getRecommendedPostsSchema())
    .output(getRecommendedPostsResponseSchema())
    .query(getRecommendedPosts),
})
