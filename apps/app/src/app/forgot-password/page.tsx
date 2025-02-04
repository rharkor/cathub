import Image from "next/image"
import React from "react"

import CatHubLogo from "/cathub.png"

import FormForgotPassword from "./form-forgot-password"

const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Image src={CatHubLogo} alt="" width={200} height={200} />
      <FormForgotPassword />
    </div>
  )
}

export default ForgotPassword
