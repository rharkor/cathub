"use client"

import { meSchemas } from "@cathub/api-routes/schemas"
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sex } from "@prisma/client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import FormField from "@/components/ui/form"
import { trpc } from "@/lib/trpc/client"

export default function BasicInfos() {
  const utils = trpc.useUtils()
  const [isOpen, setIsOpen] = useState(false)
  const getAccountQuery = trpc.me.get.useQuery()
  const updateUserMutation = trpc.me.update.useMutation({
    onSuccess: async () => {
      await utils.me.invalidate()
      toast.success("Profile updated successfully!")
      if (isDisimissable) {
        setIsOpen(false)
      }
    },
  })

  // Using React Hook Form
  const form = useForm<z.infer<ReturnType<typeof meSchemas.updateSchema>>>({
    resolver: zodResolver(meSchemas.updateSchema()),
    values: {
      username: getAccountQuery.data?.username || "",
      sex: getAccountQuery.data?.sex || undefined,
      age: getAccountQuery.data?.age || undefined,
      price: getAccountQuery.data?.price || undefined,
      description: getAccountQuery.data?.description || "",
      isCathub: getAccountQuery.data?.isCathub || false,
    },
  })

  //* Auto display the modal if the user doesnt have a gender
  // If the sex is defined then it means the user has already completed the profile
  useEffect(() => {
    if (!getAccountQuery.isLoading && !getAccountQuery.data?.sex) {
      setIsOpen(true)
    }
  }, [getAccountQuery.isLoading, getAccountQuery.data?.sex])

  const isDisimissable = getAccountQuery.data?.sex !== null

  const handleSubmit = async (formData: z.infer<ReturnType<typeof meSchemas.updateSchema>>) => {
    await updateUserMutation.mutateAsync(formData)
  }

  return (
    <>
      <Button onPress={() => setIsOpen(true)} color="primary">
        Update profile
      </Button>
      <Modal
        isOpen={isOpen}
        size="2xl"
        onOpenChange={setIsOpen}
        isDismissable={isDisimissable}
        hideCloseButton={!isDisimissable}
      >
        <ModalContent>
          <ModalHeader>Profile</ModalHeader>
          <ModalBody>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
              <div className="grid w-full grid-cols-2 gap-2">
                <Input label="Email" isDisabled value={getAccountQuery.data?.email} />
                <FormField
                  form={form}
                  name="username"
                  type="text"
                  label="Nom d'utilisateur"
                  isDisabled={getAccountQuery.isLoading || updateUserMutation.isPending}
                />
                <Controller
                  name="sex"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      label="Sexe"
                      selectedKeys={field.value ? [field.value] : []}
                      onChange={(e) => field.onChange(e.target.value as Sex)}
                      isDisabled={updateUserMutation.isPending}
                    >
                      {Object.values(Sex).map((sexValue) => (
                        <SelectItem key={sexValue} value={sexValue}>
                          {sexValue === "FEMALE" ? "Female" : sexValue === "MALE" ? "Male" : "Other"}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
                <FormField form={form} name="age" type="number" label="Age" isDisabled={updateUserMutation.isPending} />
                <FormField
                  form={form}
                  name="price"
                  type="number"
                  label="Prix"
                  startContent="$"
                  isDisabled={updateUserMutation.isPending}
                />

                <Input label="Localisation" isDisabled={updateUserMutation.isPending} />
              </div>

              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    label="Description"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    isDisabled={updateUserMutation.isPending}
                  />
                )}
              />

              <Controller
                name="isCathub"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    isSelected={field.value}
                    onValueChange={(isSelected) => field.onChange(isSelected)}
                    isDisabled={updateUserMutation.isPending}
                  >
                    Enable profile discovery
                  </Checkbox>
                )}
              />

              <div className="mt-4 flex justify-end gap-2">
                {isDisimissable ? (
                  <Button
                    variant="flat"
                    onPress={() => setIsOpen(false)}
                    isDisabled={updateUserMutation.isPending}
                    type="button"
                  >
                    Annuler
                  </Button>
                ) : (
                  <Link href="/profile">
                    <Button variant="flat" isLoading={updateUserMutation.isPending}>
                      Retour
                    </Button>
                  </Link>
                )}
                <Button color="primary" type="submit" isLoading={updateUserMutation.isPending}>
                  Enregistrer
                </Button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
