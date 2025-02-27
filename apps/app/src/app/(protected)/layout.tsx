"use client"
import { redirect } from "next/navigation"
import React from "react"

import Header from "@/components/ui/header"
import { useSession } from "@/contexts/use-session"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { session } = useSession()

  if (!session) {
    return redirect("/login")
  }

  return (
    <main className="container mx-auto px-3 pb-6 pt-24">
      <Header />
      {children}
    </main>
  )
}
