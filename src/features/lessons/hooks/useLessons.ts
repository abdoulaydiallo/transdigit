
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { NewLessonSchema, UpdateLessonSchema, TiptapJsonContentSchema, Lesson } from "@/lib/validations/courseLessons";
import { trpc } from "@/trpc/react";

type UseLessonsProps = {
  moduleId?: number;
  lessonId?: number;
};

export function useLessons(props: UseLessonsProps = {}) {
  const utils = trpc.useUtils();

  // Récupérer toutes les leçons d'un module
  const { data: lessons, isLoading, error } = trpc.lessons.byModule.useQuery(
    { moduleId: props.moduleId! },
    {
      enabled: !!props.moduleId,
      select: (data) => {
        // Transformer les données pour correspondre à l'ancienne structure
        return data.lessons.map((lesson) => ({
          ...lesson,
          content: TiptapJsonContentSchema.parse(lesson.content),
        }));
      },
    }
  );

  // Créer une leçon
  const createLesson = trpc.lessons.create.useMutation({
    onSuccess: (data, variables) => {
      // Transformer la réponse pour correspondre à l'ancienne structure
      const transformedData = {
        ...data,
        content: data.content ? TiptapJsonContentSchema.parse(data.content) : undefined,
      };
      console.log("Création réussie, données reçues:", transformedData);
      utils.lessons.byModule.invalidate({ moduleId: variables.moduleId });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la leçon:", error);
    },
  });

  // Mettre à jour une leçon
  const updateLesson = trpc.lessons.update.useMutation({
    onSuccess: (data, variables) => {
      // Transformer la réponse pour correspondre à l'ancienne structure
      const transformedData = {
        ...data,
        content: data.content ? TiptapJsonContentSchema.parse(data.content) : undefined,
      };
      console.log("Mise à jour réussie, données reçues:", transformedData);
      utils.lessons.byModule.invalidate({ moduleId: variables.UpdateLessonSchema.moduleId });
      utils.lessons.byId.invalidate({ id: variables.id });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de la leçon:", error);
    },
  });

  // Supprimer une leçon
  const deleteLesson = trpc.lessons.delete.useMutation({
    onSuccess: (_, variables) => {
      utils.lessons.byModule.invalidate({ moduleId: variables.id });
      utils.lessons.byId.invalidate({ id: variables.id });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la leçon:", error);
    },
  });

  // Récupérer une leçon par ID
  const getLessonById = trpc.lessons.byId.useQuery(
    { id: props.lessonId! },
    {
      enabled: !!props.lessonId && !!props.moduleId,
      select: (data) => {
        if (!data) return null;
        return {
          ...data,
          content: TiptapJsonContentSchema.parse(data.content),
        };
      },
      throwOnError: false,
    }
  );

  return {
    lessons,
    isLoading,
    error,
    createLesson: async (variables: { moduleId: number; data: Omit<Lesson, "id" | "createdAt" | "updatedAt"> }) => {
      // Validation client comme avant
      const lessonData = {
        moduleId: variables.moduleId,
        title: variables.data.title?.trim() || "",
        type: variables.data.type || "texte",
        content: variables.data.content || { type: "doc", content: [] },
        videoUrl: variables.data.videoUrl && typeof variables.data.videoUrl === "string" && variables.data.videoUrl.trim() !== "" ? variables.data.videoUrl.trim() : null,
        pdfUrl: variables.data.pdfUrl && typeof variables.data.pdfUrl === "string" && variables.data.pdfUrl.trim() !== "" ? variables.data.pdfUrl.trim() : null,
        orderIndex: Number(variables.data.orderIndex) >= 0 ? Number(variables.data.orderIndex) : 0,
        estimatedTime: variables.data.estimatedTime && Number(variables.data.estimatedTime) > 0 ? Number(variables.data.estimatedTime) : undefined,
        difficulty: variables.data.difficulty || "facile",
        tags: Array.isArray(variables.data.tags) ? variables.data.tags.filter((tag) => tag && tag.trim() !== "") : [],
        isActive: variables.data.isActive ?? false,
      };

      const validatedData = NewLessonSchema.safeParse(lessonData);
      if (!validatedData.success) {
        console.error("Erreur de validation client:", validatedData.error.flatten());
        throw new Error("Format des données invalide: " + JSON.stringify(validatedData.error.flatten()));
      }

      try {
        return await createLesson.mutateAsync(validatedData.data);
      } catch (error) {
        // Transformer l'erreur pour correspondre à l'ancienne structure
        if (error instanceof Error) {
          throw new ServiceError(
            ERROR_CODES.DATABASE_ERROR,
            error.message
          );
        }
        throw error;
      }
    },
    updateLesson: async (variables: { moduleId: number; id: number; data: Partial<Omit<Lesson, "id" | "createdAt" | "updatedAt">> }) => {
      const validatedData = UpdateLessonSchema.safeParse(variables.data);
      if (!validatedData.success) {
        console.error("Erreur de validation client:", validatedData.error.flatten());
        throw new Error("Format des données invalide: " + JSON.stringify(validatedData.error.flatten()));
      }

      try {
        return await updateLesson.mutateAsync({
          id: variables.id,
          UpdateLessonSchema: { ...validatedData.data, moduleId: variables.moduleId }
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new ServiceError(
            ERROR_CODES.DATABASE_ERROR,
            error.message
          );
        }
        throw error;
      }
    },
    deleteLesson: async (variables: { moduleId: number; id: number }) => {
      try {
        await deleteLesson.mutateAsync({ id: variables.id });
        return null;
      } catch (error) {
        if (error instanceof Error) {
          throw new ServiceError(
            ERROR_CODES.DATABASE_ERROR,
            error.message
          );
        }
        throw error;
      }
    },
    getLessonById: {
      ...getLessonById,
      data: getLessonById.data as Lesson | null,
    },
    refetch: () => utils.lessons.byModule.invalidate({ moduleId: props.moduleId }),
  };
}