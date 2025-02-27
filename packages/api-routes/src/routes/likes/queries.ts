import { prisma } from "../../lib/prisma"
import { apiInputFromSchema } from "../../lib/types"

import { getLikesSchema, getUserLikesSchema } from "./schemas"

export function getLikes({ input }: apiInputFromSchema<typeof getLikesSchema>) {
  return prisma.postLike.findMany({
    where: {
      postId: input.postId,
    },
  })
}

export function getUserLikes({ input }: apiInputFromSchema<typeof getUserLikesSchema>) {
  return prisma.postLike.findMany({
    where: {
      userId: input.userId,
    },
    include: {
      post: {
        include: {
          image: true,
          user: {
            include: {
              profilePicture: true,
            },
          },
        },
      },
    },
  })
}
