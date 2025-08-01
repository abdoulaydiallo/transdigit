import { trpc } from "@/trpc/react";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { 
  NewQuestionSchema, 
  UpdateQuestionSchema, 
  QuestionOptionsSchema 
} from "@/lib/validations/questions.schema";
import { Question } from "@/lib/db/schema";

// Interface pour les paramètres du hook
type UseQuestionsProps = {
  lessonId?: number;
  questionId?: number;
};

export function useQuestions(props: UseQuestionsProps = {}) {
  const utils = trpc.useUtils();

  // Récupérer toutes les questions d'une leçon
  const questionsQuery = trpc.questions.byLesson.useQuery(
    { lessonId: props.lessonId! },
    {
      enabled: !!props.lessonId && props.lessonId > 0,
      select: (data) => data.questions.map((question) => ({
        ...question,
        options: question.options ? QuestionOptionsSchema.parse(question.options) : undefined,
      })),
      staleTime: 1000 * 60, // Cache de 1 minute
      refetchOnWindowFocus: false,
    }
  );

  // Créer une question
  const createQuestion = trpc.questions.create.useMutation({
    onSuccess: (data, variables) => {
      console.log("Création réussie, données reçues:", data);
      utils.questions.byLesson.invalidate({ lessonId: variables.lessonId });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la question:", error);
    },
  });

  // Mettre à jour une question
  const updateQuestion = trpc.questions.update.useMutation({
    onSuccess: (data, variables) => {
      console.log("Mise à jour réussie, données reçues:", data);
      utils.questions.byLesson.invalidate({ lessonId: variables.UpdateQuestionSchema.lessonId });
      utils.questions.byId.invalidate({ id: variables.id });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de la question:", error);
    },
  });

  // Supprimer une question
  const deleteQuestion = trpc.questions.delete.useMutation({
    onSuccess: (_, variables) => {
      utils.questions.byId.invalidate({ id: variables.id });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la question:", error);
    },
  });

  // Récupérer une question par ID
  const getQuestionById = trpc.questions.byId.useQuery(
    { id: props.questionId! },
    {
      enabled: !!props.questionId && !!props.lessonId,
      select: (data) =>
        data
          ? {
              ...data,
              options: data.options ? QuestionOptionsSchema.parse(data.options) : undefined,
            }
          : null,
      throwOnError: false,
    }
  );

  return {
    // Données
    questions: questionsQuery.data,
    isLoading: questionsQuery.isLoading,
    error: questionsQuery.error,
    isFetching: questionsQuery.isFetching,

    // Actions
    createQuestion: async (variables: { lessonId: number; data: Omit<Question, "id" | "createdAt" | "updatedAt">}) => {
      // Transformation et validation des données
      const questionData = {
        lessonId: variables.lessonId,
        type: variables.data.type || "texte_libre",
        questionText: variables.data.questionText?.trim() || "",
        options: variables.data.options,
        correctAnswer: variables.data.correctAnswer?.trim() || undefined,
        explanation: variables.data.explanation?.trim() || undefined,
        maxScore: variables.data.maxScore ?? 1,
        orderIndex: Number(variables.data.orderIndex) >= 0 ? Number(variables.data.orderIndex) : 0,
        difficulty: variables.data.difficulty || "facile",
        tags: Array.isArray(variables.data.tags) ? variables.data.tags.filter((tag) => tag && tag.trim() !== "") : [],
        timeLimit: variables.data.timeLimit,
        isActive: variables.data.isActive ?? true,
      };

      const validatedData = NewQuestionSchema.safeParse(questionData);
      if (!validatedData.success) {
        console.error("Erreur de validation client:", validatedData.error.flatten());
        throw new Error("Format des données invalide: " + JSON.stringify(validatedData.error.flatten()));
      }

      try {
        return await createQuestion.mutateAsync(validatedData.data);
      } catch (error) {
        if (error instanceof Error) {
          throw new ServiceError(ERROR_CODES.DATABASE_ERROR, error.message);
        }
        throw error;
      }
    },

    updateQuestion: async (variables: { lessonId: number; id: number; data: Partial<Omit<Question, "id" | "createdAt" | "updatedAt">> }) => {
      const questionData = {
        lessonId: variables.lessonId,
        type: variables.data.type,
        questionText: variables.data.questionText?.trim(),
        options: variables.data.options,
        correctAnswer: variables.data.correctAnswer?.trim(),
        explanation: variables.data.explanation?.trim(),
        maxScore: variables.data.maxScore,
        orderIndex: variables.data.orderIndex !== undefined ? Number(variables.data.orderIndex) : undefined,
        difficulty: variables.data.difficulty,
        tags: Array.isArray(variables.data.tags) ? variables.data.tags.filter((tag) => tag && tag.trim() !== "") : undefined,
        timeLimit: variables.data.timeLimit,
        isActive: variables.data.isActive,
      };

      const validatedData = UpdateQuestionSchema.safeParse(questionData);
      if (!validatedData.success) {
        console.error("Erreur de validation client:", validatedData.error.flatten());
        throw new Error("Format des données invalide: " + JSON.stringify(validatedData.error.flatten()));
      }

      try {
        return await updateQuestion.mutateAsync({
          id: variables.id,
          UpdateQuestionSchema: validatedData.data,
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new ServiceError(ERROR_CODES.DATABASE_ERROR, error.message);
        }
        throw error;
      }
    },

    deleteQuestion: async (variables: { lessonId: number; id: number }) => {
      try {
        await deleteQuestion.mutateAsync({ id: variables.id });
        return null;
      } catch (error) {
        if (error instanceof Error) {
          throw new ServiceError(ERROR_CODES.DATABASE_ERROR, error.message);
        }
        throw error;
      }
    },

    // Détails
    getQuestionById: {
      ...getQuestionById,
      data: getQuestionById.data as Question | null,
    },

    // Contrôle
    refetch: () => utils.questions.byLesson.invalidate({ lessonId: props.lessonId }),
  };
}