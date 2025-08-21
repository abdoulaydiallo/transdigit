// src/server/trpc/authOtp.router.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

export const t = initTRPC.context<{ headers: HeadersInit }>().create();

export const authOtpRouter = t.router({
  sendVerificationOtp: t.procedure
    .input(
      z.object({
        email: z.email(),
        type: z.enum([
          "email_verification",
          "sign_in",
          "forget_password",
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      //@ts-ignore
      await auth.api.emailOtp.sendVerificationOtp({
        body: { email: input.email, type: input.type },
        headers: ctx.headers,
      });
      return { sent: true };
    }),

  verifyEmailOtp: t.procedure
    .input(
      z.object({
        email: z.email(),
        otp: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      //@ts-ignore
      const result = await auth.api.emailOtp.verifyEmail({
        body: { email: input.email, otp: input.otp },
        headers: ctx.headers,
      });
      if (!result.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error?.message || "OTP invalide",
        });
      }
      return { verified: true };
    }),

  signInWithOtp: t.procedure
    .input(
      z.object({
        email: z.email(),
        otp: z.string().min(1),
        disableSignUp: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      //@ts-ignore
      const result = await auth.api.signIn.emailOtp({
        body: { email: input.email, otp: input.otp },
        headers: ctx.headers,
        options: {
          disableSignUp: input.disableSignUp ?? false,
        },
      });
      if (!("user" in result)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            result.error?.message ||
            "Connexion échouée - OTP invalide ou expiré",
        });
      }
      return {
        user: result.user,
        session: result.session,
      };
    }),

  getSession: t.procedure
    .query(async ({ ctx }) => {
      const session = await auth.api.getSession({
        headers: ctx.headers as never,
      });
      return session; // type : { user, session } | null
    }),

  signOut: t.procedure
    .mutation(async ({ ctx }) => {
      await auth.api.signOut({
        headers: ctx.headers,
      });
      return { success: true };
    }),
});

export type AuthOtpRouter = typeof authOtpRouter;
