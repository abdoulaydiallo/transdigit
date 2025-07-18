"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseSection } from "@/lib/db/schema";
import { ServiceError, ErrorCode, ERROR_CODES } from "@/services/services.errors";
import { NewCourseSectionSchema, UpdateCourseSectionSchema } from "@/lib/validations/courseSections";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

type UseCourseSectionsProps = {
  courseId?: number;
  sectionId?: number;
};

export function useCourseSections(props: UseCourseSectionsProps = {}) {
  const queryClient = useQueryClient();

  // Fetch all sections for a course
  const { data: sections, isLoading, error } = useQuery({
    queryKey: ["sections", props.courseId],
    queryFn: async () => {
      if (!props.courseId) return [];
      const res = await fetch(`/api/courses/${props.courseId}/sections`);
      const result: ApiResponse<CourseSection[]> = await res.json();
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

  // Create a section
  const createSection = useMutation({
    mutationFn: async ({ courseId, data }: { courseId: number; data: Omit<CourseSection, "id" | "createdAt" | "updatedAt"> }) => {
      if (!courseId) {
        throw new Error("courseId est requis pour créer une section");
      }
      const sectionData = {
        courseId,
        tabKey: data.tabKey,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        items: data.items,
        children: data.children,
      };
      const validatedData = NewCourseSectionSchema.parse(sectionData);
      const res = await fetch(`/api/courses/${courseId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });
      const result: ApiResponse<CourseSection> = await res.json();
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
      queryClient.invalidateQueries({ queryKey: ["sections", variables.courseId] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la section :", error);
    },
  });

  // Update a section
  const updateSection = useMutation({
    mutationFn: async ({ courseId, id, data }: { courseId: number; id: number; data: Partial<Omit<CourseSection, "id" | "createdAt" | "updatedAt">> }) => {
      if (!courseId) {
        throw new Error("courseId est requis pour mettre à jour une section");
      }
      const validatedData = UpdateCourseSectionSchema.parse(data);
      const res = await fetch(`/api/sections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validatedData, courseId }),
      });
      const result: ApiResponse<CourseSection> = await res.json();
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
      queryClient.invalidateQueries({ queryKey: ["sections", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["section", variables.id] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de la section :", error);
    },
  });

  // Delete a section
  const deleteSection = useMutation({
    mutationFn: async ({ courseId, id }: { courseId: number; id: number }) => {
      if (!courseId) {
        throw new Error("courseId est requis pour supprimer une section");
      }
      const res = await fetch(`/api/sections/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["sections", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["section", variables.id] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la section :", error);
    },
  });

  // Fetch a single section by ID
  const getSectionById = useQuery({
    queryKey: ["section", props.sectionId],
    queryFn: async () => {
      if (!props.sectionId || !props.courseId) return null;
      const res = await fetch(`/api/sections/${props.sectionId}`);
      const result: ApiResponse<CourseSection> = await res.json();
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
          "La section n'appartient pas au cours spécifié"
        );
      }
      return result.data;
    },
    enabled: !!props.sectionId && !!props.courseId,
  });

  return {
    sections,
    isLoading,
    error,
    createSection: createSection.mutateAsync,
    updateSection: updateSection.mutateAsync,
    deleteSection: deleteSection.mutateAsync,
    getSectionById: {
      ...getSectionById,
      data: getSectionById.data as CourseSection | null,
    },
    refetch: () => queryClient.invalidateQueries({ queryKey: ["sections", props.courseId] }),
  };
}