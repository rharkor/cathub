"use client"

import { creatorSchemas } from "@cathub/api-routes/schemas"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Skeleton } from "@heroui/react"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { z } from "zod"

import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"
import { cn, getCategoryLabel, getImageUrl } from "@/lib/utils"

import KibbleIcon from "../icons/kibble"
import UpdateAvatar from "./update-avatar"

export default function ProfileBasicInfos({
  user,
  onEditProfile,
  isLoading,
  isMyProfile,
}: {
  user: z.infer<ReturnType<typeof creatorSchemas.getCreatorResponseSchema>> | undefined
  onEditProfile: () => void
  isLoading: boolean
  isMyProfile?: boolean
}) {
  const getPostsQuery = trpc.post.getPosts.useQuery(
    { userId: user?.id ?? "" },
    {
      enabled: !!user,
    }
  )

  const utils = trpc.useUtils()

  const followMutation = trpc.like.likeUserProfile.useMutation({
    onSuccess: async () => {
      await utils.me.get.invalidate()
      await utils.creator.invalidate()
    },
  })

  const { session } = useSession()
  const currentUser = trpc.me.get.useQuery(undefined, {
    enabled: !!session,
  })
  const isFollowing = currentUser.data?.user.likedUsers.some((likedUser) => likedUser.userId === user?.id)

  const handeChangeFollow = async () => {
    if (!user) return
    if (isFollowing) {
      await followMutation.mutateAsync({ userId: user.id, state: "unlike" })
    } else {
      await followMutation.mutateAsync({ userId: user.id, state: "like" })
    }
  }
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-4">
            <div className="relative size-64 overflow-hidden rounded-xl">
              {isMyProfile ? (
                <UpdateAvatar />
              ) : (
                <Skeleton
                  isLoaded={!isLoading}
                  className={cn("size-full rounded-full")}
                  classNames={{
                    content: "size-full",
                  }}
                >
                  <div className="relative size-full overflow-hidden rounded-full bg-content3 text-large">
                    {user?.profilePicture ? (
                      <Image
                        className="size-full object-cover"
                        src={getImageUrl(user?.profilePicture) || ""}
                        alt={user?.username || ""}
                        width={512}
                        height={512}
                      />
                    ) : (
                      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm font-medium lg:text-xl">
                        {user?.username?.slice(0, 3)}
                      </p>
                    )}
                  </div>
                </Skeleton>
              )}
            </div>
            {isMyProfile && (
              <Button color="primary" size="lg" className="w-full font-semibold" onPress={onEditProfile}>
                Mettre à jour mon profil
              </Button>
            )}
          </div>

          <div className="col-span-2 flex flex-col gap-4">
            <Skeleton isLoaded={!isLoading} className="h-12 w-full">
              <h1 className="text-3xl font-bold">{user?.username || "Chargement..."}</h1>
            </Skeleton>

            <div className="flex flex-wrap gap-2">
              {user?.sex && (
                <Skeleton isLoaded={!isLoading} className="rounded-medium">
                  <Chip color="primary" variant="flat">
                    {user?.sex === "FEMALE" ? "Femme" : user?.sex === "MALE" ? "Homme" : "Autre"}
                  </Chip>
                </Skeleton>
              )}

              {user?.age && (
                <Skeleton isLoaded={!isLoading} className="rounded-medium">
                  <Chip variant="flat">{user?.age || "?"} ans</Chip>
                </Skeleton>
              )}

              {user?.price && (
                <Skeleton isLoaded={!isLoading} className="rounded-medium">
                  <Chip
                    color="success"
                    classNames={{
                      content: "flex gap-2 items-center",
                    }}
                    variant="flat"
                  >
                    <KibbleIcon className="size-4" />
                    <p>{user?.price}</p>
                  </Chip>
                </Skeleton>
              )}

              <Skeleton isLoaded={!isLoading} className="rounded-medium">
                <Chip
                  color="secondary"
                  classNames={{
                    content: "flex gap-2 items-center",
                  }}
                  variant="flat"
                >
                  <Heart className="size-4" />
                  <p>{user?._count?.likes || 0} Abonnés</p>
                </Chip>
              </Skeleton>
            </div>

            <Divider className="my-2" />

            <Skeleton isLoaded={!isLoading} className="h-full w-full">
              <div className="rounded-lg bg-content2 p-4">
                <h3 className="mb-2 text-lg font-semibold">À propos {isMyProfile && "de moi"}</h3>
                <p className="text-content3-foreground">{user?.description || "Aucune description fournie."}</p>
              </div>
            </Skeleton>

            <div className="flex gap-2">
              {!isMyProfile && (
                <>
                  <Button
                    color={isFollowing ? "default" : "primary"}
                    variant={isFollowing ? "flat" : "solid"}
                    onPress={handeChangeFollow}
                    startContent={<Heart size={18} />}
                  >
                    {isFollowing ? "Ne plus suivre" : "Suivre"}
                  </Button>
                  <Button color="secondary" variant="flat" startContent={<MessageCircle size={18} />}>
                    Message
                  </Button>
                </>
              )}
              <Button color="default" variant="flat" startContent={<Share2 size={18} />}>
                Partager
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Posts récents</h2>
            {isMyProfile && (
              <Link href="/cathub-profile/create-post">
                <Button color="primary">Créer un post</Button>
              </Link>
            )}
          </div>

          {getPostsQuery.isPending ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          ) : getPostsQuery.data?.posts && getPostsQuery.data.posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getPostsQuery.data.posts
                .filter((post) => post.userId === user?.id)
                .map((post) => (
                  <Card key={post.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                    <Link href={`/post/${post.id}`} className="cursor-pointer">
                      {post.image && (
                        <CardHeader className="p-0">
                          <Image
                            src={getImageUrl(post.image) ?? ""}
                            alt={post.text}
                            width={400}
                            height={300}
                            className="aspect-video w-full object-cover"
                          />
                        </CardHeader>
                      )}
                      <CardBody className="p-4">
                        <p className="line-clamp-3">{post.text}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {post.category.map((cat) => (
                            <Chip key={cat} variant="flat" size="sm">
                              {getCategoryLabel(cat)}
                            </Chip>
                          ))}
                        </div>
                      </CardBody>
                    </Link>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Button isIconOnly variant="light" size="sm">
                          <Heart size={16} />
                        </Button>
                        <Button isIconOnly variant="light" size="sm">
                          <MessageCircle size={16} />
                        </Button>
                      </div>
                      <span className="text-sm text-default-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="rounded-lg bg-content2 p-8 text-center">
              <p className="mb-4 text-lg font-medium">Pas encore de posts</p>
              {isMyProfile && (
                <>
                  <p className="mb-4 text-content3-foreground">Les posts que vous créez apparaîtront ici</p>
                  <Link href="/cathub-profile/create-post">
                    <Button color="primary">Créer mon premier post</Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
