// server/trpc/router.ts
import { initTRPC } from "@trpc/server";
import { lessonsRouter } from "./lessons.router";
import { questionsRouter } from "./questions.router";
import { exerciseRouter } from "./exercise.router";
import { Context } from "./context";
import { authRouter } from "./auth.router";
import { authOtpRouter } from "./authOtp.router";

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  lessons: lessonsRouter,
  questions: questionsRouter,
  exercises: exerciseRouter,
  auth: authRouter,
  authOtp: authOtpRouter,
});

export type AppRouter = typeof appRouter;