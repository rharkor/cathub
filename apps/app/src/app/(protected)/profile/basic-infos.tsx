"use client"

import { Button, Input } from "@heroui/react"
import Link from "next/link"

import { trpc } from "@/lib/trpc/client"

export default function BasicInfos() {
  const utils = trpc.useUtils()
  const getAccountQuery = trpc.me.get.useQuery()

  return (
    <>
      <div className="flex flex-col gap-2">
        <Input label="Email" className="w-[300px]" isDisabled value={getAccountQuery.data?.email} />
        <Input
          label="Nom d'utilisateur"
          className="w-[300px]"
          isDisabled={getAccountQuery.isLoading}
          value={getAccountQuery.data?.username}
        />
      </div>
      <Link href={"/cathub-profile"} className="w-full">
        <Button color="primary" className="w-full">
          Profil créateur
        </Button>
      </Link>
    </>
  )
}
