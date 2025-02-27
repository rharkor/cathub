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
    await prisma.postLike.delete({
      where: { id: post.id, userId: session.userId },
    })
  }

  return { status: "success" }
}

export async function likeUserProfile({ input, ctx: { session } }: apiInputFromSchema<typeof userProfileLikeSchema>) {
  ensureLoggedIn(session)

  const { userId, state } = input

  if (userId === session.userId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You cannot like your own profile",
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
  }

  if (state === "like") {
    await prisma.userProfileLike.create({
      data: { userId: session.userId, likedUserId: userId },
    })
  } else {
    const like = await prisma.userProfileLike.findFirst({
      where: {
        userId: session.userId,
        likedUserId: userId,
      },
    })

    if (like) {
      await prisma.userProfileLike.delete({
        where: { id: like.id },
      })
    }
  }

  return { status: "success" }
}
