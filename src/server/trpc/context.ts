// server/trpc/context.ts
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const { req } = opts;
  return {
    req,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;