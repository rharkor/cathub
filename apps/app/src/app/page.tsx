"use client"

import { Button } from "@heroui/react"

import { trpc } from "@/lib/trpc/client"

export default function Home() {
  const { data } = trpc.me.test.useQuery()
  console.log(data)
  return <Button>Test</Button>
}
