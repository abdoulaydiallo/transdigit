"use client";

import { useCourses } from "../hooks/useCourses";
import { Course } from "@/lib/db/schema";
import { useState } from "react";
import { CourseForm } from "./CourseForm";
import { CourseCard } from "./CourseCard";

export function CourseList() {
  const { courses, isLoading, error, refetch } = useCourses({
    page: 1,
    per_page: 10,
  });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div className="space-y-6">
      <CourseForm
        course={editingCourse}
        onSuccess={() => {
          setEditingCourse(null);
          refetch();
        }}
        onCancel={() => setEditingCourse(null)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses?.courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={() => setEditingCourse(course)}
            onDelete={() => refetch()}
          />
        ))}
      </div>
    </div>
  );
}
