// src/server/trpc/auth.router.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@/lib/auth";  // ton instance Better Auth configurée serveur

const t = initTRPC.context<{ headers: HeadersInit }>().create();

// Zod schemas pour email/password
const SignUpInput = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1),
});
const SignInInput = z.object({
  email: z.email(),
  password: z.string(),
});

// Schema pour social login (redirect ou non)
const SocialSignInInput = z.object({
  provider: z.string(),
  callbackURL: z.string().optional(),
  errorCallbackURL: z.string().optional(),
  newUserCallbackURL: z.string().optional(),
  disableRedirect: z.boolean().optional(),
});

// Router
export const authRouter = t.router({
  signUpEmail: t.procedure
    .input(SignUpInput)
    .mutation(async ({ input, ctx }) => {
      const { user, token } = await auth.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
        },
        headers: ctx.headers,
      });

      return { user, token: token ?? null };
    }),

  signInEmail: t.procedure
    .input(SignInInput)
    .mutation(async ({ input, ctx }) => {
      const { user, token } = await auth.api.signInEmail({
        body: { email: input.email, password: input.password },
        headers: ctx.headers,
      });

      return { user, token };
    }),

  socialSignIn: t.procedure
    .input(SocialSignInInput)
    .query(async ({ input, ctx }) => {
      const result = await auth.api.signInSocial({
        body: {
          provider: input.provider,
          callbackURL: input.callbackURL,
          errorCallbackURL: input.errorCallbackURL,
          newUserCallbackURL: input.newUserCallbackURL,
          disableRedirect: input.disableRedirect,
        },
        headers: ctx.headers,
      });

      return result;
    }),

  getSession: t.procedure.query(async ({ ctx }) => {
    const session = await auth.api.getSession({ headers: ctx.headers as never });
    return session; // type : { user: ..., session: ... } | null
  }),

  signOut: t.procedure.mutation(async ({ ctx }) => {
    await auth.api.signOut({ headers: ctx.headers });
    return { success: true };
  }),
});



