import { protectedProcedure, router } from "../../lib/trpc"

import { deleteMe, update } from "./mutations"
import { getMe } from "./queries"
import { deleteMeResponseSchema, updateResponseSchema, updateSchema } from "./schemas"

export const meRouter = router({
  get: protectedProcedure.query(getMe),
  update: protectedProcedure.input(updateSchema()).output(updateResponseSchema()).mutation(update),
  delete: protectedProcedure.output(deleteMeResponseSchema()).mutation(deleteMe),
})
