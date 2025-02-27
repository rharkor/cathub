import { cookies } from "next/headers"

import { serverTrpc } from "@/lib/trpc/server"

import CreatorProfile from "./creator-profile"

export default async function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const cookiesStore = await cookies()

  const { id } = await params

  const creator = await serverTrpc(cookiesStore).creator.getCreator({ id })
  const currentUser = await serverTrpc(cookiesStore).me.get()

  return <CreatorProfile creator={creator} currentUser={currentUser} />
}
