"use client"
import React from "react"

import Header from "@/components/ui/header"
import ProjectBanner from "@/components/ui/project-banner"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto px-3 pb-6 pt-12">
      <Header />
      <ProjectBanner />
      {children}
    </main>
  )
}
