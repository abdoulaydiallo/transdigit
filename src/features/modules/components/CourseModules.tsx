"use client";

import { useState, useMemo, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CourseModule, NewCourseModule } from "@/lib/db/schema";
import { useModules } from "@/features/modules/hooks/useModules";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Plus,
  Loader2,
  AlertCircle,
  List,
  Clock,
  Calendar,
  Edit,
  Trash,
  BookOpen,
  Play,
  MoreVertical,
  Users,
  Target,
  ChevronRight,
  ChevronUp,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ModuleDialog } from "./ModuleDialog";
import { LessonDialog } from "@/features/lessons/components/LessonDialog";
import { Lesson } from "@/lib/validations/courseLessons";

interface CourseModulesProps {
  modules: CourseModule[];
  isLoadingModules: boolean;
  errorModules: any;
  courseId: number;
}

export function CourseModules({
  modules,
  isLoadingModules,
  errorModules,
  courseId,
}: CourseModulesProps) {
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<NewCourseModule | null>(null);
  const [deletingModuleId, setDeletingModuleId] = useState<number | null>(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const { deleteModule } = useModules({ courseId });

  const sortedModules = useMemo(() => {
    return Array.isArray(modules)
      ? [...modules].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
      : [];
  }, [modules]);

  const handleOpenModuleDialog = (module: NewCourseModule | null = null) => {
    setSelectedModule(module);
    setIsModuleDialogOpen(true);
  };

  const handleDeleteModule = async (moduleId: number, moduleTitle: string) => {
    if (confirm(`Voulez-vous vraiment supprimer le module "${moduleTitle}" ?`)) {
      try {
        setDeletingModuleId(moduleId);
        await deleteModule(moduleId);
        toast.success(`Le module "${moduleTitle}" a été supprimé avec succès.`);
      } catch (error) {
        toast.error("Erreur lors de la suppression du module");
      } finally {
        setDeletingModuleId(null);
      }
    }
  };

  const handleOpenLessonDialog = (lesson: Lesson | null, moduleId: number) => {
    setSelectedLesson(
      lesson
        ? { ...lesson, moduleId } // Mise à jour : inclut moduleId
        : { moduleId } as Lesson // Création : objet minimal avec moduleId
    );
    setIsLessonDialogOpen(true);
  };

  const toggleModuleExpansion = (moduleId: number) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Section - Amélioré pour mobile */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border border-primary/15 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
        <div className="relative p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground mb-1">
                  Modules du cours
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Organisez et gérez le contenu de votre cours de manière structurée
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 lg:flex-col lg:items-end lg:gap-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="px-3 py-1.5 font-semibold bg-background/80 backdrop-blur text-xs sm:text-sm"
                >
                  {sortedModules.length} module{sortedModules.length !== 1 ? 's' : ''}
                </Badge>
                {sortedModules.length > 0 && (
                  <Badge
                    variant="outline"
                    className="px-2 py-1 text-xs hidden sm:inline-flex bg-background/60"
                  >
                    <Target className="h-3 w-3 mr-1" />
                    Structuré
                  </Badge>
                )}
              </div>

              <Button
                size="sm"
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 h-9 sm:h-10"
                onClick={() => handleOpenModuleDialog()}
                aria-label="Ajouter un module"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Ajouter un module</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="rounded-xl sm:rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
        {isLoadingModules ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-6">
            <div className="relative mb-6">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              </div>
              <div className="absolute -inset-2 sm:-inset-3 rounded-full border-2 border-primary/20 animate-pulse"></div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-base sm:text-lg mb-2">Chargement en cours</h3>
              <p className="text-sm text-muted-foreground">Récupération des modules du cours...</p>
            </div>
          </div>
        ) : errorModules ? (
          <div className="p-4 sm:p-6">
            <Alert variant="destructive" className="border-red-200/80 bg-red-50/80 backdrop-blur">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de chargement</AlertTitle>
              <AlertDescription>
                Impossible de charger les modules du cours. Veuillez réessayer plus tard.
              </AlertDescription>
            </Alert>
          </div>
        ) : sortedModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 text-center">
            <div className="relative mb-8">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center backdrop-blur">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/70" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-background">
                <Plus className="h-4 w-4 text-primary" />
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-foreground">
                Créez votre premier module
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed">
                Commencez par structurer votre cours avec des modules organisés.
                Chaque module peut contenir des leçons, des exercices et du contenu interactif.
              </p>
            </div>

            <Button
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 font-semibold"
              onClick={() => handleOpenModuleDialog()}
              aria-label="Créer le premier module"
            >
              <Plus className="h-5 w-5" />
              Créer le premier module
            </Button>
          </div>
        ) : (
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="grid gap-3 sm:gap-4">
              {sortedModules.map((module, index) => {
                const { lessons, isLoading: isLoadingLessons, error: errorLessons, deleteLesson, updateLesson } = useLessons({ moduleId: module.id });

                const sortedLessons: any[] = useMemo(() => {
                  return Array.isArray(lessons)
                    ? [...lessons].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                    : [];
                }, [lessons]);

                const activeLessons = useMemo(() => {
                  return sortedLessons.filter((lesson) => lesson.isActive);
                }, [sortedLessons]);

                const handleDeleteLesson = async (lessonId: number, lessonTitle: string) => {
                  if (confirm(`Voulez-vous vraiment supprimer la leçon "${lessonTitle}" ?`)) {
                    try {
                      await deleteLesson({ moduleId: module.id, id: lessonId });
                      toast.success(`Leçon "${lessonTitle}" supprimée avec succès.`);
                    } catch (error) {
                      toast.error("Erreur lors de la suppression de la leçon");
                    }
                  }
                };

                const handleToggleLessonActive = async (lesson: Omit<Lesson, "createdAt" | "updatedAt">) => {
                  try {
                    await updateLesson({ moduleId: module.id, id: lesson.id, data: { ...lesson, isActive: !lesson.isActive } });
                    toast.success(`Leçon "${lesson.title}" ${!lesson.isActive ? "activée" : "désactivée"}.`);
                  } catch (error) {
                    toast.error("Erreur lors de la modification de la leçon");
                  }
                };

                return (
                  <div
                    key={module.id}
                    className="group relative overflow-hidden rounded-lg sm:rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    {/* Module Content */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary font-bold text-sm sm:text-lg flex-shrink-0 border border-primary/10">
                            {module.orderIndex || index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-3">
                              <h3 className="font-bold text-base sm:text-lg leading-tight text-foreground line-clamp-2 sm:line-clamp-1">
                                {module.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20"
                                >
                                  Module {module.orderIndex || index + 1}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-1 hidden sm:inline-flex"
                                >
                                  Actif
                                </Badge>
                              </div>
                            </div>

                            {module.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-3 leading-relaxed">
                                {module.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                              {module.duration && (
                                <div className="flex items-center gap-1.5 bg-muted/50 rounded-full px-2 py-1">
                                  <Clock className="h-3 w-3 text-primary/70" />
                                  <span className="font-medium">{module.duration}h</span>
                                </div>
                              )}
                              {module.createdAt && (
                                <div className="flex items-center gap-1.5 bg-muted/50 rounded-full px-2 py-1">
                                  <Calendar className="h-3 w-3 text-primary/70" />
                                  <span className="font-medium">
                                    {format(new Date(module.createdAt), "dd/MM/yyyy", { locale: fr })}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 bg-muted/50 rounded-full px-2 py-1">
                                <Users className="h-3 w-3 text-primary/70" />
                                <span className="font-medium">{activeLessons.length} leçon{activeLessons.length !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                            onClick={() => handleOpenModuleDialog(module)}
                            aria-label={`Modifier le module ${module.title}`}
                          >
                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-muted transition-colors"
                                disabled={deletingModuleId === module.id}
                              >
                                {deletingModuleId === module.id ? (
                                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                ) : (
                                  <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 sm:w-48">
                              <DropdownMenuItem
                                onClick={() => handleOpenModuleDialog(module)}
                                className="cursor-pointer gap-3"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Modifier le module</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {/* Add preview logic */}}
                                className="cursor-pointer gap-3"
                              >
                                <Play className="h-4 w-4" />
                                <span>Prévisualiser</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {/* Add duplicate logic */}}
                                className="cursor-pointer gap-3"
                              >
                                <List className="h-4 w-4" />
                                <span>Dupliquer</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteModule(module.id, module.title)}
                                className="cursor-pointer text-destructive focus:text-destructive gap-3"
                              >
                                <Trash className="h-4 w-4" />
                                <span>Supprimer</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                            onClick={() => toggleModuleExpansion(module.id)}
                            aria-label={expandedModuleId === module.id ? "Réduire le module" : "Étendre le module"}
                          >
                            {expandedModuleId === module.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Lessons Section */}
                    {expandedModuleId === module.id && (
                      <div className="border-t border-border/50 bg-muted/20 p-4 sm:p-6">
                        {isLoadingLessons ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : errorLessons ? (
                          <Alert variant="destructive" className="border-red-200/80 bg-red-50/80 backdrop-blur">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erreur de chargement</AlertTitle>
                            <AlertDescription>
                              Impossible de charger les leçons du module. Veuillez réessayer.
                            </AlertDescription>
                          </Alert>
                        ) : sortedLessons.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="rounded-full bg-muted/50 p-4 mb-4">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h4 className="font-semibold mb-2">Aucune leçon créée</h4>
                            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                              Commencez par créer votre première leçon pour ce module.
                            </p>
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() => handleOpenLessonDialog(null, module.id)}
                            >
                              <Plus className="h-4 w-4" />
                              Créer une leçon
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <h4 className="text-sm font-semibold text-foreground">Leçons ({activeLessons.length} active{activeLessons.length !== 1 ? 's' : ''})</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => handleOpenLessonDialog(null, module.id)}
                              >
                                <Plus className="h-4 w-4" />
                                Nouvelle leçon
                              </Button>
                            </div>
                            <div className="space-y-3">
                              {sortedLessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson.id}
                                  className="group relative rounded-lg border border-border/30 bg-card/80 p-3 sm:p-4 hover:bg-card hover:border-primary/20 transition-all duration-200"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                                      {lessonIndex + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h5 className="font-semibold text-sm truncate">{lesson.title}</h5>
                                        <Badge variant="outline" className="text-xs">
                                          {lesson.type}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {lesson.difficulty}
                                        </Badge>
                                        {lesson.isActive && (
                                          <Badge variant="default" className="text-xs">
                                            <Eye className="h-3 w-3 mr-1" />
                                            Actif
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {lesson.estimatedTime && (
                                          <span>Temps estimé: {lesson.estimatedTime} min | </span>
                                        )}
                                        Créé le {format(new Date(lesson.createdAt), "dd/MM/yyyy", { locale: fr })}
                                      </div>
                                      {lesson.tags! && Array.isArray(lesson.tags) && lesson.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {lesson.tags.map((tag: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleOpenLessonDialog(lesson, module.id)}
                                      >
                                        <Edit className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                      >
                                        <Trash className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleToggleLessonActive(lesson)}
                                      >
                                        {lesson.isActive ? (
                                          <EyeOff className="h-3.5 w-3.5" />
                                        ) : (
                                          <Eye className="h-3.5 w-3.5" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-muted/30 to-muted/10">
                      <div className="h-full bg-gradient-to-r from-primary to-primary/80 w-0 group-hover:w-full transition-all duration-700 ease-out shadow-sm"></div>
                    </div>
                    <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>

            {sortedModules.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <button
                  onClick={() => handleOpenModuleDialog()}
                  className="w-full p-6 sm:p-8 rounded-lg sm:rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/20 hover:bg-muted/40 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Plus className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-foreground mb-1">
                        Ajouter un nouveau module
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Continuez à enrichir votre cours avec du contenu structuré
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <ModuleDialog
          isOpen={isModuleDialogOpen}
          onOpenChange={(open) => {
            setIsModuleDialogOpen(open);
            if (!open) setSelectedModule(null);
          }}
          module={selectedModule}
          courseId={courseId}
        />

        <LessonDialog
          isOpen={isLessonDialogOpen}
          onOpenChange={(open) => {
            setIsLessonDialogOpen(open);
            if (!open) setSelectedLesson(null);
          }}
          lesson={selectedLesson}
          moduleId={selectedLesson?.moduleId || null}
        />
        
    </div>
    </div>
  );
}