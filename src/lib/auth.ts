import { sendEmail } from "@/lib/mailer";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/lib/db";
import {
  user,
  session,
  account,
  verification,
} from "@/lib/db/schema";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  basePath: "/api/auth",
  trustedOrigins: [process.env.BETTER_AUTH_URL!],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, account, session, verification },
  }),

  emailAndPassword: { 
    enabled: true,
    requireEmailVerification: true, 
  },
  
  emailVerification: {
    sendOnSignUp: true,               // envoie automatique du lien à l’inscription
    autoSignInAfterVerification: true, // redirige automatiquement après clic sur le lien
    expiresIn: 3600, // 1 heure
    async sendVerificationEmail({ user, url, token }) {
      const html = `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif">
          <p>Bonjour ${user.name || user.email.split('@')[0]},</p>
          <p>Cliquez sur le bouton ci-dessous pour vérifier votre adresse email :</p>
          <a href="${url}?token=${token}" style="padding:12px 20px;background:#3B82F6;color:#fff;border-radius:6px;text-decoration:none;">Vérifier mon email</a>
          <p>Ce lien expirera dans 1 heure.</p>
        </div>`;
      await sendEmail(
        user.email,
        "🔐 Vérifiez votre adresse email",
        `Allez sur ce lien pour vérifier votre email : ${url}`,
        html
      );
    },
    async afterEmailVerification(user) {
      console.log(`Utilisateur "${user.email}" a confirmé son email !`);
    }
  },
  plugins: [
      emailOTP({
        overrideDefaultEmailVerification: true,
        otpLength: 6,
        expiresIn: 300, // 5 min
        allowedAttempts: 3,
        async sendVerificationOTP({ email, otp, type }) {
          const subjects = {
            "sign-in": "Votre code de connexion",
            "email-verification": "Vérifiez votre adresse email",
            "forget-password": "Réinitialisation de mot de passe",
          };
          const subject = subjects[type] ?? "Code OTP";
          const html = `
            <p>Voici votre <strong>code ${type}</strong>: <code>${otp}</code></p>
            <p>Il expirera dans 5 minutes.</p>
          `;
          await sendEmail(email, subject, `Votre Code de Verification: ${otp}`, html);
        },
      }),
    ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    modelName: "user",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: false,
      },
    },
    fields: {
      name: "name",
      email: "email",
      emailVerified: "email_verified",  // clé camelCase
      image: "image",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  session: {
    modelName: "session",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      token: "token",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

});
