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
  courseId: z.number().int().positive(),
  title: z.string().min(1).max(255),
  orderIndex: z.number().int().nonnegative(),
  duration: z.number().min(0).nullable(),
  description: z.string().max(65535).nullable(),
  steps: z.array(z.string().min(1)).default([]),
  tools: z.object({
    title: z.string().default(""),
    content: z.array(
      z.object({
        name: z.string(),
        src: z.string(),
      })
    ).default([]),
  }).nullable(),
}).strict();

export const UpdateCourseModuleSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  courseId: z.number().int().positive().optional(),
  orderIndex: z.number().int().nonnegative().optional(),
  duration: z.number().min(0).nullable().optional(),
  description: z.string().max(65535).nullable().optional(),
  steps: z.array(z.string().min(1)).optional(),
  tools: z.union([
    z.object({
      title: z.string().optional(),
      content: z.array(
        z.object({
          name: z.string(),
          src: z.string(),
        })
      ).optional(),
    }),
    z.null()
  ]).optional(),
}).strict().refine(data => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour"
});
  
export type ModuleFormValues = z.infer<typeof NewCourseModuleSchema>;

