"use client"

import { meSchemas } from "@cathub/api-routes/schemas"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider } from "@heroui/react"
import { Category, File, Post, User as UserModel } from "@prisma/client"
import { ArrowLeft, Heart, MessageCircle, Share2, Trash } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import { z } from "zod"

import UserProfile from "@/components/profile/user-header-profile-post"
import { trpc } from "@/lib/trpc/client"
import { getCategoryLabel, getImageUrl } from "@/lib/utils"

type PostWithImageAndUser = Post & {
  image: File | null
  user?: z.infer<ReturnType<typeof meSchemas.userSchema>>
}

interface PostDetailsProps {
  post: PostWithImageAndUser
  currentUser: UserModel
}

export default function PostDetails({ post, currentUser }: PostDetailsProps) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [isDeleting, setIsDeleting] = useState(false)

  const deletePostMutation = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      toast.success("Post supprimé avec succès!")
      utils.post.getPosts.invalidate()
      router.push("/cathub-profile")
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue lors de la suppression du post")
      setIsDeleting(false)
    },
  })

  const handleDeletePost = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      setIsDeleting(true)
      try {
        await deletePostMutation.mutateAsync({ id: post.id })
      } catch (error) {
        console.error("Error deleting post:", error)
        setIsDeleting(false)
      }
    }
  }

  const isOwner = post.userId === currentUser.id

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center">
        <Button variant="light" onPress={() => router.back()} className="mr-2" startContent={<ArrowLeft size={18} />}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails du post</h1>
      </div>

      {/* Creator Profile Card */}
      {post.user && (
        <Card className="mb-6 w-full">
          <CardBody className="p-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {/* User info section */}
              <div className="flex w-full flex-col">
                <UserProfile
                  name={post.user?.username}
                  description={post.user?.description || "Pas de description"}
                  avatarProps={{
                    src: post.user?.profilePicture ? getImageUrl(post.user.profilePicture) || "" : undefined,
                    showFallback: true,
                    fallback: post.user?.username?.slice(0, 3) || "?",
                    size: "sm",
                  }}
                  currentUser={currentUser}
                  userId={post.user?.id}
                  price={post.user?.price ?? undefined}
                  age={post.user?.age ?? undefined}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="w-full">
        {post.image && (
          <CardHeader className="p-0">
            <div className="relative aspect-video w-full">
              <Image
                src={getImageUrl(post.image) ?? ""}
                alt={post.text}
                fill
                className="z-10 object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <Image
                src={getImageUrl(post.image) ?? ""}
                alt={post.text}
                fill
                className="object-cover blur-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </CardHeader>
        )}
        <CardBody className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.category.map((cat: Category) => (
              <Chip key={cat} variant="flat">
                {getCategoryLabel(cat)}
              </Chip>
            ))}
          </div>
          <p className="whitespace-pre-wrap text-lg">{post.text}</p>
          <div className="mt-4 text-sm text-default-400">
            Publié le {new Date(post.createdAt).toLocaleDateString()} à {new Date(post.createdAt).toLocaleTimeString()}
          </div>
        </CardBody>
        <CardFooter className="justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Button variant="light" startContent={<Heart size={18} />}>
              J&apos;aime
            </Button>
            <Button variant="light" startContent={<MessageCircle size={18} />}>
              Commenter
            </Button>
            <Button variant="light" startContent={<Share2 size={18} />}>
              Partager
            </Button>
          </div>
          {isOwner && (
            <Button
              color="danger"
              variant="flat"
              startContent={<Trash size={18} />}
              isLoading={isDeleting}
              onPress={handleDeletePost}
            >
              Supprimer
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Future Comment Section */}
      <Card className="mt-6 w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Commentaires</h2>
        </CardHeader>
        <Divider />
        <CardBody className="p-6">
          <div className="flex flex-col gap-4">
            {/* Comment form will go here */}
            <div className="rounded-lg bg-content2 p-4 text-center">
              <p className="text-default-500">
                La section commentaires sera bientôt disponible. Restez à l&apos;écoute !
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
