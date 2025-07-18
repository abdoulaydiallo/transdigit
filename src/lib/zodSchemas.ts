import { z } from "zod";
import { ERROR_CODES } from "@/services/services.errors";

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

export const ToolIdSchema = z
  .string()
  .regex(/^\d+$/, "L'ID de l'outil doit être un nombre")
  .transform(Number)
  .refine((val) => val >= 1, "L'ID de l'outil doit être supérieur ou égal à 1");

export const PartnerIdSchema = z
  .string()
  .regex(/^\d+$/, "L'ID du partenaire doit être un nombre")
  .transform(Number)
  .refine((val) => val >= 1, "L'ID du partenaire doit être supérieur ou égal à 1");

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
  courseId: z.number().int().positive("L'ID du cours doit être un entier positif"),
  number: z.number().int().positive("Le numéro du module doit être un entier positif"),
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères"),
  orderIndex: z.number().int().nonnegative("L'index d'ordre doit être un entier non négatif"),
  description: z.string().max(65535, "La description est trop longue").nullable().optional(),
  duration: z.string().max(50, "La durée ne doit pas dépasser 50 caractères").nullable().optional(),
  id: z.number().int().positive("L'ID doit être un entier positif").optional(),
  createdAt: z.union([z.date(), z.null()]).optional(),
  updatedAt: z.union([z.date(), z.null()]).optional(),
}).strict();

// Schéma pour la mise à jour d'un module (PUT)
export const UpdateCourseModuleSchema = z.object({
  courseId: z.number().optional(),
  title: z.string().min(1).optional(),
  number: z.number().min(1).optional(),
  orderIndex: z.number().min(0).optional(),
  description: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
}).partial();

// Schéma pour la création d'un outil (POST)
export const NewToolSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis").max(255, "Le nom ne doit pas dépasser 255 caractères"),
    description: z.string().nullable().optional(),
    url: z.string().url().nullable().optional(),
  })
  .strict();

// Schéma pour la mise à jour d'un outil (PUT)
export const UpdateToolSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis").max(255).optional(),
    description: z.string().nullable().optional(),
    url: z.string().url().nullable().optional(),
  })
  .strict();

// Schéma pour la création d'un partenaire (POST)
export const NewPartnerSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis").max(255, "Le nom ne doit pas dépasser 255 caractères"),
    description: z.string().nullable().optional(),
    url: z.string().url().nullable().optional(),
  })
  .strict();

// Schéma pour la mise à jour d'un partenaire (PUT)
export const UpdatePartnerSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis").max(255).optional(),
    description: z.string().nullable().optional(),
    url: z.string().url().nullable().optional(),
  })
  .strict();

// Schéma pour l'association d'un outil ou partenaire à un cours
export const AssociateToolSchema = z.object({
  toolId: z.number().int().min(1, "L'ID de l'outil doit être supérieur ou égal à 1"),
}).strict();

export const AssociatePartnerSchema = z.object({
  partnerId: z.number().int().min(1, "L'ID du partenaire doit être supérieur ou égal à 1"),
}).strict();

// Schéma pour les paramètres de recherche (GET /api/courses)
export const SearchParamsSchema = z
  .object({
    isActive: z
      .union([z.enum(["true", "false"]), z.enum(["1", "0"]), z.boolean()])
      .optional()
      .transform((val) => {
        if (typeof val === "boolean") return val;
        return val === "true" || val === "1" ? true : val === "false" || val === "0" ? false : undefined;
      }),
    title: z.string().min(1).max(255).optional(),
    page: z
      .string()
      .regex(/^\d+$/, "La page doit être un nombre")
      .transform(Number)
      .refine((val) => val >= 1, "La page doit être supérieure ou égale à 1")
      .default(1),
    per_page: z
      .string()
      .regex(/^\d+$/, "per_page doit être un nombre")
      .transform(Number)
      .refine((val) => val >= 1 && val <= 100, "per_page doit être entre 1 et 100")
      .default(10),
  })
  .strict();

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
        createdAt: z.string(),
        updatedAt: z.string(),
      })
    ),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    total_pages: z.number().int().min(0),
  }),
});

// Schéma pour la réponse de GET /api/courses/:id, POST /api/courses, PUT /api/courses/:id
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
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

// Schéma pour la réponse de GET /api/courses/:id/modules, POST /api/courses/:id/modules, PUT /api/modules/:id
export const CourseModuleResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.number().int().min(1),
    courseId: z.number().int().min(1),
    title: z.string().min(1).max(255),
    number: z.string().min(1).max(50),
    orderIndex: z.number().int().min(0),
    description: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

// Schéma pour la réponse de GET /api/courses/:id/modules
export const CourseModulesResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(
    z.object({
      id: z.number().int().min(1),
      courseId: z.number().int().min(1),
      title: z.string().min(1).max(255),
      number: z.string().min(1).max(50),
      orderIndex: z.number().int().min(0),
      description: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
});

// Schéma pour la réponse de GET /api/tools/:id, POST /api/tools, PUT /api/tools/:id
export const ToolResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.number().int().min(1),
    name: z.string().min(1).max(255),
    description: z.string().nullable(),
    url: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

// Schéma pour la réponse de GET /api/courses/:id/tools
export const CourseToolsResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(
    z.object({
      id: z.number().int().min(1),
      name: z.string().min(1).max(255),
      description: z.string().nullable(),
      url: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
});

// Schéma pour la réponse de GET /api/partners/:id, POST /api/partners, PUT /api/partners/:id
export const PartnerResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.number().int().min(1),
    name: z.string().min(1).max(255),
    description: z.string().nullable(),
    url: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

// Schéma pour la réponse de GET /api/courses/:id/partners
export const CoursePartnersResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(
    z.object({
      id: z.number().int().min(1),
      name: z.string().min(1).max(255),
      description: z.string().nullable(),
      url: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
});

// Schéma pour la réponse de DELETE /api/courses/:id, DELETE /api/modules/:id, DELETE /api/tools/:id, DELETE /api/partners/:id, POST/DELETE /api/courses/:id/tools, POST/DELETE /api/courses/:id/partners
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
export const UseCoursesPropsSchema = z
  .object({
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
  })
  .strict();
