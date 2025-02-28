"use client"

import { maxUploadSize } from "@cathub/api-routes/constants"
import { bytesToMegabytes } from "@cathub/api-routes/utils"
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Skeleton, Spinner } from "@heroui/react"
import { logger } from "@rharkor/logger"
import { Camera, Trash } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-toastify"

import FileUpload from "@/components/ui/file-upload"
import { trpc } from "@/lib/trpc/client"
import { cn, getImageUrl } from "@/lib/utils"

export default function UpdateAvatar() {
  const utils = trpc.useUtils()
  const { data: account, isLoading: isAccountLoading } = trpc.me.get.useQuery()
  const getPresignedUrlMutation = trpc.upload.presignedUrl.useMutation()
  const updateUserMutation = trpc.me.update.useMutation({
    onSuccess: async () => {
      await utils.me.invalidate()
    },
  })

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

  const profilePicutreUrl = getImageUrl(account?.user.profilePicture)

  return (
    <>
      <div className={cn("group relative size-20 rounded-full lg:size-32")} data-testid="profile-avatar">
        <Skeleton isLoaded={!isAccountLoading} className={cn("rounded-full")}>
          <div
            className="relative !size-20 overflow-hidden rounded-full bg-content3 text-large lg:!size-32"
            onClick={() => setShowModal(true)}
          >
            {profilePicutreUrl ? (
              <Image
                className="size-full object-cover"
                src={profilePicutreUrl || ""}
                alt={account?.user.username || ""}
                width={256}
                height={256}
              />
            ) : (
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm font-medium lg:text-xl">
                {account?.user.username?.slice(0, 3)}
              </p>
            )}
          </div>
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
            "absolute right-0 top-0 h-[unset] min-w-0 rounded-full p-1.5 opacity-0 transition-all duration-200 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100",
            {
              hidden: isAccountLoading || !account?.user.profilePicture,
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
