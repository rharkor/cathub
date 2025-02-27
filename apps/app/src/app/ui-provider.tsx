"use client"

import { HeroUIProvider } from "@heroui/react"

export default function RootNextUIProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider className="">{children}</HeroUIProvider>
}
