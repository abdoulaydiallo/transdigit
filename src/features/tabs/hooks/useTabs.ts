"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseTab } from "@/lib/db/schema";
import { ServiceError, ErrorCode, ERROR_CODES } from "@/services/services.errors";
import { NewCourseTabSchema, UpdateCourseTabSchema } from "@/lib/validations/courseTabs";

// Type de réponse API
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

type UseCourseTabsProps = {
  courseId?: number;
  tabId?: number;
};

export function useCourseTabs(props: UseCourseTabsProps = {}) {
  const queryClient = useQueryClient();

  // Fetch all tabs for a course
  const { data: tabs, isLoading, error } = useQuery({
    queryKey: ["tabs", props.courseId],
    queryFn: async () => {
      if (!props.courseId) return [];
      const res = await fetch(`/api/courses/${props.courseId}/tabs`);
      const result: ApiResponse<CourseTab[]> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      return result.data;
    },
    enabled: !!props.courseId,
  });

  // Create a tab
  const createTab = useMutation({
    mutationFn: async ({ courseId, data }: { courseId: number; data: Omit<CourseTab, "id" | "createdAt"> }) => {
      if (!courseId) {
        throw new Error("courseId est requis pour créer un onglet");
      }
      const tabData = {
        courseId,
        key: data.key,
        title: data.title,
        isActive: data.isActive ?? false,
        orderIndex: data.orderIndex,
      };
      console.log("Création de l'onglet avec :", { courseId, tabData });
      const validatedData = NewCourseTabSchema.parse(tabData);
      const res = await fetch(`/api/courses/${courseId}/tabs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });
      const responseBody = await res.text();
      console.log("Statut de la réponse :", res.status, "Corps de la réponse :", responseBody);
      const result: ApiResponse<CourseTab> = JSON.parse(responseBody);
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
      queryClient.invalidateQueries({ queryKey: ["tabs", variables.courseId] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de l'onglet :", error);
    },
  });

  // Update a tab
  const updateTab = useMutation({
    mutationFn: async ({ courseId, id, data }: { courseId: number; id: number; data: Partial<Omit<CourseTab, "id" | "createdAt">> }) => {
      if (!courseId) {
        throw new Error("courseId est requis pour mettre à jour un onglet");
      }
      const validatedData = UpdateCourseTabSchema.parse(data);
      const res = await fetch(`/api/tabs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validatedData, courseId }),
      });
      const result: ApiResponse<CourseTab> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tabs", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["tab", variables.id] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de l'onglet :", error);
    },
  });

  // Delete a tab
  const deleteTab = useMutation({
    mutationFn: async ({ courseId, id }: { courseId: number; id: number }) => {
      if (!courseId) {
        throw new Error("courseId est requis pour supprimer un onglet");
      }
      const res = await fetch(`/api/tabs/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
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
      queryClient.invalidateQueries({ queryKey: ["tabs", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["tab", variables.id] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de l'onglet :", error);
    },
  });

  // Fetch a single tab by ID
  const getTabById = useQuery({
    queryKey: ["tab", props.tabId],
    queryFn: async () => {
      if (!props.tabId || !props.courseId) return null;
      const res = await fetch(`/api/tabs/${props.tabId}`);
      const result: ApiResponse<CourseTab> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      if (result.data.courseId !== props.courseId) {
        throw new ServiceError(
          ERROR_CODES.VALIDATION_ERROR,
          "L'onglet n'appartient pas au cours spécifié"
        );
      }
      return result.data;
    },
    enabled: !!props.tabId && !!props.courseId,
  });

  return {
    tabs,
    isLoading,
    error,
    createTab: createTab.mutateAsync,
    updateTab: updateTab.mutateAsync,
    deleteTab: deleteTab.mutateAsync,
    getTabById: {
      ...getTabById,
      data: getTabById.data as CourseTab | null,
    },
    refetch: () => queryClient.invalidateQueries({ queryKey: ["tabs", props.courseId] }),
  };
}
