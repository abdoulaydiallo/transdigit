// server/trpc/router.ts
import { initTRPC } from "@trpc/server";
import { lessonsRouter } from "./lessons.router";
import { questionsRouter } from "./questions.router";
import { exerciseRouter } from "./exercise.router";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  lessons: lessonsRouter,
  questions: questionsRouter,
  exercises: exerciseRouter,
});

export type AppRouter = typeof appRouter;