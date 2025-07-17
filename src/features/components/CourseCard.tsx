"use client";

import { Course } from "@/lib/db/schema";
import { useCourses } from "../hooks/useCourses";

type CourseCardProps = {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
};

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const { deleteCourse } = useCourses();

  const handleDelete = async () => {
    if (confirm(`Voulez-vous vraiment supprimer le cours "${course.title}" ?`)) {
      try {
        await deleteCourse(course.id);
        onDelete();
      } catch (error) {
        alert("Erreur lors de la suppression du cours");
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img
        src={course.imageSrc || "/placeholder.jpg"}
        alt={course.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold">{course.title}</h2>
      <p className="text-gray-600">{course.description}</p>
      <p className="text-sm text-gray-500">Durée: {course.duration}</p>
      <p className="text-sm text-gray-500">Heures: {course.totalHours}</p>
      <p className="text-sm text-gray-500">
        Statut: {course.isActive ? "Actif" : "Inactif"}
      </p>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Modifier
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
