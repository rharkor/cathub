import { appRouter } from "@cathub/api-routes"
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import"

// 1. create a caller-function for your router
const createCaller = createCallerFactory()(appRouter)

// 2. create a caller using your `Context`
const caller = createCaller({})

const main = async () => {
  await caller.auth.signIn({
    email: "test@test.com",
    password: "test",
  })
}

main()
