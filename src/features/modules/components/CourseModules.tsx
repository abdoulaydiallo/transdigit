"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CourseModule, NewCourseModule } from "@/lib/db/schema";
import { useModules } from "@/features/modules/hooks/useModules";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  MoreVertical
} from "lucide-react";
import { ModuleForm } from "./ModuleForm";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

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
  courseId 
}: CourseModulesProps) {
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<NewCourseModule | null>(null);
  const [deletingModuleId, setDeletingModuleId] = useState<number | null>(null);
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

  console.log("Modules chargés :", sortedModules);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent rounded-xl border border-primary/10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Modules du cours
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Organisez et gérez le contenu de votre cours
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 font-medium">
            {sortedModules.length} module{sortedModules.length !== 1 ? 's' : ''}
          </Badge>
          <Button 
            size="sm" 
            className="gap-2 shadow-sm hover:shadow-md transition-all duration-200" 
            onClick={() => handleOpenModuleDialog()}
            aria-label="Ajouter un module"
          >
            <Plus className="h-4 w-4" />
            Ajouter un module
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="rounded-xl border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        {isLoadingModules ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
              <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-pulse"></div>
            </div>
            <span className="mt-4 text-muted-foreground font-medium">Chargement des modules...</span>
          </div>
        ) : errorModules ? (
          <div className="p-6">
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de chargement</AlertTitle>
              <AlertDescription>
                Impossible de charger les modules du cours. Veuillez réessayer plus tard.
              </AlertDescription>
            </Alert>
          </div>
        ) : sortedModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-3 w-3 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun module pour le moment</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Commencez par créer votre premier module pour structurer le contenu de votre cours.
            </p>
            <Button 
              size="default" 
              className="gap-2 shadow-sm hover:shadow-md transition-all duration-200" 
              onClick={() => handleOpenModuleDialog()}
              aria-label="Créer le premier module"
            >
              <Plus className="h-4 w-4" />
              Créer le premier module
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-4">
              {sortedModules.map((module, index) => (
                <div
                  key={module.id}
                  className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:bg-accent/30 transition-all duration-200 hover:shadow-md hover:border-primary/20"
                >
                  {/* Module Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Module Number */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg flex-shrink-0">
                        {module.number || index + 1}
                      </div>
                      
                      {/* Module Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg leading-tight truncate">
                            {module.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            Module {module.number || index + 1}
                          </Badge>
                        </div>
                        
                        {module.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {module.description}
                          </p>
                        )}
                        
                        {/* Module Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {module.duration && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              <span>{module.duration}</span>
                            </div>
                          )}
                          {module.createdAt && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(module.createdAt), "dd/MM/yyyy", { locale: fr })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleOpenModuleDialog(module)}
                        aria-label={`Modifier le module ${module.title}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                            disabled={deletingModuleId === module.id}
                          >
                            {deletingModuleId === module.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={() => handleOpenModuleDialog(module)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {/* Add preview logic */}}
                            className="cursor-pointer"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Prévisualiser
                          </DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteModule(module.id, module.title)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Progress Bar (Optional) */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
                    <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialogue pour créer/modifier un module */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedModule ? (
                <>
                  <Edit className="h-5 w-5" />
                  Modifier le module
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Créer un nouveau module
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <ModuleForm
            module={selectedModule as any}
            courseId={courseId}
            onSuccess={() => {
              setIsModuleDialogOpen(false);
              setSelectedModule(null);
            }}
            onCancel={() => {
              setIsModuleDialogOpen(false);
              setSelectedModule(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}