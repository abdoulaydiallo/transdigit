// /lib/zodSchemas/courseTabs.ts
import { z } from "zod";

// Schéma pour la création d'un onglet (POST)
export const NewCourseTabSchema = z.object({
  courseId: z.number().int().positive("L'ID du cours doit être un entier positif"),
  key: z.string().min(1, "La clé est requise").max(100, "La clé ne doit pas dépasser 100 caractères"),
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères"),
  isActive: z.boolean().default(false).optional(),
  orderIndex: z.number().int().nonnegative("L'index d'ordre doit être un entier non négatif"),
  createdAt: z.union([z.date(), z.null()]).optional(),
}).strict();

// Schéma pour la mise à jour d'un onglet (PUT)
export const UpdateCourseTabSchema = z.object({
  courseId: z.number().int().positive("L'ID du cours doit être un entier positif").optional(),
  key: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(255).optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().int().nonnegative().optional(),
}).partial();