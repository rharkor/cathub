"use client"

import { Avatar, Card, CardBody, Spinner } from "@heroui/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"
import { getImageUrl } from "@/lib/utils"

interface CommentListProps {
  postId: string
}

export default function CommentList({ postId }: CommentListProps) {
  const { data: comments, isLoading } = trpc.comment.getComments.useQuery({ postId })
  const { session } = useSession()

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="py-4 text-center text-default-500">
        <p>Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <Card key={comment.id} className={comment.isDeleted ? "opacity-50" : ""}>
          <CardBody className="p-4">
            {comment.isDeleted ? (
              <p className="italic text-default-400">Ce commentaire a été supprimé</p>
            ) : (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <Avatar
                    src={comment.user?.profilePicture ? getImageUrl(comment.user.profilePicture) || "" : undefined}
                    showFallback
                    fallback={comment.user?.username?.slice(0, 3) || "?"}
                    size="sm"
                  />
                  <div>
                    <p className="font-semibold">{comment.user?.username || "Utilisateur inconnu"}</p>
                    <p className="text-xs text-default-400">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                </div>
                <p className="whitespace-pre-wrap">{comment.text}</p>
              </>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
