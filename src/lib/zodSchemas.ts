import { z } from "zod";

// Schéma pour les IDs
export const CourseIdSchema = z.union([
  z.string().regex(/^\d+$/, "ID doit être un nombre").transform(Number),
  z.number().int().positive("ID doit être un entier positif")
]).refine(val => val > 0, {
  message: "ID doit être supérieur à 0"
});

export const ModuleIdSchema = z
  .string()
  .regex(/^\d+$/, "L'ID du module doit être un nombre")
  .transform(Number)
  .refine((val) => val >= 1, "L'ID du module doit être supérieur ou égal à 1");

  export const SearchParamsSchema = z.object({
    isActive: z.boolean().optional(),    
    title: z.string().optional(),
    page: z.string().optional(),
    per_page: z.string().optional(),
}).strict();

// Schéma pour la création d'un cours (POST)
export const NewCourseSchema = z
  .object({
    key: z
      .string()
      .min(1, "La clé est requise")
      .max(100, "La clé ne doit pas dépasser 100 caractères")
      .regex(/^[a-z0-9-]+$/, "La clé doit être alphanumérique avec des tirets"),
    title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères"),
    description: z.string().nullable(),
    imageSrc: z.string().max(500).nullable(),
    duration: z.string().max(50).nullable(),
    totalHours: z.number().int().positive().nullable(),
    isActive: z.boolean().default(true),
  })
  .strict();

// Schéma pour la mise à jour d'un cours (PUT)
export const UpdateCourseSchema = z
  .object({
    key: z
      .string()
      .min(1, "La clé est requise")
      .max(100)
      .regex(/^[a-z0-9-]+$/, "La clé doit être alphanumérique avec des tirets")
      .optional(),
    title: z.string().min(1, "Le titre est requis").max(255).optional(),
    description: z.string().nullable().optional(),
    imageSrc: z.string().max(500).nullable().optional(),
    duration: z.string().max(50).nullable().optional(),
    totalHours: z.number().int().positive().nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

// Schéma pour la création d'un module (POST)
export const NewCourseModuleSchema = z.object({
  id: z.number().int().positive("L'ID doit être un entier positif").optional(),
  courseId: z.number().int().positive("L'ID du cours doit être un entier positif"),
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères"),
  duration: z.string().max(50, "La durée ne doit pas dépasser 50 caractères").nullable().optional(),
  description: z.string().max(65535, "La description est trop longue").nullable().optional(),
  steps: z.array(z.string()).optional().nullable(),
  orderIndex: z.number().int().nonnegative("L'index d'ordre doit être un entier non négatif"),
  createdAt: z.union([z.date(), z.null()]).optional(),
  updatedAt: z.union([z.date(), z.null()]).optional(),
}).strict();

// Schéma pour la mise à jour d'un module (PUT)
export const UpdateCourseModuleSchema = z.object({
  courseId: z.number().optional(),
  title: z.string().min(1).optional(),
  orderIndex: z.number().min(0).optional(),
  description: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  steps: z.array(z.string()).optional().nullable(),
}).partial();


export type ModuleFormValues = z.infer<typeof NewCourseModuleSchema>;

