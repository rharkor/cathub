"use client"

import { Button } from "@heroui/react"

import { env } from "@/lib/env"
import { trpc } from "@/lib/trpc/client"

export default function Home() {
  const { data } = trpc.me.test.useQuery()
  console.log(data)
  return <Button>Test env {env.NEXT_PUBLIC_ENV}</Button>
}
