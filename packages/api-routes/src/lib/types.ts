import { z } from "zod";

type Session = {
  user: {
    id: string;
  };
};

export type apiInputFromSchema<
  T extends (() => z.Schema) | undefined,
  LoggedIn extends boolean = false
> = {
  input: T extends () => z.Schema ? z.infer<ReturnType<T>> : unknown;
  ctx: {
    session: LoggedIn extends true ? Session : null | undefined;
    headers?: { [k: string]: string } | null | undefined;
    req?: Request | null | undefined;
    fromServer?: boolean;
  };
};
