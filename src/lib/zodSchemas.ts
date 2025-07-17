import { z } from "zod";
import { ERROR_CODES } from "@/services/services.errors";

// Schéma pour l'ID du cours
export const CourseIdSchema = z.string().regex(/^\d+$/, "L'ID du cours doit être un nombre").transform(Number).refine(val => val >= 1, "L'ID du cours doit être supérieur ou égal à 1");

// Schéma pour la création d'un cours (POST)
export const NewCourseSchema = z.object({
  key: z.string().min(1, "La clé est requise").max(100, "La clé ne doit pas dépasser 100 caractères").regex(/^[a-z0-9-]+$/, "La clé doit être alphanumérique avec des tirets"),
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères"),
  description: z.string().nullable(),
  imageSrc: z.string().max(500).nullable(),
  duration: z.string().max(50).nullable(),
  totalHours: z.number().int().positive().nullable(),
  isActive: z.boolean().default(true),
}).strict();

// Schéma pour la mise à jour d'un cours (PUT)
export const UpdateCourseSchema = z.object({
  key: z.string().min(1, "La clé est requise").max(100).regex(/^[a-z0-9-]+$/, "La clé doit être alphanumérique avec des tirets").optional(),
  title: z.string().min(1, "Le titre est requis").max(255).optional(),
  description: z.string().nullable().optional(),
  imageSrc: z.string().max(500).nullable().optional(),
  duration: z.string().max(50).nullable().optional(),
  totalHours: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
}).strict();

// Schéma pour les paramètres de recherche (GET /api/courses)
export const SearchParamsSchema = z.object({
  isActive: z
    .union([
      z.enum(["true", "false"]),
      z.enum(["1", "0"]),
      z.boolean(),
    ])
    .optional()
    .transform(val => {
      if (typeof val === "boolean") return val;
      return val === "true" || val === "1" ? true : val === "false" || val === "0" ? false : undefined;
    }),
  title: z.string().min(1).max(255).optional(),
  page: z.string().regex(/^\d+$/, "La page doit être un nombre").transform(Number).refine(val => val >= 1, "La page doit être supérieure ou égale à 1").default(1),
  per_page: z.string().regex(/^\d+$/, "per_page doit être un nombre").transform(Number).refine(val => val >= 1 && val <= 100, "per_page doit être entre 1 et 100").default(10),
}).strict();

// Schéma pour la réponse de GET /api/courses
export const CoursesResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    courses: z.array(
      z.object({
        id: z.number().int().min(1),
        key: z.string().min(1).max(100),
        title: z.string().min(1).max(255),
        description: z.string().nullable(),
        imageSrc: z.string().nullable(),
        duration: z.string().nullable(),
        totalHours: z.number().int().nullable(),
        isActive: z.boolean(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
      })
    ),
    total: z.number().int().min(0),
  }),
});

// Schéma pour la réponse de GET /api/courses/:id, POST, et PUT
export const CourseResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.number().int().min(1),
    key: z.string().min(1).max(100),
    title: z.string().min(1).max(255),
    description: z.string().nullable(),
    imageSrc: z.string().nullable(),
    duration: z.string().nullable(),
    totalHours: z.number().int().nullable(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

// Schéma pour la réponse de DELETE /api/courses/:id
export const DeleteResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({}).strict(),
});

// Schéma pour les erreurs API
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.enum([...Object.values(ERROR_CODES)] as [string, ...string[]]),
    message: z.string(),
    details: z.any().nullable(),
    cause: z.any().nullable(),
  }),
});

// Schéma pour les paramètres du hook useCourses
export const UseCoursesPropsSchema = z.object({
  page: z.number().int().min(1, "La page doit être supérieure ou égale à 1").optional().default(1),
  per_page: z.number().int().min(1).max(100, "per_page doit être entre 1 et 100").optional().default(10),
  filters: z
    .object({
      isActive: z.boolean().optional(),
      title: z.string().min(1).max(255).optional(),
    })
    .optional()
    .default({}),
  courseId: z.number().int().min(1, "L'ID du cours doit être supérieur ou égal à 1").optional(),
}).strict();
