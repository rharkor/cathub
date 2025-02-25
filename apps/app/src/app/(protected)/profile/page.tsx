import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { serverTrpc } from "@/lib/trpc/server"

import BasicInfos from "./basic-infos"
import UpdateAvatar from "./update-avatar"

export default async function ProfilePage() {
  const cookiesStore = await cookies()
  const user = await serverTrpc(cookiesStore).me.get()
  if (user.isCathub) {
    redirect("/cathub-profile")
  }

  return (
    <section className="flex flex-1 flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-4">
        <UpdateAvatar />
        <BasicInfos />
      </div>
    </section>
  )
}
