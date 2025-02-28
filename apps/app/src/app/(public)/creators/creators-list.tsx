"use client"

import { creatorSchemas } from "@cathub/api-routes/schemas"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Input } from "@heroui/react"
import { Heart, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { z } from "zod"

import KibbleIcon from "@/components/icons/kibble"
import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"
import { getImageUrl } from "@/lib/utils"

interface CreatorsListProps {
  creators: z.infer<ReturnType<typeof creatorSchemas.getCreatorsResponseSchema>>
}

export default function CreatorsList({ creators }: CreatorsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const { session } = useSession()

  // Fetch creators from API
  const [page, setPage] = useState(0)
  const limit = 20
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const creatorsQuery = trpc.creator.getCreators.useQuery(
    {
      page,
      search: debouncedSearch,
      limit,
    },
    {
      placeholderData: creators,
    }
  )

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setSearch(e.target.value)
    setPage(0) // Reset to first page when searching
  }

  // Calculate pagination values
  const totalCreators = creatorsQuery.data?.total || 0
  const totalPages = Math.ceil(totalCreators / limit)
  const hasNextPage = creatorsQuery.data?.hasMore || false
  const hasPrevPage = page > 0

  // Handle pagination
  const handleNextPage = () => {
    if (hasNextPage) setPage(page + 1)
  }

  const handlePrevPage = () => {
    if (hasPrevPage) setPage(page - 1)
  }

  // Get current page creators
  const currentPageCreators = creatorsQuery.data?.creators || []

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
          onChange={handleSearch}
          startContent={<Search size={18} />}
          className="max-w-md"
        />
      </div>

      {/* Creators grid */}
      {currentPageCreators.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentPageCreators.map((creator) => (
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
                    <Chip
                      color="primary"
                      variant="flat"
                      size="sm"
                      classNames={{
                        content: "flex items-center gap-1",
                      }}
                    >
                      <Heart size={14} />
                      <span>{creator._count?.likes || 0} Abonnés</span>
                    </Chip>
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
                  {session && session.userId !== creator.id && (
                    <Button isIconOnly variant="light" size="sm" className="text-danger">
                      <Heart size={18} />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button variant="flat" isDisabled={!hasPrevPage} onClick={handlePrevPage}>
                Précédent
              </Button>
              <div className="text-default-500">
                Page {page + 1} sur {totalPages}
              </div>
              <Button variant="flat" isDisabled={!hasNextPage} onClick={handleNextPage}>
                Suivant
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg bg-content2 p-8 text-center">
          <p className="text-lg font-medium">Aucun créateur trouvé</p>
          <p className="mt-2 text-default-500">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  )
}
