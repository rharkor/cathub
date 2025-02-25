import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { serverTrpc } from "@/lib/trpc/server"

import BasicInfos from "./basic-infos"
import UpdateAvatar from "./update-avatar"

export default async function ProfilePage() {
  const cookiesStore = await cookies()
  const user = await serverTrpc(cookiesStore).me.get()

  // If the user has a sex then it means the user has already completed the advanced profile
  if (!!user.sex) {
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
