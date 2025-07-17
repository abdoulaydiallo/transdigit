"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NewCourse, Course } from "@/lib/db/schema";
import { CourseFilters } from "@/services/courses.service";
import { ServiceError, ErrorCode } from "@/services/services.errors";
import { z } from "zod";

// Schéma Zod pour la création d'un cours, aligné avec NewCourse
const NewCourseSchema = z.object({
  key: z.string().min(1, "La clé est requise").max(100, "La clé ne doit pas dépasser 100 caractères").regex(/^[a-z0-9-]+$/, "La clé doit être alphanumérique avec des tirets"),
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères"),
  description: z.string().optional().or(z.literal("")),
  imageSrc: z.string().max(500, "L'URL de l'image ne doit pas dépasser 500 caractères").optional().or(z.literal("")),
  duration: z.string().max(50, "La durée ne doit pas dépasser 50 caractères").optional().or(z.literal("")),
  totalHours: z.number().int().positive("Le nombre d'heures doit être positif").optional().or(z.literal(null)),
  isActive: z.boolean().default(true),
});

// Schéma Zod pour la mise à jour d'un cours, aligné avec Partial<NewCourse>
const UpdateCourseSchema = z.object({
  key: z.string().min(1, "La clé est requise").max(100, "La clé ne doit pas dépasser 100 caractères").regex(/^[a-z0-9-]+$/, "La clé doit être alphanumérique avec des tirets").optional(),
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre ne doit pas dépasser 255 caractères").optional(),
  description: z.string().optional().or(z.literal("")),
  imageSrc: z.string().max(500, "L'URL de l'image ne doit pas dépasser 500 caractères").optional().or(z.literal("")),
  duration: z.string().max(50, "La durée ne doit pas dépasser 50 caractères").optional().or(z.literal("")),
  totalHours: z.number().int().positive("Le nombre d'heures doit être positif").optional().or(z.literal(null)),
  isActive: z.boolean().optional(),
}).strict();

// Type de réponse API
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

type UseCoursesProps = {
  page?: number;
  per_page?: number;
  filters?: CourseFilters;
  courseId?: number;
};

export function useCourses(props: UseCoursesProps = {}) {
  const queryClient = useQueryClient();

  // Fetch all courses
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["courses", props.page, props.per_page, props.filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (props.page) params.set("page", props.page.toString());
      if (props.per_page) params.set("per_page", props.per_page.toString());
      if (props.filters?.isActive !== undefined) params.set("isActive", props.filters.isActive.toString());
      if (props.filters?.title) params.set("title", props.filters.title);

      const res = await fetch(`/api/courses?${params.toString()}`);
      const result: ApiResponse<{ courses: Course[]; total: number }> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      return result.data;
    },
  });

  // Create a course
  const createCourse = useMutation({
    mutationFn: async (data: NewCourse) => {
      const validatedData = NewCourseSchema.parse(data);
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });
      const result: ApiResponse<Course> = await res.json();
      if (!result.success) {
        throw new ServiceError(
          result.error.code as ErrorCode,
          result.error.message,
          result.error.cause ? new Error(result.error.cause.message) : undefined
        );
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  // Update a course
  const updateCourse = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<NewCourse> }) => {
      const validatedData = UpdateCourseSchema.parse(data);
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });
      const result: ApiResponse<Course> = await res.json();
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
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
    },
  });

  // Delete a course
  const deleteCourse = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/courses/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", id] });
    },
  });

  // Fetch a single course by ID
  const getCourseById = useQuery({
    queryKey: ["course", props.courseId],
    queryFn: async () => {
      if (!props.courseId) return null;
      const res = await fetch(`/api/courses/${props.courseId}`);
      const result: ApiResponse<Course> = await res.json();
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

  return {
    courses,
    isLoading,
    error,
    createCourse: createCourse.mutateAsync,
    updateCourse: updateCourse.mutateAsync,
    deleteCourse: deleteCourse.mutateAsync,
    getCourseById: {
      ...getCourseById,
      data: getCourseById.data as Course | null,
    },
    refetch: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  };
}
