import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceError, ErrorCode, ERROR_CODES } from "@/services/services.errors";
import { NewLessonSchema, UpdateLessonSchema, TiptapJsonContentSchema } from "@/lib/validations/courseLessons";
import { Lesson } from "@/lib/db/schema";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

type UseLessonsProps = {
  moduleId?: number;
  lessonId?: number;
};

export function useLessons(props: UseLessonsProps = {}) {
  const queryClient = useQueryClient();

  // Récupérer toutes les leçons d'un module
  const { data: lessons, isLoading, error } = useQuery({
    queryKey: ["lessons", props.moduleId],
    queryFn: async () => {
      if (!props.moduleId) return [];
      const res = await fetch(`/api/modules/${props.moduleId}/lessons`);
      const result: ApiResponse<Lesson[]> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      return result.data.map((lesson) => ({
        ...lesson,
        content: TiptapJsonContentSchema.parse(lesson.content),
      }));
    },
    enabled: !!props.moduleId,
  });

  // Créer une leçon
  const createLesson = useMutation({
    mutationFn: async ({ moduleId, data }: { moduleId: number; data: Omit<Lesson, "id" | "createdAt" | "updatedAt"> }) => {
      if (!moduleId) {
        throw new Error("moduleId est requis pour créer une leçon");
      }

      // Préparer les données pour la validation
      const lessonData = {
        moduleId,
        title: data.title?.trim() || "",
        type: data.type || "texte",
        content: data.content || { type: "doc", content: [] },
        videoUrl: data.videoUrl && typeof data.videoUrl === "string" && data.videoUrl.trim() !== "" ? data.videoUrl.trim() : null,
        pdfUrl: data.pdfUrl && typeof data.pdfUrl === "string" && data.pdfUrl.trim() !== "" ? data.pdfUrl.trim() : null,
        orderIndex: Number(data.orderIndex) >= 0 ? Number(data.orderIndex) : 0,
        estimatedTime: data.estimatedTime && Number(data.estimatedTime) > 0 ? Number(data.estimatedTime) : undefined,
        difficulty: data.difficulty || "facile",
        tags: Array.isArray(data.tags) ? data.tags.filter((tag) => tag && tag.trim() !== "") : [],
        isActive: data.isActive ?? false,
      };

      // Valider les données avec NewLessonSchema
      const validatedData = NewLessonSchema.safeParse(lessonData);
      if (!validatedData.success) {
        console.error("Erreur de validation client:", validatedData.error.flatten());
        throw new Error("Format des données invalide: " + JSON.stringify(validatedData.error.flatten()));
      }

      const res = await fetch(`/api/modules/${moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData.data),
      });

      const result: ApiResponse<Lesson> = await res.json();
      console.log("Réponse du serveur:", result);

      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }

      return {
        ...result.data,
        content: result.data.content ? TiptapJsonContentSchema.parse(result.data.content) : undefined,
      };
    },
    onSuccess: (data, variables) => {
      console.log("Création réussie, données reçues:", data);
      queryClient.invalidateQueries({ queryKey: ["lessons", variables.moduleId] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la leçon:", error);
    },
  });

  // Mettre à jour une leçon
  const updateLesson = useMutation({
    mutationFn: async ({ moduleId, id, data }: { moduleId: number; id: number; data: Partial<Omit<Lesson, "id" | "createdAt" | "updatedAt">> }) => {
      if (!moduleId) {
        throw new Error("moduleId est requis pour mettre à jour une leçon");
      }

      const validatedData = UpdateLessonSchema.safeParse(data);
      if (!validatedData.success) {
        console.error("Erreur de validation client:", validatedData.error.flatten());
        throw new Error("Format des données invalide: " + JSON.stringify(validatedData.error.flatten()));
      }

      const res = await fetch(`/api/lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validatedData.data, moduleId }),
      });

      const result: ApiResponse<Lesson> = await res.json();
      console.log("Réponse du serveur:", result);

      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }

      return {
        ...result.data,
        content: result.data.content ? TiptapJsonContentSchema.parse(result.data.content) : undefined,
      };
    },
    onSuccess: (data, variables) => {
      console.log("Mise à jour réussie, données reçues:", data);
      queryClient.invalidateQueries({ queryKey: ["lessons", variables.moduleId] });
      queryClient.invalidateQueries({ queryKey: ["lesson", variables.id] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de la leçon:", error);
    },
  });

  // Supprimer une leçon
  const deleteLesson = useMutation({
    mutationFn: async ({ moduleId, id }: { moduleId: number; id: number }) => {
      if (!moduleId) {
        throw new Error("moduleId est requis pour supprimer une leçon");
      }
      const res = await fetch(`/api/lessons/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
      });
      const result: ApiResponse<null> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", variables.moduleId] });
      queryClient.invalidateQueries({ queryKey: ["lesson", variables.id] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la leçon:", error);
    },
  });

  // Récupérer une leçon par ID
  const getLessonById = useQuery({
    queryKey: ["lesson", props.lessonId],
    queryFn: async () => {
      if (!props.lessonId || !props.moduleId) return null;
      const res = await fetch(`/api/lessons/${props.lessonId}`);
      const result: ApiResponse<Lesson> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      if (result.data.moduleId !== props.moduleId) {
        throw new ServiceError(
          ERROR_CODES.VALIDATION_ERROR,
          "La leçon n'appartient pas au module spécifié"
        );
      }
      return {
        ...result.data,
        content: TiptapJsonContentSchema.parse(result.data.content),
      };
    },
    enabled: !!props.lessonId && !!props.moduleId,
  });

  return {
    lessons,
    isLoading,
    error,
    createLesson: createLesson.mutateAsync,
    updateLesson: updateLesson.mutateAsync,
    deleteLesson: deleteLesson.mutateAsync,
    getLessonById: {
      ...getLessonById,
      data: getLessonById.data as Lesson | null,
    },
    refetch: () => queryClient.invalidateQueries({ queryKey: ["lessons", props.moduleId] }),
  };
}