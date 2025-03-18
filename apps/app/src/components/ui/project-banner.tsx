export default function ProjectBanner() {
  return (
    <div className="w-full bg-black p-6 text-center font-bold text-primary">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-2xl">
          Vous pensez que les chats font miaou miaou grr grr quand vous n&apos;êtes pas présents ?{" "}
          <span className="text-white">N</span>
          <span className="rounded-md bg-primary p-1 text-black">on</span>
        </h1>
        <h1 className="text-2xl">
          Les chats vont sur <span className="text-white">Cat</span>
          <span className="rounded-md bg-primary p-1 text-black">hub</span>
        </h1>
        <h1 className="text-2xl">
          <span className="text-white">Cat</span>
          <span className="rounded-md bg-primary p-1 text-black">hub</span>
          est un réseau social de rencontre entre chats. Ils peuvent poster des photos, des billets d&apos;humeur, les
          partager avec la communauté.
        </h1>
        <h1 className="text-2xl">
          <span className="text-white">Faites des rencontres</span>{" "}
          <span className="rounded-md bg-primary p-1 text-black">et tarifez-les</span>
        </h1>
      </div>
    </div>
  )
}
