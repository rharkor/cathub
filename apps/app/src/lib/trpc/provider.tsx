"use client"
import { logger } from "@rharkor/logger"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from "react"

import { trpc, trpcClient } from "./client"

export default function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            logger.error("Query error", error)
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            logger.error("Mutation error", error)
          },
        }),
      })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <div className="max-lg:hidden">
            <ReactQueryDevtools initialIsOpen={false} />
          </div> */}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
