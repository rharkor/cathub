import { type AppRouter } from "@cathub/api-routes"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import SuperJSON from "superjson"

export const trpc = createTRPCReact<AppRouter>({})

export const trpcClient = trpc.createClient({
  links: [
    // adds pretty logs to your console in development and logs errors in production
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" && typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    // splitLink({
    //   condition(op) {
    //     return op.type === "subscription"
    //   },
    //   true: wsLink({
    //     client: wsClient,
    //   }),
    //   false: httpBatchLink({
    //     url: getUrl(),
    //   }),
    // }),
    unstable_httpBatchStreamLink({
      url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
      transformer: SuperJSON,
    }),
  ],
})
