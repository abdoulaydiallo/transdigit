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
import { GraduationCap, Plus, Loader2, AlertCircle, List, Clock, Calendar, Edit, Trash } from "lucide-react";
import { ModuleForm } from "./ModuleForm";
import { toast } from "sonner";

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
  const {  deleteModule } = useModules({ courseId });

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
        await deleteModule(moduleId);
        toast.success(`Le module "${moduleTitle}" a été supprimé avec succès.`);
      } catch (error) {
        toast.error("Erreur lors de la suppression du module");
      }
    }
  };

  console.log("Modules chargés :", sortedModules);

  return (
    <div className="rounded-lg border bg-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">
            Modules du cours
          </h2>
          <Badge variant="secondary" className="ml-2">
            {sortedModules.length} module{sortedModules.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <Button 
          size="sm" 
          className="gap-2" 
          onClick={() => handleOpenModuleDialog()}
          aria-label="Ajouter un module"
        >
          <Plus className="h-4 w-4" />
          Ajouter un module
        </Button>
      </div>

      {isLoadingModules ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Chargement des modules...</span>
        </div>
      ) : errorModules ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les modules du cours.
          </AlertDescription>
        </Alert>
      ) : sortedModules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <List className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun module</h3>
          <p className="text-muted-foreground mb-4">
            Ce cours ne contient pas encore de modules.
          </p>
          <Button 
            size="sm" 
            className="gap-2" 
            onClick={() => handleOpenModuleDialog()}
            aria-label="Créer le premier module"
          >
            <Plus className="h-4 w-4" />
            Créer le premier module
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedModules.map((module, index) => (
            <div
              key={module.id}
              className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {module.number || index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{module.title}</h3>
                  {module.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {module.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    {module.duration && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {module.duration}
                      </div>
                    )}
                    {module.createdAt && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(module.createdAt), "dd/MM/yyyy", { locale: fr })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2" 
                  onClick={() => handleOpenModuleDialog(module)}
                  aria-label={`Modifier le module ${module.title}`}
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-destructive hover:text-destructive" 
                  onClick={() => handleDeleteModule(module.id, module.title)}
                  aria-label={`Supprimer le module ${module.title}`}
                >
                  <Trash className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogue pour créer/modifier un module */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedModule ? "Modifier le module" : "Créer un module"}</DialogTitle>
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
