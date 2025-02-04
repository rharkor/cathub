import { publicProcedure, router } from "@/lib/trpc"
import { postResponseSchema, postSchema } from "./schemas"


export const postRouter = router({
  createPost: publicProcedure.input(postSchema()).output(postResponseSchema()).mutation(createPost),

})
