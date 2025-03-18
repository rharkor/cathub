import { z } from "zod"

import { Prisma } from "@prisma/client"
import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema } from "../../lib/types"

import {
  getPostByIdResponseSchema,
  getPostByIdSchema,
  getPostsRequestSchema,
  getPostsResponseSchema,
  getRecommendedPostsResponseSchema,
  getRecommendedPostsSchema,
} from "./schemas"

export async function getAllPosts({ input }: apiInputFromSchema<typeof getPostsRequestSchema>) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: input.userId,
      },
      include: {
        image: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
    })
    const data: z.infer<ReturnType<typeof getPostsResponseSchema>> = {
      posts,
    }
    return data
  } catch (error) {
    logger.error("Error getting all posts", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get all posts" })
  }
}

export async function getPostById({ input }: apiInputFromSchema<typeof getPostByIdSchema>) {
  try {
    const { id } = input
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        image: true,
        user: {
          include: {
            profilePicture: true,
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" })
    }

    const data: z.infer<ReturnType<typeof getPostByIdResponseSchema>> = {
      post,
    }
    return data
  } catch (error) {
    logger.error("Error getting post by id", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get post by id" })
  }
}

export async function getRecommendedPosts({ input }: apiInputFromSchema<typeof getRecommendedPostsSchema>) {
  try {
    const { limit, page } = input
    const skip = page * limit

    const where: Prisma.PostWhereInput = {
      user: {
        isCathub: true,
      },
      ...(input.search && {
        text: {
          contains: input.search,
        },
      }),
      ...(input.selectedCategory && {
        category: {
          has: input.selectedCategory,
        },
      }),
    }

    // Get total count for pagination
    const totalCount = await prisma.post.count({ where })

    // Fetch posts with pagination
    const posts = await prisma.post.findMany({
      where,
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "desc", // Most recent posts first
      },
      include: {
        image: true,
        user: {
          include: {
            profilePicture: true,
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    const hasMore = skip + posts.length < totalCount

    const data: z.infer<ReturnType<typeof getRecommendedPostsResponseSchema>> = {
      posts,
      total: totalCount,
      hasMore,
    }

    return data
  } catch (error) {
    logger.error("Error getting recommended posts", error)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get recommended posts" })
  }
}
