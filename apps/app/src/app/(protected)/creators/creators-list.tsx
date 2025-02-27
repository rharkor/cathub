"use client"

import { creatorSchemas } from "@cathub/api-routes/schemas"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Input } from "@heroui/react"
import { User } from "@prisma/client"
import { Heart, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { z } from "zod"

import KibbleIcon from "@/components/icons/kibble"
import { trpc } from "@/lib/trpc/client"
import { getImageUrl } from "@/lib/utils"

interface CreatorsListProps {
  creators: z.infer<ReturnType<typeof creatorSchemas.getCreatorsResponseSchema>>
  currentUser: User | null
}

export default function CreatorsList({ creators, currentUser }: CreatorsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch creators from API
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(20)
  const creatorsQuery = trpc.creator.getCreators.useQuery(
    {
      page,
      limit,
    },
    {
      placeholderData: creators,
    }
  )

  // Filter creators based on search query
  const filteredCreators = (creatorsQuery.data || []).filter((creator) => {
    if (!searchQuery) return true
    return (
      creator.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Découvrez nos créateurs</h1>
        <p className="text-default-500">
          Explorez les profils de nos créateurs et trouvez ceux qui correspondent à vos intérêts.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <Input
          placeholder="Rechercher un créateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search size={18} />}
          className="max-w-md"
        />
      </div>

      {/* Creators grid */}
      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCreators.map((creator) => (
            <Card key={creator.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="p-0">
                <div className="relative aspect-square w-full overflow-hidden bg-content2">
                  {creator.profilePicture ? (
                    <Image
                      src={getImageUrl(creator.profilePicture) || ""}
                      alt={creator.username || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-content3">
                      <span className="text-3xl font-bold">{creator.username?.slice(0, 2) || "?"}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardBody className="p-4">
                <h3 className="mb-2 text-xl font-semibold">{creator.username}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-default-500">
                  {creator.description || "Pas de description"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {creator.sex && (
                    <Chip variant="flat" size="sm">
                      {creator.sex === "FEMALE" ? "Femme" : creator.sex === "MALE" ? "Homme" : "Autre"}
                    </Chip>
                  )}
                  {creator.age && (
                    <Chip variant="flat" size="sm">
                      {creator.age} ans
                    </Chip>
                  )}
                  {creator.price && (
                    <Chip
                      color="success"
                      variant="flat"
                      size="sm"
                      classNames={{
                        content: "flex items-center gap-1",
                      }}
                    >
                      <KibbleIcon className="size-3" />
                      <span>{creator.price}</span>
                    </Chip>
                  )}
                </div>
              </CardBody>
              <CardFooter className="flex justify-between gap-2 border-t border-divider p-4">
                <Button
                  as={Link}
                  href={`/creators/${creator.id}`}
                  color="primary"
                  variant="flat"
                  size="sm"
                  className="flex-1"
                >
                  Voir profil
                </Button>
                {currentUser && currentUser.id !== creator.id && (
                  <Button isIconOnly variant="light" size="sm" className="text-danger">
                    <Heart size={18} />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-content2 p-8 text-center">
          <p className="text-lg font-medium">Aucun créateur trouvé</p>
          <p className="mt-2 text-default-500">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  )
}
