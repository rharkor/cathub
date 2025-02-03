import { z } from "zod"

import { createContext, publicProcedure, router } from "./lib/trpc"
import { uploadRouter } from "./routes/upload/_router"

const appRouter = router({
  upload: uploadRouter,
  me: router({
    get: publicProcedure.query(async () => {
      return {
        id: "1",
        name: "John Doe",
        role: "admin",
        profilePicture: {
          bucket: "test",
          endpoint: "test",
          key: "test",
        },
      }
    }),
    update: publicProcedure
      .input(
        z.object({
          profilePictureKey: z.string().nullish(),
        })
      )
      .mutation(async ({ input }) => {
        return {
          id: "1",
          name: "John Doe",
          role: "admin",
          profilePictureKey: input.profilePictureKey,
        }
      }),
  }),
})

export type AppRouter = typeof appRouter
export { appRouter, createContext }
