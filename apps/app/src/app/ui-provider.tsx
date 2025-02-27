"use client"

import { HeroUIProvider } from "@heroui/react"

export default function RootNextUIProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider className="flex h-full flex-col gap-2">{children}</HeroUIProvider>
}
