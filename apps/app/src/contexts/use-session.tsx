"use client"

import { Session } from "@cathub/api-routes/types"
import { deleteCookie, getCookie } from "cookies-next"
import React, { createContext, useContext, useEffect, useState } from "react"

import { parseJwt } from "@/lib/jwt"

export type SessionContextType = {
  token: string | null
  session: Session | null
  setToken: (token: string | null) => void
  signOut: () => void
}

// Create the context with an initial undefined value
const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({
  children,
  ssrToken,
  ssrPayload,
}: {
  children: React.ReactNode
  ssrToken: string | null
  ssrPayload: Session | null
}) {
  const [token, setTokenState] = useState<string | null>(ssrToken)
  const [payload, setPayload] = useState<Session | null>(ssrPayload)

  // When the provider mounts, attempt to read and decode the token from the cookie
  useEffect(() => {
    const storedToken = getCookie("token")
    if (storedToken && typeof storedToken === "string") {
      setTokenState(storedToken)
      setPayload(parseJwt(storedToken))
    }
  }, [])

  const setToken = (newToken: string | null) => {
    setTokenState(newToken)
    if (newToken) {
      setPayload(parseJwt(newToken))
    } else {
      setPayload(null)
    }
  }

  const signOut = () => {
    // Remove the token from cookies and clear the session state
    deleteCookie("token", { path: "/" })
    setTokenState(null)
    setPayload(null)
  }

  return (
    <SessionContext.Provider value={{ token, session: payload, setToken, signOut }}>{children}</SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
