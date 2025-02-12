"use client"
import { redirect } from "next/navigation"
import React from "react"

import { useSession } from "@/contexts/use-session"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { session } = useSession()

  if (!session) {
    return redirect("/login")
  }

  return <>{children}</>
}
