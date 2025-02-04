import { z } from "zod"

export const sessionSchema = z.object({
  userId: z.string(),
  email: z.string(),
  iat: z.number(),
  exp: z.number(),
})
export type Session = z.infer<typeof sessionSchema>

export type apiInputFromSchema<T extends (() => z.Schema) | undefined> = {
  input: T extends () => z.Schema ? z.infer<ReturnType<T>> : unknown
  ctx: {
    session: Session | null | undefined
  }
}

export function ensureLoggedIn(session: Session | null | undefined): asserts session is Session {
  if (!session) {
    throw new Error("You must be logged in to access this resource")
  }
}
