import BasicInfos from "./basic-infos"
import UpdateAvatar from "./update-avatar"

export default function CathubProfilePage() {
  return (
    <section className="flex flex-1 flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-4">
        <UpdateAvatar />
        <BasicInfos />
      </div>
    </section>
  )
}
