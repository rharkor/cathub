import { cookies } from "next/headers"

import { serverTrpc } from "@/lib/trpc/server"

import CreatorProfile from "./creator-profile"

export default async function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const cookiesStore = await cookies()

  const { id } = await params

  const creator = await serverTrpc(cookiesStore).creator.getCreator({ id })

  return <CreatorProfile creator={creator} />
}
