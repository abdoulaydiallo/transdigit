"use client";

import { useCourses } from "../hooks/useCourses";
import { NewCourse, Course } from "@/lib/db/schema";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

type CourseFormProps = {
  course?: Course | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
  const { createCourse, updateCourse } = useCourses();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewCourse>({
    defaultValues: course
      ? {
          key: course.key,
          title: course.title,
          description: course.description,
          imageSrc: course.imageSrc,
          duration: course.duration,
          totalHours: course.totalHours,
          isActive: course.isActive,
        }
      : {
          key: "",
          title: "",
          description: "",
          imageSrc: "",
          duration: "",
          totalHours: 0,
          isActive: true,
        },
  });

  useEffect(() => {
    if (course) {
      reset({
        key: course.key,
        title: course.title,
        description: course.description,
        imageSrc: course.imageSrc,
        duration: course.duration,
        totalHours: course.totalHours,
        isActive: course.isActive,
      });
    } else {
      reset();
    }
  }, [course, reset]);

  const onSubmit = async (data: NewCourse) => {
    try {
      if (course) {
        await updateCourse({ id: course.id, data });
      } else {
        await createCourse(data);
      }
      onSuccess();
    } catch (error) {
      alert("Erreur lors de la sauvegarde du cours");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Clé</label>
        <input
          {...register("key", { required: "La clé est requise" })}
          className="w-full border rounded p-2"
        />
        {errors.key && <p className="text-red-500 text-sm">{errors.key.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Titre</label>
        <input
          {...register("title", { required: "Le titre est requis" })}
          className="w-full border rounded p-2"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea {...register("description")} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Image URL</label>
        <input {...register("imageSrc")} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Durée</label>
        <input {...register("duration")} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Heures totales</label>
        <input
          type="number"
          {...register("totalHours", { valueAsNumber: true })}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">
          <input type="checkbox" {...register("isActive")} />
          Actif
        </label>
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {course ? "Modifier" : "Créer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
