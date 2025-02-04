"use client"

import { Avatar } from "@heroui/react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const Header = () => {
  return (
    <nav className="bg-black px-4 py-2">
      <div className="mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/cathub.png" alt="" width={100} height={100} className="rounded-lg" />
        </Link>
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-6 text-white hover:text-primary">
            <Link href="/chats">Chats</Link>
          </div>
          <Avatar className="h-8 w-8 cursor-pointer" name="John Doe" />
        </div>
      </div>
    </nav>
  )
}

export default Header
