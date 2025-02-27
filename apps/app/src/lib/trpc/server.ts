import { appRouter, createContext } from "@cathub/api-routes"
import { logger } from "@rharkor/logger"
import { TRPCError } from "@trpc/server"
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { redirect } from "next/navigation"

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
const _serverTrpc = (cookies: ReadonlyRequestCookies) =>
  createCallerFactory()(appRouter)(
    createContext({
      req: {
        headers: {
          cookie: cookies
            .getAll()
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; "),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  )

type RecursiveProxy = {
  [key: string]: RecursiveProxy
  (): void
}

function noop() {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolvePath(obj: any, path: string[]): any {
  return path.reduce((currentObject, key) => currentObject?.[key], obj)
}

function createRecursiveProxy(path: string[] = [], cookies: ReadonlyRequestCookies): RecursiveProxy {
  return new Proxy(noop, {
    get(target, prop, receiver) {
      if (typeof prop === "string") {
        return createRecursiveProxy([...path, prop], cookies)
      }
      return Reflect.get(target, prop, receiver)
    },
    apply(target, thisArg, args) {
      //* Call the server trpc function
      return handleServerError(resolvePath(_serverTrpc(cookies), path)(...args), {
        path,
      })
    },
  }) as RecursiveProxy
}

export const serverTrpc = (cookies: ReadonlyRequestCookies) =>
  createRecursiveProxy(undefined, cookies) as unknown as ReturnType<typeof _serverTrpc>

export const handleServerError = async <T>(
  promise: Promise<T>,
  {
    path,
  }: {
    path: string[]
  }
): Promise<T> => {
  try {
    return await promise
  } catch (error) {
    //? if error code is NEXT_REDIRECT
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    if (error instanceof TRPCError) {
      try {
        let data = null
        try {
          data = JSON.parse(error.message)
        } catch {}
        if (error.code === "UNAUTHORIZED") {
          if (typeof data !== "string") {
            const avoidRedirect = data.extra && "redirect" in data.extra && data.extra.redirect === false
            if (!avoidRedirect) {
              redirect("/login")
            }
          }
        } else if (typeof data !== "string") {
          const redirectUrl =
            data.extra && "redirect" in data.extra && data.extra.redirect && typeof data.extra.redirect === "string"
              ? data.extra.redirect
              : undefined
          if (redirectUrl) {
            redirect(redirectUrl)
          }
        }
      } catch (e) {
        if (e instanceof Error && e.message === "NEXT_REDIRECT") {
          throw e
        }
      }
      if (error.code === "UNAUTHORIZED") {
        let data = null
        try {
          data = JSON.parse(error.message)
        } catch {}
        const avoidRedirect =
          typeof data === "object" &&
          data &&
          "extra" in data &&
          data.extra &&
          typeof data.extra === "object" &&
          "redirect" in data.extra &&
          data.extra.redirect === false
        if (!avoidRedirect) {
          redirect("/login")
        }
      }
    }
    logger.error(error, path.join("."))
    const errorOutput: { [key: string]: unknown } = {
      raw: error,
    }
    if (error instanceof Error) {
      errorOutput.message = error.message
      errorOutput.name = error.name
      errorOutput.stack = error.stack
    }
    if (typeof error === "string") {
      try {
        const errorJsonParsed = JSON.parse(error)
        errorOutput.json = errorJsonParsed
      } catch {}
    }
    throw error
  }
}
