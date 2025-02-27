import { publicProcedure, router } from "../../lib/trpc"

import { getCreator, getCreators } from "./queries"
import { getCreatorResponseSchema, getCreatorSchema, getCreatorsResponseSchema, getCreatorsSchema } from "./schemas"

export const creatorRouter = router({
  getCreator: publicProcedure.input(getCreatorSchema()).output(getCreatorResponseSchema()).query(getCreator),
  getCreators: publicProcedure.input(getCreatorsSchema()).output(getCreatorsResponseSchema()).query(getCreators),
})
