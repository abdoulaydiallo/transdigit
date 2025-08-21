"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  AlertTriangle
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { NewCourse, Course, CourseModule } from "@/lib/db/schema";

import { useCourseTabs } from "@/features/tabs/hooks/useTabs";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { useModules } from "@/features/modules/hooks/useModules";

import { CourseForm } from "./CourseForm";
import { CourseManager } from "./CourseManager";
import { CourseModules } from "@/features/modules/components/CourseModules";
import { DropdownMenu,
   DropdownMenuContent, 
   DropdownMenuItem, 
   DropdownMenuTrigger, 
   DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";

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
              priority
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
            <p className="text-base font-semibold">{course.duration || "Non spécifiée"}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Heures totales</p>
            <p className="text-base font-semibold">
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
            <p className="text-base font-semibold">
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
            <p className="text-base font-semibold">
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      {/* Navigation principale */}
      <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/80 dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Section gauche */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/courses")}
                className="group gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                aria-label="Retour à la liste des cours"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Retour aux cours</span>
                <span className="sm:hidden">Retour</span>
              </Button>
              
              <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
              
              <div className="flex items-center gap-3">
                <Badge 
                  variant={course.isActive ? "default" : "secondary"} 
                  className={`gap-1.5 font-medium transition-all ${
                    course.isActive 
                      ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-150 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" 
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-150 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
                  }`}
                >
                  {course.isActive ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {course.isActive ? "Actif" : "Inactif"}
                </Badge>

                {/* Titre du cours (visible sur desktop) */}
                <div className="hidden lg:block">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate max-w-md">
                    {course.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Section droite */}
            <div className="flex items-center gap-2">
              {/* Actions rapides (visible sur tablet+) */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  onClick={onEdit}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-200 text-blue-700 cursor-pointer transition-colors"
                  aria-label="Modifier le cours"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
                
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-red-200 text-red-700 "
                  aria-label="Supprimer le cours"
                >
                  <Trash className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>

              {/* Menu mobile */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Ouvrir le menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={onEdit} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Modifier le cours
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="gap-2 text-red-600 focus:text-red-600 dark:text-red-400"
                    >
                      <Trash className="h-4 w-4" />
                      Supprimer le cours
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Titre mobile */}
        <div className="lg:hidden border-t bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="py-3">
              <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {course.title}
              </h1>
              {course.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                  {course.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Supprimer le cours
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir supprimer le cours <strong>{course.title}</strong> ? 
              Cette action est irréversible et supprimera toutes les données associées.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer définitivement
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Composant principal
export default function CourseDetails({ courseId }: CourseDetailsProps) {
  const router = useRouter();
  const { getCourseById, updateCourse, deleteCourse, isLoading, error } = useCourses({ courseId });
  const { modules, isLoading: isLoadingModules, error: errorModules } = useModules({
    courseId,
  });
  const { tabs } = useCourseTabs({ courseId });
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


  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
        <AlertDescription>Le cours avec l&apos;ID {courseId} n&apos;existe pas.</AlertDescription>
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
          <CourseManager courseId={courseId} />
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