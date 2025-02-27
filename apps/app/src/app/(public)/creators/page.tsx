import { cookies } from "next/headers"

import { serverTrpc } from "@/lib/trpc/server"

import CreatorsList from "./creators-list"

export default async function CreatorsPage() {
  const cookiesStore = await cookies()

  const creators = await serverTrpc(cookiesStore).creator.getCreators({ page: 0, limit: 20 })

  return <CreatorsList creators={creators} />
}
