"use client"
import React from "react"

import Header from "@/components/ui/header"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto px-3 pb-6 pt-12">
      <Header />
      {children}
    </main>
  )
}
