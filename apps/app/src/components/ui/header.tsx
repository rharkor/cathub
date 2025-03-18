"use client"

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"

import Image from "next/image"
import Link from "next/link"
import React from "react"
import { getImageUrl } from "@/lib/utils"
import { logger } from "@rharkor/logger"
import { toast } from "react-toastify"
import { trpc } from "@/lib/trpc/client"
import { useSession } from "@/contexts/use-session"

const Header = () => {
  const { signOut, session } = useSession()
  const userQuery = trpc.me.get.useQuery(undefined, {
    meta: {
      noDefaultErrorHandling: true,
    },
    enabled: !!session,
  })

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Déconnexion réussie")
    } catch (error) {
      toast.error("Erreur lors de la déconnexion")
      logger.error(error)
    }
  }

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 h-[55px] border-b border-primary bg-background px-4 py-2"
        data-testid="navbar-header"
      >
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image src="/cathub.png" alt="" width={100} height={100} className="h-[38px] rounded-lg" />
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <Button as={Link} href="/creators" variant="light">
                CRÉATEURS
              </Button>
            </div>
          </div>
          {!!session ? (
            <Dropdown>
              <DropdownTrigger>
                <div className="relative size-10 cursor-pointer overflow-hidden rounded-full bg-default-100">
                  {userQuery.data?.user.profilePicture ? (
                    <Image
                      src={getImageUrl(userQuery.data.user.profilePicture) ?? ""}
                      className="size-full object-cover"
                      alt="Profile picture"
                      width={60}
                      height={60}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-foreground">
                      {userQuery.data?.user.username?.slice(0, 2)}
                    </div>
                  )}
                </div>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="profile" as={Link} href="/profile">
                  Profil
                </DropdownItem>
                <DropdownItem key="creators" as={Link} href="/creators">
                  Créateurs
                </DropdownItem>
                <DropdownItem key="sign-out" onPress={handleLogout} color="danger" className="text-danger">
                  Se déconnecter
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button as={Link} href="/login">
              Se connecter
            </Button>
          )}
        </div>
      </nav>
    </>
  )
}

export default Header
