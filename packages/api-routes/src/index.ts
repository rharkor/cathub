import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  // Auth user here

  return {
    req,
    res,
  };
};
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const router = t.router;
const publicProcedure = t.procedure;

const meRouter = router({
  test: publicProcedure.query(() => {
    return "test";
  }),
});

const appRouter = router({
  me: meRouter,
});

export type AppRouter = typeof appRouter;
