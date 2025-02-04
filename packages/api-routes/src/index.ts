import { createContext, router } from "./lib/trpc"
import { authRouter } from "./routes/auth/_router"
import { meRouter } from "./routes/me/_router"
import { uploadRouter } from "./routes/upload/_router"

const appRouter = router({
  upload: uploadRouter,
  auth: authRouter,
  me: meRouter,
})

export type AppRouter = typeof appRouter
export { appRouter, createContext }
