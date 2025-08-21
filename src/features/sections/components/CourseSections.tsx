"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CourseSection } from "@/lib/db/schema";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FolderOpen, Plus, Loader2, AlertCircle, Settings, Calendar, Edit, Trash, GripVertical } from "lucide-react";
import { SectionForm } from "./SectionForm";
import { toast } from "sonner";
import { useCourseSections } from "../hooks/useCourseSections";

interface CourseSectionsProps {
  courseId: number;
}

export function CourseSections({ courseId }: CourseSectionsProps) {
  const { sections, isLoading, error, deleteSection } = useCourseSections({ courseId });
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [isManageModeOpen, setIsManageModeOpen] = useState(false);

  const sortedSections = useMemo(() => {
    return Array.isArray(sections)
      ? [...sections].sort((a, b) => (a.id || 0) - (b.id || 0))
      : [];
  }, [sections]);

  const handleOpenSectionDialog = (section: CourseSection | null = null) => {
    setSelectedSection(section);
    setIsSectionDialogOpen(true);
  };

  const handleDeleteSection = async (sectionId: number, sectionTitle: string) => {
    if (confirm(`Voulez-vous vraiment supprimer la section "${sectionTitle}" ?`)) {
      try {
        await deleteSection({ courseId, id: sectionId });
        toast.success(`La section "${sectionTitle}" a été supprimée avec succès.`);
      } catch {
        toast.error("Erreur lors de la suppression de la section");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Sections du cours</h2>
            <Badge variant="secondary" className="ml-2">
              {sortedSections.length} section{sortedSections.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsManageModeOpen(!isManageModeOpen)}
            >
              <Settings className="h-4 w-4" />
              Gérer
            </Button>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => handleOpenSectionDialog()}
              aria-label="Ajouter une section"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Chargement des sections...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>Impossible de charger les sections du cours.</AlertDescription>
          </Alert>
        ) : sortedSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune section</h3>
            <p className="text-muted-foreground mb-4">
              Ce cours ne contient pas encore de sections.
            </p>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => handleOpenSectionDialog()}
              aria-label="Créer la première section"
            >
              <Plus className="h-4 w-4" />
              Créer la première section
            </Button>
          </div>
        ) : (
          <div className="p-4">
            {sortedSections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center justify-between rounded-lg border p-4 mb-2 bg-background hover:bg-accent/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{section.title}</h4>
                      <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                        {section.tabKey}
                      </code>
                    </div>
                    {section.createdAt && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(section.createdAt), "dd/MM/yyyy", { locale: fr })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenSectionDialog(section)}
                    aria-label={`Modifier la section ${section.title}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteSection(section.id, section.title)}
                    aria-label={`Supprimer la section ${section.title}`}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSection ? "Modifier la section" : "Créer une section"}</DialogTitle>
          </DialogHeader>
          <SectionForm
            section={selectedSection}
            courseId={courseId}
            onSuccess={() => {
              setIsSectionDialogOpen(false);
              setSelectedSection(null);
            }}
            onCancel={() => {
              setIsSectionDialogOpen(false);
              setSelectedSection(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}