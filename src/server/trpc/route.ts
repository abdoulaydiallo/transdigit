// server/trpc/router.ts
import { initTRPC } from "@trpc/server";
import { lessonsRouter } from "./lessons.router";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  lessons: lessonsRouter,
});

export type AppRouter = typeof appRouter;