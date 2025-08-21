// server/trpc/context.ts
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const { req } = opts;
  const headers = req.headers;

  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
  try {
    session = await auth.api.getSession({ headers: headers as Headers });
  } catch {
    /* silence – industrial fallback si getSession échoue */
  }

  return {
    req,
    session,
    user: session?.user ?? null,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
export const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx });
});

const hasRole = (role: "admin" | "teacher" | "student") =>
  t.middleware(({ ctx, next }) => {
    if (ctx.user?.role !== role) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
  return next({ ctx });
});

export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuthed);
export const adminProcedure = authProcedure.use(hasRole("admin"));
export const teacherProcedure = authProcedure.use(hasRole("teacher"));
export const studentProcedure = authProcedure.use(hasRole("student"));