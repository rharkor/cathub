import { cookies } from "next/headers"

import { serverTrpc } from "@/lib/trpc/server"

import PostsList from "./posts-list"

export default async function PostsPage() {
  const cookiesStore = await cookies()
  const posts = await serverTrpc(cookiesStore).post.getRecommendedPosts({ limit: 20, page: 0 })

  return <PostsList posts={posts} />
}
