import { z } from "zod"

export type Session = {
  userId: string
  email: string
  iat: number
  exp: number
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

export enum Status {
    SUCCESS = "success",
    ERROR = "error"
}
