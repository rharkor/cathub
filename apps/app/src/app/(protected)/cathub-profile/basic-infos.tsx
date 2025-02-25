"use client"

import { meSchemas } from "@cathub/api-routes/schemas"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Skeleton,
  Textarea,
} from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category, Sex } from "@prisma/client"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import FormField from "@/components/ui/form"
import { trpc } from "@/lib/trpc/client"

import UpdateAvatar from "./update-avatar"

export default function BasicInfos() {
  const utils = trpc.useUtils()
  const [isOpen, setIsOpen] = useState(false)
  const getAccountQuery = trpc.me.get.useQuery()
  const getPostsQuery = trpc.post.getPosts.useQuery(undefined, {
    enabled: !getAccountQuery.isLoading && !!getAccountQuery.data?.id,
  })

  const form = useForm<z.infer<ReturnType<typeof meSchemas.updateSchema>>>({
    resolver: zodResolver(meSchemas.updateSchema()),
    values: {
      username: getAccountQuery.data?.username,
      sex: getAccountQuery.data?.sex,
      age: getAccountQuery.data?.age,
      price: getAccountQuery.data?.price,
      description: getAccountQuery.data?.description,
      isCathub: getAccountQuery.data?.isCathub,
    },
  })

  const updateUserMutation = trpc.me.update.useMutation({
    onSuccess: async (_r, variables) => {
      await utils.me.invalidate()
      toast.success("Profile updated successfully!")
      const newIsDisimissable = variables.sex !== null
      if (newIsDisimissable) {
        setIsOpen(false)
      }
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
      <div className="container mx-auto p-4">
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-4">
            <div className="relative size-64 overflow-hidden rounded-xl">
              <UpdateAvatar />
            </div>

            <Button color="primary" size="lg" className="w-full font-semibold" onPress={() => setIsOpen(true)}>
              Edit Profile
            </Button>
          </div>

          <div className="col-span-2 flex flex-col gap-4">
            <Skeleton isLoaded={!getAccountQuery.isLoading} className="h-12 w-full">
              <h1 className="text-3xl font-bold">{getAccountQuery.data?.username || "Loading..."}</h1>
            </Skeleton>

            <div className="flex flex-wrap gap-4">
              <Skeleton isLoaded={!getAccountQuery.isLoading} className="h-8 w-24">
                <div className="rounded-full bg-primary/10 px-4 py-1 text-primary">
                  {getAccountQuery.data?.sex === "FEMALE"
                    ? "Female"
                    : getAccountQuery.data?.sex === "MALE"
                      ? "Male"
                      : "Other"}
                </div>
              </Skeleton>

              <Skeleton isLoaded={!getAccountQuery.isLoading} className="h-8 w-20">
                <div className="rounded-full bg-secondary/10 px-4 py-1 text-secondary">
                  {getAccountQuery.data?.age || "?"} yo
                </div>
              </Skeleton>

              {getAccountQuery.data?.price && (
                <Skeleton isLoaded={!getAccountQuery.isLoading} className="h-8 w-24">
                  <div className="rounded-full bg-success/10 px-4 py-1 text-success">
                    ${getAccountQuery.data?.price}/month
                  </div>
                </Skeleton>
              )}

              {getAccountQuery.data?.isCathub && (
                <Skeleton isLoaded={!getAccountQuery.isLoading} className="h-8 w-32">
                  <div className="rounded-full bg-warning/10 px-4 py-1 text-warning">CatHub Creator</div>
                </Skeleton>
              )}
            </div>

            <Divider className="my-2" />

            <Skeleton isLoaded={!getAccountQuery.isLoading} className="h-24 w-full">
              <div className="rounded-lg bg-content2 p-4">
                <h3 className="mb-2 text-lg font-semibold">About Me</h3>
                <p className="text-content3-foreground">
                  {getAccountQuery.data?.description || "No description provided."}
                </p>
              </div>
            </Skeleton>

            <div className="mt-4 flex flex-wrap gap-4">
              <Button color="primary" variant="flat" startContent={<Heart size={18} />}>
                Follow
              </Button>
              <Button color="secondary" variant="flat" startContent={<MessageCircle size={18} />}>
                Message
              </Button>
              <Button color="default" variant="flat" startContent={<Share2 size={18} />}>
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Recent Posts</h2>

          {getPostsQuery.isPending ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          ) : getPostsQuery.data?.posts && getPostsQuery.data.posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getPostsQuery.data.posts
                .filter((post) => post.userId === getAccountQuery.data?.id)
                .map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    {post.image && (
                      <CardHeader className="p-0">
                        <Image
                          src={post.image}
                          alt={post.text}
                          width={400}
                          height={300}
                          className="aspect-video w-full object-cover"
                        />
                      </CardHeader>
                    )}
                    <CardBody className="p-4">
                      <p className="line-clamp-3">{post.text}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.category.map((cat: Category) => (
                          <span key={cat} className="rounded-full bg-content3 px-2 py-1 text-xs">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </CardBody>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Button isIconOnly variant="light" size="sm">
                          <Heart size={16} />
                        </Button>
                        <Button isIconOnly variant="light" size="sm">
                          <MessageCircle size={16} />
                        </Button>
                      </div>
                      <span className="text-sm text-default-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="rounded-lg bg-content2 p-8 text-center">
              <p className="mb-4 text-lg font-medium">No posts yet</p>
              <p className="text-content3-foreground">Posts you create will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
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
                  render={({ field }) => {
                    return (
                      <Select
                        label="Sexe"
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(e) => {
                          const currentKey = e.currentKey?.toString()
                          field.onChange((currentKey as Sex) || null)
                        }}
                        isDisabled={updateUserMutation.isPending}
                      >
                        {Object.values(Sex).map((sexValue) => (
                          <SelectItem key={sexValue} value={sexValue}>
                            {sexValue === "FEMALE" ? "Female" : sexValue === "MALE" ? "Male" : "Other"}
                          </SelectItem>
                        ))}
                      </Select>
                    )
                  }}
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
