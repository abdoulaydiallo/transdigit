"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseModule } from "@/lib/db/schema";
import { ServiceError, ErrorCode } from "@/services/services.errors";
import { NewCourseModuleSchema, UpdateCourseModuleSchema } from "@/lib/zodSchemas";

// Type de réponse API
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

type UseModulesProps = {
  courseId?: number;
  moduleId?: number;
};

export function useModules(props: UseModulesProps = {}) {
  const queryClient = useQueryClient();

  // Fetch all modules for a course
  const { data: modules, isLoading, error } = useQuery({
    queryKey: ["modules", props.courseId],
    queryFn: async () => {
      if (!props.courseId) return [];
      const res = await fetch(`/api/courses/${props.courseId}/modules`);
      const result: ApiResponse<CourseModule[]> = await res.json();
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

  // Create a module
  const createModule = useMutation({
    mutationFn: async ({ courseId, data }: { courseId: number; data: Omit<CourseModule, "id" | "createdAt" | "updatedAt"> }) => {
      if (!courseId) {
        throw new Error("courseId est requis pour créer un module");
      }
      const moduleData = {
        courseId,
        title: data.title,
        number: Number(data.number),
        orderIndex: data.orderIndex,
        description: data.description ?? undefined,
        duration: data.duration ?? undefined, // Conserver comme chaîne
      };
      console.log("Création du module avec :", { courseId, moduleData });
      const validatedData = NewCourseModuleSchema.parse(moduleData);
      const res = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
    });
    const responseBody = await res.text();
    console.log("Statut de la réponse :", res.status, "Corps de la réponse :", responseBody);
    const result: ApiResponse<CourseModule> = JSON.parse(responseBody);
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
    queryClient.invalidateQueries({ queryKey: ["modules", variables.courseId] });
  },
  onError: (error) => {
    console.error("Erreur lors de la création du module :", error);
  },
});

  // Update a module
  const updateModule = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<CourseModule, "id" | "createdAt" | "updatedAt">> }) => {
      const validatedData = UpdateCourseModuleSchema.parse(data);
      const res = await fetch(`/api/modules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });
      const result: ApiResponse<CourseModule> = await res.json();
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
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["module", variables.id] });
    },
  });

  // Delete a module
  const deleteModule = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/modules/${id}`, {
        method: "DELETE",
      });
      const result: ApiResponse<{}> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      return result.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["module", id] });
    },
  });

  // Fetch a single module by ID
  const getModuleById = useQuery({
    queryKey: ["module", props.moduleId],
    queryFn: async () => {
      if (!props.moduleId) return null;
      const res = await fetch(`/api/modules/${props.moduleId}`);
      const result: ApiResponse<CourseModule> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      return result.data;
    },
    enabled: !!props.moduleId,
  });

  return {
    modules,
    isLoading,
    error,
    createModule: createModule.mutateAsync,
    updateModule: updateModule.mutateAsync,
    deleteModule: deleteModule.mutateAsync,
    getModuleById: {
      ...getModuleById,
      data: getModuleById.data as CourseModule | null,
    },
    refetch: () => queryClient.invalidateQueries({ queryKey: ["modules", props.courseId] }),
  };
}
