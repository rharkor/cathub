"use client"

import { maxUploadSize } from "@cathub/api-routes/constants"
import { bytesToMegabytes } from "@cathub/api-routes/utils"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Select, SelectItem, Textarea } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category } from "@prisma/client"
import { logger } from "@rharkor/logger"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import FileUpload from "@/components/ui/file-upload"
import { trpc } from "@/lib/trpc/client"
import { getCategoryLabel } from "@/lib/utils"

// Define our create post schema based on the API schema
const createPostSchema = z.object({
  image: z.string(),
  text: z.string().min(1, "La description est requise"),
  category: z.array(z.nativeEnum(Category)).min(1, "Sélectionnez au moins une catégorie"),
})

export default function CreatePostForm() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      text: "",
      image: "",
      category: [],
    },
  })

  const getPresignedUrlMutation = trpc.upload.presignedUrl.useMutation()
  const createPostMutation = trpc.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post créé avec succès!")
      utils.post.getPosts.invalidate()
      router.push("/cathub-profile")
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue lors de la création du post")
      setIsSubmitting(false)
    },
  })

  const handleSubmit = async (data: z.infer<typeof createPostSchema>) => {
    setIsSubmitting(true)

    try {
      // Upload image if there's a file
      if (file) {
        if (file.size > maxUploadSize) {
          toast.error(`Fichier trop volumineux (max: ${bytesToMegabytes(maxUploadSize)}Mo)`)
          setIsSubmitting(false)
          return
        }

        try {
          // Get presigned URL for S3 upload
          const { url, fields } = await getPresignedUrlMutation.mutateAsync({
            filename: file.name,
            filetype: file.type,
          })

          // Create form data and upload to S3
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
            // Set the image key for the post
            data.image = fields.key
          } else {
            const xml = await uploadResponse.text()
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xml, "text/xml")
            const error = xmlDoc.getElementsByTagName("Message")[0]
            if (error.textContent === "Your proposed upload exceeds the maximum allowed size") {
              toast.error(`Fichier trop volumineux (max: ${bytesToMegabytes(maxUploadSize)}Mo)`)
            } else {
              toast.error("Erreur inconnue lors de l'upload de l'image")
            }
            setIsSubmitting(false)
            return
          }
        } catch (e) {
          logger.error(e)
          toast.error("Erreur lors de l'upload de l'image")
          setIsSubmitting(false)
          return
        }
      }

      await createPostMutation.mutateAsync(data)
    } catch (error) {
      console.error("Error creating post:", error)
      setIsSubmitting(false)
    }
  }

  const handleFileChange = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      setFile(file)
    }
  }

  const handlePublish = () => {
    form.handleSubmit(handleSubmit)()
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Créer un nouveau post</h1>
          <p className="text-default-500">Partagez vos moments félin avec la communauté CatHub</p>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-6">
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium">Image du post</p>
              <FileUpload
                onFilesChange={handleFileChange}
                accept={{ "image/*": [".jpeg", ".jpg", ".png", ".gif"] }}
                maxFiles={1}
                enablePreview
              />
              <p className="mt-1 text-xs text-default-400">
                Téléchargez une image pour votre post (formats .jpg, .png)
              </p>
            </div>

            <div className="w-full">
              <Textarea
                label="Description"
                placeholder="Que voulez-vous partager aujourd'hui?"
                className="min-h-[100px]"
                value={form.watch("text")}
                onChange={(e) => form.setValue("text", e.target.value)}
                isInvalid={!!form.formState.errors.text}
                errorMessage={form.formState.errors.text?.message}
              />
            </div>

            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Select
                  label="Catégories"
                  placeholder="Sélectionnez des catégories"
                  selectionMode="multiple"
                  className="w-full"
                  onChange={(e) => field.onChange(e.target.value.split(",").filter(Boolean))}
                  selectedKeys={field.value}
                  value={field.value}
                >
                  {Object.values(Category).map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <div className="mt-2 flex flex-wrap gap-2">
              {form.watch("category").map((cat: Category) => (
                <Chip key={cat} variant="flat">
                  {getCategoryLabel(cat)}
                </Chip>
              ))}
            </div>
          </form>
        </CardBody>
        <CardFooter className="flex justify-end gap-2">
          <Button
            color="danger"
            variant="flat"
            onPress={() => router.push("/cathub-profile")}
            isDisabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button color="primary" onPress={handlePublish} isLoading={isSubmitting} isDisabled={isSubmitting}>
            Publier
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
