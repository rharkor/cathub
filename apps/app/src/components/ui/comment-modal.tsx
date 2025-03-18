"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@heroui/react"
import { useState } from "react"
import { toast } from "react-toastify"

import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"

interface CommentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  postId: string
}

export default function CommentModal({ isOpen, onOpenChange, postId }: CommentModalProps) {
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { session } = useSession()
  const utils = trpc.useUtils()

  const commentMutation = trpc.comment.postComment.useMutation({
    onSuccess: () => {
      toast.success("Commentaire ajouté avec succès!")
      setCommentText("")
      onOpenChange(false)
      utils.comment.getComments.invalidate({ postId })
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue lors de l'ajout du commentaire")
      setIsSubmitting(false)
    },
  })

  const handleSubmitComment = async () => {
    if (!session) {
      toast.error("Vous devez être connecté pour commenter")
      return
    }

    if (!commentText.trim()) {
      toast.error("Le commentaire ne peut pas être vide")
      return
    }

    setIsSubmitting(true)
    try {
      await commentMutation.mutateAsync({
        text: commentText,
        postId,
      })
    } catch (error) {
      console.error("Error posting comment:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Ajouter un commentaire</ModalHeader>
        <ModalBody>
          <Textarea
            placeholder="Écrivez votre commentaire ici..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            minRows={3}
            maxRows={6}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" color="danger" onPress={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button color="primary" onPress={handleSubmitComment} isLoading={isSubmitting}>
            Publier
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
