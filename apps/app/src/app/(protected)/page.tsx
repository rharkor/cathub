"use client"

import { Button } from "@heroui/react"

import { env } from "@/lib/env"

export default function Home() {
  return <Button>Test env {env.NEXT_PUBLIC_ENV}</Button>
}
