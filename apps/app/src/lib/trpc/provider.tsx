"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

import { AppRouter } from "@cathub/api-routes";
import { logger } from "@rharkor/logger";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { trpc, trpcClient } from "./client";

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            logger.error("Query error", error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _v, _c, mutation) => {
            logger.error("Mutation error", error);
          },
        }),
      })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <div className="max-lg:hidden">
            <ReactQueryDevtools initialIsOpen={false} />
          </div> */}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
