import { AppRouter } from "@cathub/api-routes"
import { logger } from "@rharkor/logger"
import { TRPCClientErrorLike } from "@trpc/client"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { toast } from "react-toastify"

type TOptions = {
  showNotification: boolean
}

export const handleQueryError = <T extends TRPCClientErrorLike<AppRouter>>(
  error: T,
  router: AppRouterInstance,
  opts: TOptions = { showNotification: true }
): T => {
  const resp = handleApiError(error, router)
  logger.error("Query error:", resp)
  if (opts.showNotification) {
    toast.error(resp.message, {
      toastId: error.message,
    })
  }
  return resp
}

export const handleMutationError = <T extends TRPCClientErrorLike<AppRouter>>(
  error: T,
  router: AppRouterInstance,
  opts: TOptions = { showNotification: true }
): T => {
  const resp = handleApiError(error, router)
  logger.error("Mutation error:", resp)
  if (opts.showNotification) {
    toast.error(resp.message, {
      toastId: error.message,
    })
  }
  return resp
}

export const handleApiError = <T extends TRPCClientErrorLike<AppRouter>>(error: T, router: AppRouterInstance): T => {
  try {
    if (error.data?.code === "UNAUTHORIZED") {
      router.push("/login")
    }
    return {
      ...error,
      message: error.message,
    }
    // const parsedError = JSON.parse(error.message)
    // const translatedError = parsedError.message
    // const avoidRedirect = parsedError.extra && "redirect" in parsedError.extra && parsedError.extra.redirect === false
    // if (error.data?.code === "UNAUTHORIZED" && !avoidRedirect) {
    //   router.push("/login")
    // }

    // return {
    //   ...error,
    //   message: translatedError,
    // }
  } catch {
    return {
      ...error,
      message: "Une erreur est survenue",
    }
  }
}
