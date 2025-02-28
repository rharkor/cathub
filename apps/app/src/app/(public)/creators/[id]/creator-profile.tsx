"use client"

import { creatorSchemas } from "@cathub/api-routes/schemas"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react"
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "react-toastify"
import { z } from "zod"

import KibbleIcon from "@/components/icons/kibble"
import ProfileBasicInfos from "@/components/profile/infos"
import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"

interface CreatorProfileProps {
  creator: z.infer<ReturnType<typeof creatorSchemas.getCreatorResponseSchema>>
}

export default function CreatorProfile({ creator }: CreatorProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const { session } = useSession()

  // This would be replaced with an actual follow mutation
  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? "Vous ne suivez plus ce créateur" : "Vous suivez maintenant ce créateur")
  }

  const isMyProfile = creator.id === session?.userId

  // Fetch creator data from API
  const creatorQuery = trpc.creator.getCreator.useQuery(
    { id: creator.id },
    {
      enabled: !!creator.id,
      placeholderData: creator,
    }
  )

  // Fetch creator's posts
  const postsQuery = trpc.post.getPosts.useQuery(
    { userId: creator.id },
    {
      enabled: !!creator.id,
    }
  )

  const postCount = postsQuery.data?.posts.length || 0

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6 flex items-center">
        <Button as={Link} href="/creators" variant="light" className="mr-2" startContent={<ArrowLeft size={18} />}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Profil Créateur</h1>
      </div>

      {/* Creator Stats Card */}
      <Card className="mb-6 w-full">
        <CardHeader className="flex flex-col gap-2 px-6 py-4">
          <h2 className="text-xl font-semibold">Statistiques du créateur</h2>
        </CardHeader>
        <Divider />
        <CardBody className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg bg-content2 p-4">
            <span className="text-2xl font-bold">{creatorQuery.data?._count?.likes || 0}</span>
            <span className="text-sm text-default-500">Abonnés</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-content2 p-4">
            <span className="text-2xl font-bold">{postCount}</span>
            <span className="text-sm text-default-500">Posts</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-content2 p-4">
            <div className="flex items-center gap-1">
              <KibbleIcon className="size-5" />
              <span className="text-2xl font-bold">{creatorQuery.data?.price || 0}</span>
            </div>
            <span className="text-sm text-default-500">Prix</span>
          </div>
        </CardBody>
        <CardFooter className="flex justify-end gap-2 px-6 py-4">
          {!isMyProfile && (
            <>
              <Button
                color={isFollowing ? "default" : "primary"}
                variant={isFollowing ? "flat" : "solid"}
                onPress={handleFollow}
                startContent={<Heart size={18} />}
              >
                {isFollowing ? "Ne plus suivre" : "Suivre"}
              </Button>
              <Button color="secondary" variant="flat" startContent={<MessageCircle size={18} />}>
                Message
              </Button>
              <Button color="default" variant="flat" startContent={<Share2 size={18} />}>
                Partager
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

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
