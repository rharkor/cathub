"use client"

import { creatorSchemas } from "@cathub/api-routes/schemas"
import { Button } from "@heroui/react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { z } from "zod"

import ProfileBasicInfos from "@/components/profile/infos"
import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"

interface CreatorProfileProps {
  creator: z.infer<ReturnType<typeof creatorSchemas.getCreatorResponseSchema>>
}

export default function CreatorProfile({ creator }: CreatorProfileProps) {
  const { session } = useSession()
  const isMyProfile = creator.id === session?.userId

  // Fetch creator data from API
  const creatorQuery = trpc.creator.getCreator.useQuery(
    { id: creator.id },
    {
      enabled: !!creator.id,
      placeholderData: creator,
    }
  )

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6 flex items-center">
        <Button as={Link} href="/creators" variant="light" className="mr-2" startContent={<ArrowLeft size={18} />}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Profil Créateur</h1>
      </div>

      {/* Profile Basic Info */}
      <ProfileBasicInfos
        isLoading={creatorQuery.isLoading}
        onEditProfile={() => {}}
        user={creatorQuery.data}
        isMyProfile={isMyProfile}
      />
    </div>
  )
}
