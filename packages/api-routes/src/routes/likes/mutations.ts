import { TRPCError } from "@trpc/server"

import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, ensureLoggedIn } from "../../lib/types"

import { postLikeSchema, userProfileLikeSchema } from "./schemas"

export async function likePost({ input, ctx: { session } }: apiInputFromSchema<typeof postLikeSchema>) {
  ensureLoggedIn(session)

  const { postId, state } = input

  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" })
  }

  if (state === "like") {
    const existingLike = await prisma.postLike.findFirst({
      where: {
        postId,
        userId: session.userId,
      },
    })

    if (existingLike) {
      return { status: "success" }
    }

    await prisma.postLike.create({
      data: { postId, userId: session.userId },
    })
  } else {
    await prisma.postLike.deleteMany({
      where: { postId: post.id, userId: session.userId },
    })
  }

  return { status: "success" }
}

export async function likeUserProfile({ input, ctx: { session } }: apiInputFromSchema<typeof userProfileLikeSchema>) {
  ensureLoggedIn(session)

  const { userId, state } = input

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
  }

  if (state === "like") {
    const existingLike = await prisma.userProfileLike.findFirst({
      where: {
        userId: userId,
        likedUserId: session.userId,
      },
    })

    if (existingLike) {
      return { status: "success" }
    }

    await prisma.userProfileLike.create({
      data: { userId: userId, likedUserId: session.userId },
    })
  } else {
    await prisma.userProfileLike.deleteMany({
      where: { userId: userId, likedUserId: session.userId },
    })
  }

  return { status: "success" }
}
