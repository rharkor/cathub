import SuperJSON from "superjson"

import { logger } from "@rharkor/logger"
import { initTRPC, TRPCError } from "@trpc/server"
import * as trpcExpress from "@trpc/server/adapters/express"

import { parseJwt } from "./jwt"
import { Session, sessionSchema } from "./types"

export const createContext = (opts: trpcExpress.CreateExpressContextOptions | undefined) => {
  const req = opts?.req
  const res = opts?.res

  return {
    session: null as Session | null,
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

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const token = ctx.req?.headers.cookie
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1]

  if (token) {
    const session = parseJwt(token)
    const parsedSession = await sessionSchema.safeParseAsync(session)
    if (parsedSession.success) {
      ctx.session = parsedSession.data
    } else {
      logger.error(`Invalid session: ${parsedSession.error}`)
    }
  }

  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })
  }
  return next()
})
