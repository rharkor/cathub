import Image from "next/image"

import LoginForm from "./form-login"

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Image className="mb-10" src={"/cathub.png"} alt="logo" width={200} height={200} />
        <LoginForm />
      </div>
    </>
  )
}
