"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Plus } from "lucide-react";
import { NewCourseModule } from "@/lib/db/schema";
import { ModuleForm } from "./ModuleForm";

interface ModuleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  module: NewCourseModule | null;
  courseId: number;
}

export function ModuleDialog({ isOpen, onOpenChange, module, courseId }: ModuleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl">
            {module ? (
              <>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Edit className="h-4 w-4 text-primary" />
                </div>
                Modifier le module
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                Créer un nouveau module
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <ModuleForm
          module={module as any}
          courseId={courseId}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}