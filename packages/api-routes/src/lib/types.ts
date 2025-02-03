import { z } from "zod"

type Session = {
  user: {
    id: string
  }
}

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
