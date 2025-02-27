import { cookies } from "next/headers"

import { serverTrpc } from "@/lib/trpc/server"

import PostDetails from "./post-details"

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const cookiesStore = await cookies()

  const { id } = await params
  const postData = await serverTrpc(cookiesStore).post.getPostById({ id })

  return (
    <section className="flex flex-1 flex-col items-center">
      <PostDetails post={postData} />
    </section>
  )
}
