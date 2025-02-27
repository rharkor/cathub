"use client"

import { meSchemas } from "@cathub/api-routes/schemas"
import { Button, Input } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import FormField from "@/components/ui/form"
import { trpc } from "@/lib/trpc/client"

export default function BasicInfos() {
  const utils = trpc.useUtils()
  const getAccountQuery = trpc.me.get.useQuery()
  const updateUserMutation = trpc.me.update.useMutation({
    onSuccess: async () => {
      await utils.me.invalidate()
      toast.success("Profile updated successfully!")
    },
  })

  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<z.infer<ReturnType<typeof meSchemas.updateSchema>>>({
    resolver: zodResolver(meSchemas.updateSchema()),
    values: {
      username: getAccountQuery.data?.username || "",
    },
  })

  const handleSaveChanges = async (formData: z.infer<ReturnType<typeof meSchemas.updateSchema>>) => {
    await updateUserMutation.mutateAsync(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    form.reset({
      username: getAccountQuery.data?.username || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="w-full max-w-md" data-testid="profile-basicinfos">
      <div className="mb-6 rounded-lg bg-content1 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Account Information</h2>
        <form onSubmit={form.handleSubmit(handleSaveChanges)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Input
              label="Email"
              isDisabled
              value={getAccountQuery.data?.email}
              data-testid="profile-basicinfos-email"
            />
            <FormField
              form={form}
              name="username"
              type="text"
              label="Nom d'utilisateur"
              className="w-full"
              isDisabled={!isEditing || updateUserMutation.isPending || getAccountQuery.isLoading}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button
                  key="cancel"
                  variant="flat"
                  isDisabled={updateUserMutation.isPending}
                  onPress={handleCancel}
                  type="button"
                >
                  Cancel
                </Button>
                <Button key="save" color="primary" isLoading={updateUserMutation.isPending} type="submit">
                  Save Changes
                </Button>
              </>
            ) : (
              <Button key="edit" color="primary" onPress={() => setIsEditing(true)} type="button">
                Mettre à jour
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-content1 p-6 shadow-sm" data-testid="profile-creator-profile">
        <h2 className="mb-4 text-xl font-semibold">Creator Profile</h2>
        <p className="mb-4 text-sm text-default-500">
          Access your creator profile to manage your content and settings.
        </p>
        <Link href={"/cathub-profile"} className="block w-full">
          <Button color="primary" className="w-full">
            Profil créateur
          </Button>
        </Link>
      </div>
    </div>
  )
}
