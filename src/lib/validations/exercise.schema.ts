// lib/validations/exercise.schema.ts
import { z } from "zod";

// Schéma pour les instructions (Tiptap ou structure personnalisée)
export const ExerciseInstructionsSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.any()).optional(),
});

// Types d'énumération
const EXERCISE_TYPES = ["projet", "quiz", "tache"] as const;
const DIFFICULTY_LEVELS = ["facile", "moyen", "difficile"] as const;

export const zodDatetimeLocal = () =>
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Format: YYYY-MM-DDTHH:mm")
    .refine((str) => {
      const d = new Date(str);
      return !isNaN(d.getTime());
    }, "Date invalide")
    .nullable()

// Schéma de création
export const NewExerciseSchema = z.object({
  moduleId: z.number().int().positive("L'ID du module doit être un entier positif"),
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères"),
  description: z.string().max(2000).optional(),
  type: z.enum(EXERCISE_TYPES),
  submissionUrl: z
  .preprocess((val) => (typeof val === "string" ? val.trim() : val), 
    z.string().url("URL invalide").max(500).nullable().optional()
  ),
  maxScore: z.number().positive("Le score maximum doit être positif"),
  deadline: zodDatetimeLocal(),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  tags: z.array(z.string().min(1, "Les tags ne doivent pas être vides")).max(10).optional(),
  instructions: ExerciseInstructionsSchema.optional(),
  isActive: z.boolean().default(true),
}).strict();

// Schéma de mise à jour
export const UpdateExerciseSchema = NewExerciseSchema.partial();
export type ExerciseFormData = z.infer<typeof NewExerciseSchema>;