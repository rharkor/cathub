import Image from "next/image"

import CatHubLogo from "/cathub.png"

import LoginForm from "./form-login"

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Image src={CatHubLogo} alt="" width={200} height={200} />
        <LoginForm />
      </div>
    </>
  )
}
