"use client"

import { postSchemas } from "@cathub/api-routes/schemas"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Input } from "@heroui/react"
import { Category } from "@prisma/client"
import { Heart, MessageCircle, Search, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { z } from "zod"

import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"
import { cn, getCategoryLabel, getImageUrl } from "@/lib/utils"

interface PostsListProps {
  posts: z.infer<ReturnType<typeof postSchemas.getRecommendedPostsResponseSchema>>
}

export default function PostsList({ posts }: PostsListProps) {
  const { session } = useSession()
  const utils = trpc.useUtils()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined)

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])
  const [page, setPage] = useState(0)
  const limit = 20

  // Get all posts from API
  const postsQuery = trpc.post.getRecommendedPosts.useQuery(
    { limit, page, search: debouncedSearch, selectedCategory },
    {
      placeholderData: posts,
    }
  )

  // Get current user data to check liked posts
  const currentUser = trpc.me.get.useQuery(undefined, {
    enabled: !!session,
  })

  // Like post mutation
  const likeMutation = trpc.like.likePost.useMutation({
    onSuccess: async () => {
      await utils.me.get.invalidate()
      await utils.post.invalidate()
    },
  })

  // Handle category filter
  const handleCategoryFilter = (category: Category) => {
    setSelectedCategory(selectedCategory === category ? undefined : category)
  }

  // Calculate pagination values
  const totalPosts = postsQuery.data?.total || 0
  const totalPages = Math.ceil(totalPosts / limit)
  const hasNextPage = postsQuery.data?.hasMore || false
  const hasPrevPage = page > 0

  // Handle pagination
  const handleNextPage = () => {
    if (hasNextPage) setPage(page + 1)
  }

  const handlePrevPage = () => {
    if (hasPrevPage) setPage(page - 1)
  }

  // Get all available categories
  const allCategories = Object.values(Category)

  // Handle like post
  const handleLikePost = async (postId: string) => {
    if (!session) {
      // Redirect to login or show login modal
      return
    }

    const isLiked = currentUser.data?.user.postLikes?.some((like) => like.postId === postId)

    await likeMutation.mutateAsync({
      postId,
      state: isLiked ? "unlike" : "like",
      userId: session.userId,
    })
  }

  // Check if post is liked by current user
  const isPostLiked = (postId: string) => {
    return currentUser.data?.user.postLikes?.some((like) => like.postId === postId) || false
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Explorez les posts</h1>
        <p className="text-default-500">
          Découvrez les derniers posts de nos créateurs et interagissez avec la communauté.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <Input
          placeholder="Rechercher un post..."
          value={search}
          onValueChange={setSearch}
          startContent={<Search size={18} />}
          className="mb-4 max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <Chip
              key={category}
              variant={selectedCategory === category ? "solid" : "flat"}
              color={selectedCategory === category ? "primary" : "default"}
              className={cn(selectedCategory === category ? "cursor-pointer bg-primary text-black" : "cursor-pointer")}
              onClick={() => handleCategoryFilter(category)}
            >
              {getCategoryLabel(category)}
            </Chip>
          ))}
        </div>
      </div>

      {/* Posts grid */}
      {(postsQuery.data?.posts.length ?? 0) > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {postsQuery.data?.posts.map((post) => (
              <Card key={post.id} className="overflow-hidden transition-all hover:shadow-lg">
                {post.image && (
                  <CardHeader className="p-0">
                    <div className="relative aspect-video w-full overflow-hidden bg-content2">
                      <Image
                        src={getImageUrl(post.image) || ""}
                        alt={post.text}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CardHeader>
                )}
                <CardBody className="p-4">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {post.category.map((cat) => (
                      <Chip key={cat} variant="flat" size="sm" className="bg-primary text-black">
                        {getCategoryLabel(cat)}
                      </Chip>
                    ))}
                  </div>
                  <p className="my-4 line-clamp-3 text-sm">{post.text}</p>
                  {post.user && (
                    <div className="flex items-center gap-2">
                      <div className="relative mt-4 h-8 w-8 overflow-hidden rounded-full bg-content3">
                        {post.user.profilePicture ? (
                          <Image
                            src={getImageUrl(post.user.profilePicture) || ""}
                            alt={post.user.username || ""}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-lg font-extrabold">{post.user.username?.slice(0, 2) || "?"}</span>
                          </div>
                        )}
                      </div>
                      <span className="mt-4 text-base font-extrabold">{post.user.username}</span>
                    </div>
                  )}
                </CardBody>
                <CardFooter className="flex justify-between border-t border-divider p-4">
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      color="primary"
                      onPress={() => handleLikePost(post.id)}
                      className={isPostLiked(post.id) ? "text-primary" : ""}
                    >
                      <Heart size={16} fill={isPostLiked(post.id) ? "currentColor" : "none"} />
                    </Button>
                    <Button isIconOnly variant="light" size="sm">
                      <MessageCircle size={16} />
                    </Button>
                    <Button isIconOnly variant="light" size="sm">
                      <Share2 size={16} />
                    </Button>
                  </div>
                  <Button
                    as={Link}
                    href={`/post/${post.id}`}
                    className="bg-primary text-black"
                    variant="flat"
                    size="sm"
                  >
                    Voir détails
                  </Button>
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
          <p className="text-lg font-medium">Aucun post trouvé</p>
          <p className="mt-2 text-default-500">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  )
}
