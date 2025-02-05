import { type AppRouter } from "@cathub/api-routes"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import SuperJSON from "superjson"

import { env } from "../env"

export const trpc = createTRPCReact<AppRouter>({})

export const trpcClient = trpc.createClient({
  links: [
    // adds pretty logs to your console in development and logs errors in production
    loggerLink({
      enabled: (opts) =>
        (env.NEXT_PUBLIC_ENV === "development" && typeof window !== "undefined") ||
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
      url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
      transformer: SuperJSON,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include", // ensures cookies from the browser are sent
        })
      },
    }),
  ],
})
