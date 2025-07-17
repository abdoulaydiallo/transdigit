import { CourseList } from "@/features/components/CourseList";

export default async function CoursesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestion des Cours</h1>
      <CourseList />
    </div>
  );
}
