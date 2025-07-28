import { z } from "zod";
import { lessons } from "../db/schema";

// Définir les valeurs d'enum comme `const` pour le typage
const LESSON_TYPES = ["texte", "video", "pdf"] as const;
const DIFFICULTY_LEVELS = ["facile", "moyen", "difficile"] as const;

export const TiptapJsonContentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.any()).optional(), 
})

// Schéma pour la création d'une leçon (POST)
export const NewLessonSchema = z.object({
  moduleId: z.number().int().positive("L'ID du module doit être un entier positif"),
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères"),
  type: z.enum(LESSON_TYPES),
  content: TiptapJsonContentSchema, // Utiliser le nouveau schéma
  orderIndex: z.number().int().nonnegative("L'index d'ordre doit être un entier non négatif"),
  estimatedTime: z.number().int().positive("Le temps estimé doit être un entier positif").optional(),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  videoUrl: z.string().max(500).nullable().optional(),
  pdfUrl: z.string().max(500).nullable().optional(),
  tags: z.array(z.string().min(1, "Les tags ne doivent pas être vides")),
  isActive: z.boolean().default(true),
}).strict();

// Schéma pour la mise à jour d'une leçon (PUT)
export const UpdateLessonSchema = z.object({
  moduleId: z.number().int().positive("L'ID du module doit être un entier positif").optional(),
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères").optional(),
  type: z.enum(LESSON_TYPES).optional(),
  content: TiptapJsonContentSchema.optional(), 
  orderIndex: z.number().int().nonnegative("L'index d'ordre doit être un entier non négatif").optional(),
  estimatedTime: z.number().int().positive("Le temps estimé doit être un entier positif").optional(),
  difficulty: z.enum(DIFFICULTY_LEVELS).optional(),
  tags: z.array(z.string().min(1, "Les tags ne doivent pas être vides")).optional(),
  videoUrl: z.string().max(500).nullable().optional(),
  pdfUrl: z.string().max(500).nullable().optional(),
  isActive: z.boolean().nullable().optional(),
}).partial();

export type Lesson = Omit<typeof lessons.$inferSelect, "content"> & {
  content: z.infer<typeof TiptapJsonContentSchema>;
};