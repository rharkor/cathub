import { protectedProcedure, router } from "../../lib/trpc"

import { getCreator, getCreators } from "./queries"
import { getCreatorResponseSchema, getCreatorSchema, getCreatorsResponseSchema, getCreatorsSchema } from "./schemas"

export const creatorRouter = router({
  getCreator: protectedProcedure.input(getCreatorSchema()).output(getCreatorResponseSchema()).query(getCreator),
  getCreators: protectedProcedure.input(getCreatorsSchema()).output(getCreatorsResponseSchema()).query(getCreators),
})
