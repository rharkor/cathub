"use client"

import { postSchemas } from "@cathub/api-routes/schemas"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, useDisclosure } from "@heroui/react"
import { Category } from "@prisma/client"
import { ArrowLeft, Heart, MessageCircle, Share2, Trash } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import { z } from "zod"

import CommentList from "@/components/comments/comment-list"
import UserProfile from "@/components/profile/user-header-profile-post"
import CommentModal from "@/components/ui/comment-modal"
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

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

  // Get current user data to check liked posts
  const currentUser = trpc.me.get.useQuery(undefined, {
    enabled: !!session,
  })

  // Like post mutation
  const likeMutation = trpc.like.likePost.useMutation({
    onSuccess: async () => {
      await utils.me.get.invalidate()
      await utils.post.invalidate()
    },
  })

  const isLiked = currentUser.data?.user.postLikes?.some((like) => like.postId === post.post.id)

  const handleLikePost = async () => {
    if (!session) {
      // Redirect to login or show login modal
      toast.error("Vous devez être connecté pour liker un post")
      return
    }

    await likeMutation.mutateAsync({
      postId: post.post.id,
      state: isLiked ? "unlike" : "like",
      userId: session.userId,
    })
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center">
        <Button variant="light" onPress={() => router.back()} className="mr-2" startContent={<ArrowLeft size={18} />}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails du post</h1>
      </div>

      <Card className="w-full">
        {post.post.image && (
          <CardHeader className="p-0">
            <div className="relative aspect-video w-full">
              <Image
                src={getImageUrl(post.post.image) ?? ""}
                alt={post.post.text}
                fill
                className="z-10 object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <Image
                src={getImageUrl(post.post.image) ?? ""}
                alt={post.post.text}
                fill
                className="object-cover blur-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </CardHeader>
        )}
        <CardBody className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.post.category.map((cat: Category) => (
              <Chip key={cat} variant="flat" className="bg-primary text-black">
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
        <CardFooter className="justify-between px-6 py-4">
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <Button variant="light" className="text-primary" isIconOnly onPress={handleLikePost}>
              <Heart size={18} style={{ fill: isLiked ? "currentColor" : "none" }} />
=======
            <Button
              variant="light"
              endContent={<Heart size={18} className="shrink-0" style={{ fill: isLiked ? "currentColor" : "none" }} />}
              className="w-max !gap-2 !px-3 text-danger"
              isIconOnly
              onPress={handleLikePost}
            >
              {post.post._count.likes}
>>>>>>> 03b5702fe8d22efba6b9977c389e3a25b206de5c
            </Button>
            <Button color="secondary" variant="flat" startContent={<MessageCircle size={18} />} onPress={onOpen}>
              Commenter
            </Button>
            <Button
              color="default"
              variant="flat"
              startContent={<Share2 size={18} />}
              onPress={() => {
                // Copy link
                navigator.clipboard.writeText(window.location.href)
                toast.success("Lien copié dans le presse-papiers")
              }}
            >
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

<<<<<<< HEAD
      {/* Creator Profile Card */}
      {post.post.user && (
        <Card className="mt-6 w-full">
          <CardBody className="p-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {/* User info section */}
              <div className="flex w-full flex-col">
                <UserProfile
                  name={post.post.user?.username}
                  description={post.post.user?.description || "Pas de description"}
                  avatarProps={{
                    src: post.post.user?.profilePicture ? getImageUrl(post.post.user.profilePicture) || "" : undefined,
                    showFallback: true,
                    fallback: post.post.user?.username?.slice(0, 3) || "?",
                    size: "sm",
                  }}
                  userId={post.post.user?.id}
                  price={post.post.user?.price ?? undefined}
                  age={post.post.user?.age ?? undefined}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

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
=======
      {/* Comment Modal */}
      <CommentModal isOpen={isOpen} onOpenChange={onOpenChange} postId={post.post.id} />

      <CommentList postId={post.post.id} />
>>>>>>> 03b5702fe8d22efba6b9977c389e3a25b206de5c
    </div>
  )
}
