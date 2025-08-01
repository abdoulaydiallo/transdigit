// lib/types/exercise.ts
import { z } from "zod";
import { ExerciseInstructionsSchema, NewExerciseSchema } from "@/lib/validations/exercise.schema";

export type ExerciseFormData = z.infer<typeof NewExerciseSchema>;

export interface ExerciseWithRelations {
  id: number;
  moduleId: number;
  title: string;
  description: string | null;
  type: "projet" | "quiz" | "tache";
  submissionUrl: string | null;
  score: number | null;
  maxScore: number;
  deadline: Date | null; // ✅ deadline peut être Date ou null
  difficulty: "facile" | "moyen" | "difficile" | null; // ✅ peut être null
  tags: string[] | null;
  instructions: z.infer<typeof ExerciseInstructionsSchema> | undefined; // ✅ ou undefined
  feedback: string | null;
  isActive: boolean | null;
  createdAt: Date | null; // ✅ peut être null
  updatedAt: Date | null; // ✅ peut être null
}