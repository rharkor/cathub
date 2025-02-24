"use client"
import { AppRouter } from "@cathub/api-routes"
import { logger } from "@rharkor/logger"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TRPCClientError, TRPCClientErrorLike } from "@trpc/client"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "react-toastify"

import { trpc, trpcClient } from "./client"
import { handleMutationError, handleQueryError } from "./utils"

const testNoDefaultErrorHandling = (query: unknown) =>
  typeof query === "object" &&
  query &&
  "meta" in query &&
  typeof query.meta === "object" &&
  query.meta &&
  "noDefaultErrorHandling" in query.meta &&
  query.meta.noDefaultErrorHandling

export default function TrpcProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (testNoDefaultErrorHandling(query)) return
            if (error instanceof TRPCClientError) {
              handleQueryError(error as TRPCClientErrorLike<AppRouter>, router)
            } else {
              logger.error("Query error", error)
              toast.error("Une erreur est survenue")
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _v, _c, mutation) => {
            if (testNoDefaultErrorHandling(mutation)) return
            if (error instanceof TRPCClientError) {
              handleMutationError(error as TRPCClientErrorLike<AppRouter>, router)
            } else {
              logger.error("Unknown mutation error", error)
              toast.error("Une erreur est survenue")
            }
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
