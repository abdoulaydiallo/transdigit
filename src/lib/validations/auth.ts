// lib/validations/auth.ts
import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export const SignUpSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
  confirmPassword: z.string().min(6, "Confirmation requise"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type SignInFormValues = z.infer<typeof SignInSchema>;
export type SignUpFormValues = z.infer<typeof SignUpSchema>;