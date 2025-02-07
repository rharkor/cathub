"use client"

import { maxUploadSize } from "@cathub/api-routes/constants"
import { bytesToMegabytes } from "@cathub/api-routes/utils"
import { Avatar, Button, Modal, ModalBody, ModalContent, ModalHeader, Skeleton, Spinner } from "@heroui/react"
import { logger } from "@rharkor/logger"
import { Camera, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"

import FileUpload from "@/components/ui/file-upload"
import { trpc } from "@/lib/trpc/client"
import { cn, getImageUrl } from "@/lib/utils"

export default function UpdateAvatar() {
  const { data: account, isLoading: isAccountLoading } = trpc.me.get.useQuery()
  const getPresignedUrlMutation = trpc.upload.presignedUrl.useMutation()
  const updateUserMutation = trpc.me.update.useMutation()

  const isUpdatePending = getPresignedUrlMutation.isPending || updateUserMutation.isPending

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      toast.error("Veuillez sélectionner un fichier")
      return
    }
    if (file.size > maxUploadSize) {
      toast.error(`Fichier trop volumineux (max: ${bytesToMegabytes(maxUploadSize)}Mo)`)
      return
    }
    setUploading(true)
    try {
      const { url, fields } = await getPresignedUrlMutation.mutateAsync({
        filename: file.name,
        filetype: file.type,
      })

      try {
        const formData = new FormData()
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string)
        })
        formData.append("file", file)

        const uploadResponse = await fetch(url, {
          method: "POST",
          body: formData,
        })

        if (uploadResponse.ok) {
          await updateUserMutation.mutateAsync({
            profilePictureKey: fields.key,
          })

          setShowModal(false)
        } else {
          const xml = await uploadResponse.text()
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(xml, "text/xml")
          const error = xmlDoc.getElementsByTagName("Message")[0]
          if (error.textContent === "Your proposed upload exceeds the maximum allowed size") {
            toast.error(`Fichier trop volumineux (max: ${bytesToMegabytes(maxUploadSize)}Mo)`)
          } else {
            toast.error("Erreur inconnue")
          }
        }
      } catch (e) {
        logger.error(e)
        toast.error("Erreur inconnue")
      }
    } catch {
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    await updateUserMutation.mutateAsync({
      profilePictureKey: null,
    })

    setShowModal(false)
  }

  const [showModal, _setShowModal] = useState(false)
  const setShowModal = (show: boolean) => {
    if (show) {
      const active = document.activeElement as HTMLButtonElement | null
      active?.blur()
    }
    _setShowModal(show)
  }

  return (
    <>
      <div className={cn("group relative h-20 w-20 rounded-full")}>
        <Skeleton isLoaded={!isAccountLoading} className={cn("rounded-full")}>
          <Avatar
            className="!size-20 text-large"
            src={getImageUrl(account?.profilePicture) || undefined}
            name={account?.name || undefined}
            onClick={() => setShowModal(true)}
          />
        </Skeleton>
        <Button
          className={cn(
            "upload-group bg-muted/10 group absolute inset-0 flex h-[unset] cursor-pointer items-center justify-center overflow-hidden rounded-full opacity-0 backdrop-blur-sm transition-all duration-200",
            "focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100",
            {
              hidden: isAccountLoading,
            }
          )}
          onPress={() => setShowModal(true)}
        >
          <Camera className="size-8 transition-all duration-250 group-[.upload-group]:active:scale-95" />
        </Button>
        <Button
          color="danger"
          className={cn(
            "absolute right-0 top-0 h-[unset] min-w-0 rounded-full p-1.5 text-foreground opacity-0 transition-all duration-200 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100",
            {
              hidden: isAccountLoading || !account?.profilePicture,
            }
          )}
          onPress={() => handleDelete()}
        >
          {isUpdatePending ? (
            <Spinner
              classNames={{
                wrapper: "!size-4",
              }}
              color="current"
              size="sm"
            />
          ) : (
            <Trash className="size-4" />
          )}
        </Button>
      </div>
      <Modal isOpen={showModal} onOpenChange={(open) => setShowModal(open)}>
        <ModalContent>
          <ModalHeader>
            <h3 className={cn("block text-lg font-semibold")}>Mettre à jour son avatar</h3>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <FileUpload
                onFilesChange={(files) => {
                  setFile(files[0])
                }}
                enablePreview
                maxFiles={1}
                accept={{
                  "image/png": [".png"],
                  "image/jpeg": [".jpg", ".jpeg"],
                }}
                acceptCamera
                disabled={uploading}
              />
              <Button color="primary" type="submit" isDisabled={uploading || !file} isLoading={uploading}>
                Mettre à jour
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
