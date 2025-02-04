import { publicProcedure, router } from "@/lib/trpc"

import { signIn, signUp } from "./mutations"
import { signInResponseSchema, signInSchema, signUpResponseSchema, signUpSchema } from "./schemas"

export const authRouter = router({
  signIn: publicProcedure.input(signInSchema()).output(signInResponseSchema()).mutation(signIn),
  signUp: publicProcedure.input(signUpSchema()).output(signUpResponseSchema()).mutation(signUp),
})
