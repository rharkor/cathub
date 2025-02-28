export default function ProjectBanner() {
  return (
    <div className="w-full bg-black p-6 text-white shadow-lg">
      <div className="container mx-auto space-y-4">
        <h2 className="text-2xl font-bold">
          Vous pensez que les chats font miaou miaou grr grr quand vous n&apos;êtes pas présents ? <span className="bg-orange-500 px-2 py-1 text-black">Non</span>
        </h2>
        
        <p className="text-xl">
          Les chats vont sur <span className="bg-orange-500 px-2 py-1 text-black">Cathub</span>.
        </p>
        
        <p className="text-xl">
          <span className="bg-orange-500 px-2 py-1 text-black">Cathub</span> est un réseau social de rencontre entre chats. Ils peuvent poster des photos, des billets d&apos;humeur, les partager avec la communauté.
        </p>
        
        <div className="flex justify-center pt-4">
          <h3 className="text-2xl font-semibold">
            Faites des rencontres <span className="bg-orange-500 px-2 py-2 text-black rounded-md">et tarifez-les</span>
          </h3>
        </div>
      </div>
    </div>
  )
}
