import { protectedProcedure, router } from "../../lib/trpc"

import { deleteMe, update } from "./mutations"
import { getMe } from "./queries"
import { deleteMeResponseSchema, deleteMeSchema, updateResponseSchema, updateSchema } from "./schemas"

export const meRouter = router({
  get: protectedProcedure.query(getMe),
  update: protectedProcedure.input(updateSchema()).output(updateResponseSchema()).mutation(update),
  delete: protectedProcedure.input(deleteMeSchema()).output(deleteMeResponseSchema()).mutation(deleteMe),
})
