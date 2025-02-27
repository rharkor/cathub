import { createContext, router } from "./lib/trpc"
import { authRouter } from "./routes/auth/_router"
import { creatorRouter } from "./routes/creator/_router"
import { meRouter } from "./routes/me/_router"
import { postRouter } from "./routes/post/_router"
import { uploadRouter } from "./routes/upload/_router"

const appRouter = router({
  upload: uploadRouter,
  auth: authRouter,
  me: meRouter,
  post: postRouter,
  creator: creatorRouter,
})

export type AppRouter = typeof appRouter
export { appRouter, createContext }
