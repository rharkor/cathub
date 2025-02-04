import { protectedProcedure, publicProcedure, router } from "../../lib/trpc"

import { update } from "./mutations"
import { getMe } from "./queries"
import { updateResponseSchema, updateSchema } from "./schemas"

export const meRouter = router({
  get: protectedProcedure.query(getMe),
  update: publicProcedure.input(updateSchema()).output(updateResponseSchema()).mutation(update),
})
