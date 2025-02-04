import SuperJSON from "superjson"

import { initTRPC } from "@trpc/server"
import * as trpcExpress from "@trpc/server/adapters/express"

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  // Auth user here

  return {
    session: null,
    req,
    res,
  }
}
type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
})

export const router = t.router
export const publicProcedure = t.procedure
