"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Plus } from "lucide-react";
import { Lesson } from "@/lib/db/schema";
import { LessonForm } from "../../lessons/components/LessonForm";

interface LessonDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson | null;
  moduleId: number | null;
}

export function LessonDialog({ isOpen, onOpenChange, lesson, moduleId }: LessonDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) onOpenChange(false);
    }}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto rounded-xl sm:rounded-2xl" aria-describedby="dialog-description">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl">
            {lesson?.id ? (
              <>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Edit className="h-4 w-4 text-primary" />
                </div>
                Modifier la leçon
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                Créer une nouvelle leçon
              </>
            )}
          </DialogTitle>
          <DialogDescription id="dialog-description">
            {lesson?.id
              ? "Modifiez les détails de la leçon existante pour mettre à jour son contenu."
              : "Créez une nouvelle leçon pour enrichir le contenu de votre module."}
          </DialogDescription>
        </DialogHeader>
        {moduleId && (
          <LessonForm
            lesson={lesson}
            moduleId={moduleId}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}