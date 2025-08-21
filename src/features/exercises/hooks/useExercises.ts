// features/exercises/hooks/useExercises.ts
import { trpc } from "@/trpc/react";
import { ExerciseInstructionsSchema } from "@/lib/validations/exercise.schema";
import { ExerciseWithRelations } from "@/types/exercise";

interface UseExercisesProps {
  moduleId?: number;
  exerciseId?: number;
}

export function useExercises({ moduleId, exerciseId }: UseExercisesProps) {
  const utils = trpc.useUtils();

  // Liste des exercices par module
// useExercises.ts
const exercisesQuery = trpc.exercises.byModule.useQuery(
  { moduleId: moduleId! },
  {
    enabled: !!moduleId && moduleId > 0,
    select: (data) =>
      data.exercises.map((exercise): ExerciseWithRelations => ({
        ...exercise,
        instructions: exercise.instructions
          ? ExerciseInstructionsSchema.safeParse(exercise.instructions).data ?? undefined
          : undefined,
        createdAt: exercise.createdAt ? new Date(exercise.createdAt) : null,
        updatedAt: exercise.updatedAt ? new Date(exercise.updatedAt) : null,
        deadline: exercise.deadline ? new Date(exercise.deadline) : null, // ✅ string → Date
      })),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  }
);

  // Création
  const createExercise = trpc.exercises.create.useMutation({
    onSuccess: (data, variables) => {
      console.log("Création réussie:", data);
      utils.exercises.byModule.invalidate({ moduleId: variables.moduleId });
    },
    onError: (error) => {
      console.error("Erreur création:", error);
    },
  });

  // Mise à jour
  const updateExercise = trpc.exercises.update.useMutation({
    onSuccess: (_, variables) => {
      utils.exercises.byModule.invalidate({ moduleId: variables.data.moduleId });
      utils.exercises.byId.invalidate({ id: variables.id });
    },
    onError: (error) => {
      console.error("Erreur mise à jour:", error);
    },
  });

  // Suppression
  const deleteExercise = trpc.exercises.delete.useMutation({
    onSuccess: (_, variables) => {
      utils.exercises.byId.invalidate({ id: variables.id });
    },
    onError: (error) => {
      console.error("Erreur suppression:", error);
    },
  });

  // Détail par ID
  const getExerciseByIdQuery = trpc.exercises.byId.useQuery(
    { id: exerciseId! },
    {
      enabled: !!exerciseId,
      select: (data): ExerciseWithRelations | null => {
        if (!data) return null;
        return {
          ...data,
          instructions: data.instructions
            ? ExerciseInstructionsSchema.safeParse(data.instructions).data ?? undefined
            : undefined,
          deadline: new Date(data?.deadline ?? ""),
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        };
      },
      throwOnError: false,
    }
  );

  return {
    // Données
    exercises: exercisesQuery.data,
    isLoading: exercisesQuery.isLoading,
    error: exercisesQuery.error,
    isFetching: exercisesQuery.isFetching,

    // Actions
    createExercise: createExercise.mutateAsync,
    updateExercise: updateExercise.mutateAsync,
    deleteExercise: deleteExercise.mutateAsync,

    // Détail
    getExerciseById: {
      ...getExerciseByIdQuery,
       data: getExerciseByIdQuery.data as ExerciseWithRelations | null,
    },

    // Contrôle
    refetch: () => utils.exercises.byModule.invalidate({ moduleId }),
  };
}