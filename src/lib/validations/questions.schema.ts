// lib/validations/question.schema.ts
import { z } from "zod";

// Schéma pour les options de question
export const QuestionOptionsSchema = z.object({
  choices: z.array(z.object({
    id: z.string().uuid().optional(),
    text: z.string().min(1, "Le texte du choix est requis"),
    isCorrect: z.boolean().optional(),
  })).optional(),
  correctChoiceId: z.string().uuid().optional(),
});

// Types d'énumération - DOIT matcher exactement la DB
const QUESTION_TYPES = ["choix_multiple", "texte_libre", "vrai_faux"] as const;
const DIFFICULTY_LEVELS = ["facile", "moyen", "difficile"] as const;

// Schéma de création
export const NewQuestionSchema = z.object({
  lessonId: z.number().int().positive("L'ID de la leçon doit être un entier positif"),
  type: z.enum(QUESTION_TYPES),
  questionText: z.string().min(1, "Le texte de la question est requis").max(2000, "Le texte de la question est trop long"),
  options: QuestionOptionsSchema.optional(),
  correctAnswer: z.string().max(500).optional(),
  explanation: z.string().max(2000).optional(),
  maxScore: z.number().positive("Le score maximum doit être positif").default(1).optional(),
  orderIndex: z.number().int().nonnegative("L'index d'ordre doit être un entier non négatif"),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  tags: z.array(z.string().min(1)).max(10).optional(),
  timeLimit: z.number().int().nullable(),
  isActive: z.boolean().default(true).optional(),
}).strict();

// Schéma de mise à jour
export const UpdateQuestionSchema = NewQuestionSchema.partial();
