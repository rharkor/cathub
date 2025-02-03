import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Session = {
  // TODO
};

export type apiInputFromSchema<T extends (() => z.Schema) | undefined> = {
  input: T extends () => z.Schema ? z.infer<ReturnType<T>> : unknown;
  ctx: {
    session: Session | null | undefined;
    headers?: { [k: string]: string } | null | undefined;
    req?: Request | null | undefined;
    fromServer?: boolean;
  };
};
