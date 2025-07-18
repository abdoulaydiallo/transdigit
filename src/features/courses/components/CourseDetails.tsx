"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Loader2,
  Edit,
  Trash,
  ArrowLeft,
  Clock,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  GraduationCap,
  List,
  Plus,
} from "lucide-react";
import { NewCourse, Course, CourseModule } from "@/lib/db/schema";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { useModules } from "@/features/modules/hooks/useModules";
import { useCourseTabs } from "@/features/tabs/hooks/useTabs";
import { CourseTabs } from "@/features/tabs/components/CourseTabs";
import { CourseForm } from "./CourseForm";
import { CourseModules } from "@/features/modules/components/CourseModules";
import Image from "next/image";

// Interfaces pour typage
interface CourseDetailsProps {
  courseId: number;
}

// Sous-composant : En-tête du cours
function CourseHeader({
  course,
  imageError,
  setImageError,
}: {
  course: Course;
  imageError: boolean;
  setImageError: (value: boolean) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative h-64 bg-gradient-to-r from-primary to-primary/80">
        {course.imageSrc && !imageError ? (
          <>
            <Image
              src={course.imageSrc}
              alt={course.title}
              fill
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary-foreground opacity-80" />
          </div>
        )}
        <div className="absolute bottom-6 left-6 text-primary-foreground">
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg">{course.title}</h1>
          <p className="text-lg opacity-90 drop-shadow-md">{course.key}</p>
        </div>
      </div>
    </div>
  );
}

// Sous-composant : Grille des statistiques
function CourseStats({ course }: { course: Course }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Durée</p>
            <p className="text-lg font-semibold">{course.duration || "Non spécifiée"}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Heures totales</p>
            <p className="text-lg font-semibold">
              {course.totalHours ? `${course.totalHours}h` : "Non spécifié"}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Créé le</p>
            <p className="text-lg font-semibold">
              {course.createdAt
                ? format(new Date(course.createdAt), "dd/MM/yyyy", { locale: fr })
                : "Non spécifié"}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Mis à jour</p>
            <p className="text-lg font-semibold">
              {course.updatedAt
                ? format(new Date(course.updatedAt), "dd/MM/yyyy", { locale: fr })
                : "Non spécifié"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sous-composant : Description du cours
function CourseDescription({ course }: { course: Course }) {
  return (
    <div className="rounded-lg border bg-card p-8">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">Description du cours</h2>
      <p className="text-muted-foreground leading-relaxed">
        {course.description || "Aucune description disponible pour ce cours."}
      </p>
    </div>
  );
}

// Sous-composant : Navigation
function CourseNavigation({
  course,
  onEdit,
  onDelete,
}: {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/courses")}
              className="gap-2"
              aria-label="Retour à la liste des cours"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux cours
            </Button>
            <div className="h-4 w-px bg-border" />
            <Badge variant={course.isActive ? "default" : "secondary"} className="gap-1">
              {course.isActive ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {course.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="gap-2"
              aria-label="Modifier le cours"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
            <Button
              onClick={onDelete}
              variant="destructive"
              size="sm"
              className="gap-2"
              aria-label="Supprimer le cours"
            >
              <Trash className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal
export default function CourseDetails({ courseId }: CourseDetailsProps) {
  const router = useRouter();
  const { getCourseById, updateCourse, deleteCourse, isLoading, error } = useCourses({ courseId });
  const { modules, getModuleById, isLoading: isLoadingModules, error: errorModules } = useModules({
    courseId,
  });
  const { tabs, isLoading: isLoadingTabs, error: errorTabs } = useCourseTabs({ courseId });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<NewCourse>>({});
  const [imageError, setImageError] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string | undefined>(undefined);

  const course = getCourseById.data as Course | null;

  // Reset image error when course changes
  useEffect(() => {
    setImageError(false);
  }, [course?.imageSrc]);

  // Set the first active tab as default when tabs are loaded
  useEffect(() => {
    if (tabs && tabs.length > 0 && !activeTabKey) {
      const firstActiveTab = tabs.find((tab) => tab.isActive);
      setActiveTabKey(firstActiveTab?.key);
    }
  }, [tabs, activeTabKey]);

  const handleEditToggle = () => {
    if (!course) return;
    setIsEditing(true);
    setFormData({
      key: course.key,
      title: course.title,
      description: course.description || undefined,
      imageSrc: course.imageSrc || undefined,
      duration: course.duration || undefined,
      totalHours: course.totalHours || undefined,
      isActive: course.isActive,
    });
  };

  const handleSave = async () => {
    try {
      await updateCourse({ id: courseId, data: formData });
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
    }
  };

  const handleDelete = async () => {
    if (confirm("Voulez-vous vraiment supprimer ce cours ?")) {
      try {
        await deleteCourse(courseId);
        router.push("/courses");
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
      }
    }
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTabKey(tabKey);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto mt-8 max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!course) {
    return (
      <Alert className="mx-auto mt-8 max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Cours non trouvé</AlertTitle>
        <AlertDescription>Le cours avec l'ID {courseId} n'existe pas.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CourseNavigation course={course} onEdit={handleEditToggle} onDelete={handleDelete} />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <CourseHeader course={course} imageError={imageError} setImageError={setImageError} />
          <CourseStats course={course} />
          <CourseDescription course={course} />
          <CourseTabs
            courseId={courseId}
            activeTabKey={activeTabKey}
            onTabChange={handleTabChange}
          />
          <CourseModules
            courseId={courseId}
            modules={modules as CourseModule[]}
            isLoadingModules={isLoadingModules}
            errorModules={errorModules}
          />
        </div>
      </div>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le cours</DialogTitle>
          </DialogHeader>
          <CourseForm
            course={course}
            onSuccess={() => {
              setIsEditing(false);
              handleSave();
            }}
            onCancel={() => {
              setIsEditing(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
