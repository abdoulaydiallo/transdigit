"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Lesson } from "@/lib/db/schema";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Plus,
  Loader2,
  AlertCircle,
  Settings,
  Calendar,
  Edit,
  Trash,
  Eye,
  EyeOff,
  GripVertical,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LessonForm } from "./LessonForm";
import { toast } from "sonner";
import { useLessons } from "../hooks/useLessons";

interface CourseLessonsProps {
  moduleId: number;
  activeLessonId?: number;
  onLessonChange?: (lessonId: number) => void;
}

export function CourseLessons({ moduleId, activeLessonId, onLessonChange }: CourseLessonsProps) {
  const { lessons, isLoading, error, deleteLesson, updateLesson } = useLessons({ moduleId });
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isManageModeOpen, setIsManageModeOpen] = useState(false);

  const sortedLessons = useMemo(() => {
    return Array.isArray(lessons)
      ? [...lessons].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
      : [];
  }, [lessons]);

  const activeLessons = useMemo(() => {
    return sortedLessons.filter((lesson) => lesson.isActive);
  }, [sortedLessons]);

  const handleOpenLessonDialog = (lesson: Lesson | null = null) => {
    setSelectedLesson(lesson);
    setIsLessonDialogOpen(true);
  };

  const handleDeleteLesson = async (lessonId: number, lessonTitle: string) => {
    if (confirm(`Voulez-vous vraiment supprimer la leçon "${lessonTitle}" ?`)) {
      try {
        await deleteLesson({ moduleId, id: lessonId });
        toast.success(`Leçon "${lessonTitle}" supprimée avec succès.`);
      } catch {
        toast.error("Erreur lors de la suppression de la leçon");
      }
    }
  };

  const handleToggleActive = async (lesson: Lesson | any) => {
    try {
      await updateLesson({ moduleId, id: lesson.id, data: { ...lesson, isActive: !lesson.isActive } });
      toast.success(`Leçon "${lesson.title}" ${!lesson.isActive ? "activée" : "désactivée"}.`);
    } catch {
      toast.error("Erreur lors de la modification de la leçon");
    }
  };

  const LessonCard = ({ lesson, index }: { lesson: Lesson | any; index: number }) => (
    <div
      className={`group relative rounded-xl border transition-all duration-200 hover:shadow-md ${
        lesson.isActive 
          ? "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-sm" 
          : "bg-card hover:bg-accent/30"
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground cursor-move transition-colors" />
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                lesson.isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {index + 1}
              </div>
            </div>
            
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-base truncate">{lesson.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {lesson.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {lesson.difficulty}
                </Badge>
                {lesson.isActive && (
                  <Badge variant="default" className="text-xs shrink-0">
                    <Eye className="h-3 w-3 mr-1" />
                    Actif
                  </Badge>
                )}
              </div>
              
              {lesson.createdAt && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Créé le {format(new Date(lesson.createdAt), "dd MMMM yyyy", { locale: fr })}</span>
                </div>
              )}
              
              {lesson.estimatedTime && (
                <div className="text-xs text-muted-foreground">
                  Temps estimé: {lesson.estimatedTime} minutes
                </div>
              )}
              
              {lesson.tags! && Array.isArray(lesson.tags)  && lesson.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <Switch
                checked={lesson.isActive!}
                onCheckedChange={() => handleToggleActive(lesson)}
                aria-label={`${lesson.isActive ? "Désactiver" : "Activer"} la leçon ${lesson.title}`}
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {lesson.isActive ? "Visible" : "Masqué"}
              </span>
            </div>

            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleToggleActive(lesson)}>
                    {lesson.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Masquer la leçon
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Afficher la leçon
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenLessonDialog(lesson)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleOpenLessonDialog(lesson)}
                aria-label={`Modifier la leçon ${lesson.title}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                aria-label={`Supprimer la leçon ${lesson.title}`}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Leçons du module</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {activeLessons.length} actif{activeLessons.length !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {sortedLessons.length} total
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 transition-all hover:scale-105"
              onClick={() => setIsManageModeOpen(!isManageModeOpen)}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Gérer</span>
              {isManageModeOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              className="gap-2 transition-all hover:scale-105"
              onClick={() => handleOpenLessonDialog()}
              aria-label="Ajouter une leçon"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Chargement des leçons...</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de chargement</AlertTitle>
              <AlertDescription>
                Impossible de charger les leçons du module. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          ) : activeLessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted/50 p-6 mb-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucune leçon active</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Ce module ne contient pas encore de leçons actives. Créez votre première leçon pour commencer.
              </p>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => handleOpenLessonDialog()}
                aria-label="Créer la première leçon"
              >
                <Plus className="h-5 w-5" />
                Créer la première leçon
              </Button>
            </div>
          ) : (
            <Tabs value={activeLessonId?.toString()} onValueChange={(id) => onLessonChange?.(Number(id))} className="w-full">
              <ScrollArea className="w-full">
                <TabsList className={`inline-flex h-12 items-center justify-start rounded-lg bg-muted p-1 gap-1 ${
                  activeLessons.length > 4 ? 'w-max' : 'w-full grid'
                }`} style={{
                  gridTemplateColumns: activeLessons.length <= 4 ? `repeat(${activeLessons.length}, 1fr)` : undefined
                }}>
                  {activeLessons.map((lesson) => (
                    <TabsTrigger 
                      key={lesson.id} 
                      value={lesson.id.toString()} 
                      className="flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <span className="truncate max-w-32 sm:max-w-none">{lesson.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </Tabs>
          )}
        </div>
      </div>

      {isManageModeOpen && (
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Gestion des leçons</h3>
                <p className="text-sm text-muted-foreground">
                  Organisez, modifiez et gérez la visibilité de vos leçons
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsManageModeOpen(false)}
              className="self-start sm:self-auto"
            >
              Fermer
            </Button>
          </div>

          <div className="p-4 sm:p-6">
            {sortedLessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted/50 p-4 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold mb-2">Aucune leçon créée</h4>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Commencez par créer votre première leçon pour structurer votre module.
                </p>
                <Button size="default" className="gap-2" onClick={() => handleOpenLessonDialog()}>
                  <Plus className="h-4 w-4" />
                  Créer une leçon
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Glissez-déposez les leçons pour les réorganiser
                  </p>
                  <Button size="sm" variant="outline" className="gap-2 self-start sm:self-auto">
                    <Plus className="h-4 w-4" />
                    Nouvelle leçon
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {sortedLessons.map((lesson, index) => (
                    <LessonCard key={lesson.id} lesson={lesson} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedLesson ? "Modifier la leçon" : "Créer une nouvelle leçon"}
            </DialogTitle>
          </DialogHeader>
          <LessonForm
            lesson={selectedLesson}
            moduleId={moduleId}
            onSuccess={() => {
              setIsLessonDialogOpen(false);
              setSelectedLesson(null);
            }}
            onCancel={() => {
              setIsLessonDialogOpen(false);
              setSelectedLesson(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}