import Image from "next/image"
import React from "react"

import Logo from "../../../public/logo.png"
import RegisterForm from "./form-register"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Image src={Logo} alt="" width={200} height={200} />
      <RegisterForm />
    </div>
  )
}
