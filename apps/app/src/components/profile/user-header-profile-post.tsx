import { Button, Chip } from "@heroui/react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export default function UserProfile({
  name,
  description,
  avatarProps,
  userId,
  price,
  age,
  showActionButton = true,
}: {
  name?: string
  description?: string
  avatarProps: {
    src?: string
    showFallback?: boolean
    fallback?: string
    size?: "sm" | "md" | "lg"
  }
  userId?: string
  price?: number
  age?: number
  showActionButton?: boolean
}): React.ReactElement {
  const avatarSize = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  }[avatarProps.size || "md"]

  return (
    <div className="w-full overflow-hidden rounded-xl p-4 text-white">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex w-full flex-1 items-center gap-4">
          <div
            className={`relative overflow-hidden rounded-full ${avatarSize} flex items-center justify-center bg-primary-100 ring-2 ring-primary-500`}
          >
            {avatarProps.src ? (
              <Image src={avatarProps.src} alt={name || "Avatar"} fill className="object-cover" />
            ) : avatarProps.showFallback ? (
              <span className="text-lg font-medium text-primary-600">{avatarProps.fallback}</span>
            ) : null}
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold">{name}</h3>
            <p className="text-sm text-gray-300">{description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {price !== undefined && (
                <Chip color="success" variant="flat" className="text-xs">
                  {price} Kibbles
                </Chip>
              )}
              {age !== undefined && (
                <Chip variant="flat" size="sm" className="text-xs">
                  {age} ans
                </Chip>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-end">
        {showActionButton && userId && (
          <Button
            as={Link}
            href={`/creators/${userId}`}
            color="primary"
            variant="flat"
            size="sm"
            className="mt-2 self-end sm:mt-0 sm:self-center"
          >
            Voir profil
          </Button>
        )}
      </div>
    </div>
  )
}
