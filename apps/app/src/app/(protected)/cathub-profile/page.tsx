import { cookies } from "next/headers"

import { serverTrpc } from "@/lib/trpc/server"

import BasicInfos from "./basic-infos"

export default async function CathubProfilePage() {
  const cookiesStore = await cookies()
  const ssrUser = await serverTrpc(cookiesStore).me.get()

  return (
    <section className="flex flex-1 flex-col items-center gap-4">
      <BasicInfos ssrUser={ssrUser} />
    </section>
  )
}
