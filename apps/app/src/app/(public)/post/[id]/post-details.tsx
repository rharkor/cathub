"use client"

import { postSchemas } from "@cathub/api-routes/schemas"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, User } from "@heroui/react"
import { Category } from "@prisma/client"
import { ArrowLeft, Heart, MessageCircle, Share2, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import { z } from "zod"

import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"
import { getCategoryLabel, getImageUrl } from "@/lib/utils"

interface PostDetailsProps {
  post: z.infer<ReturnType<typeof postSchemas.getPostByIdResponseSchema>>
}

export default function PostDetails({ post }: PostDetailsProps) {
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
        await deletePostMutation.mutateAsync({ id: post.post.id })
      } catch (error) {
        console.error("Error deleting post:", error)
        setIsDeleting(false)
      }
    }
  }

  const { session } = useSession()

  const isOwner = post.post.userId === session?.userId

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center">
        <Button
          as={Link}
          href="/cathub-profile"
          variant="light"
          className="mr-2"
          startContent={<ArrowLeft size={18} />}
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails du post</h1>
      </div>

      {/* Creator Profile Card */}
      {post.post.user && (
        <Card className="mb-6 w-full">
          <CardBody className="p-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {/* User info section */}
              <div className="flex flex-grow items-center gap-3">
                <User
                  name={post.post.user?.username}
                  description={post.post.user?.description || "Pas de description"}
                  avatarProps={{
                    src: post.post.user?.profilePicture ? getImageUrl(post.post.user.profilePicture) || "" : undefined,
                    showFallback: true,
                    fallback: post.post.user?.username?.slice(0, 3) || "?",
                    size: "md",
                  }}
                />
                <div className="flex flex-wrap justify-end gap-2">
                  {post.post.user?.price && (
                    <Chip color="success" variant="flat">
                      {post.post.user?.price} Kibbles
                    </Chip>
                  )}
                  {post.post.user?.age && (
                    <Chip variant="flat" size="sm">
                      {post.post.user?.age} ans
                    </Chip>
                  )}
                </div>
              </div>
              <Button
                as={Link}
                href={`/creators/${post.post.user?.id}`}
                color="primary"
                variant="flat"
                size="sm"
                className="mt-1"
              >
                Voir profil
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="w-full">
        {post.post.image && (
          <CardHeader className="p-0">
            <div className="relative aspect-video w-full">
              <Image
                src={getImageUrl(post.post.image) ?? ""}
                alt={post.post.text}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </CardHeader>
        )}
        <CardBody className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.post.category.map((cat: Category) => (
              <Chip key={cat} variant="flat">
                {getCategoryLabel(cat)}
              </Chip>
            ))}
          </div>
          <p className="whitespace-pre-wrap text-lg">{post.post.text}</p>
          <div className="mt-4 text-sm text-default-400">
            Publié le {new Date(post.post.createdAt).toLocaleDateString()} à{" "}
            {new Date(post.post.createdAt).toLocaleTimeString()}
          </div>
        </CardBody>
        <CardFooter className="flex justify-between border-t border-divider px-6 py-4">
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
