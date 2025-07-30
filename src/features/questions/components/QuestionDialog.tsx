"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Plus, BookOpen } from "lucide-react";
import { Question } from "@/lib/db/schema";
import { QuestionForm } from "./QuestionForm";

interface QuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  lessonId: number | null;
}

export function QuestionDialog({ isOpen, onOpenChange, question, lessonId }: QuestionDialogProps) {
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <DialogContent 
        className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto rounded-xl sm:rounded-2xl p-0 border-2"
      >
        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
          <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold text-foreground">
            {question?.id ? (
              <>
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center shadow-md">
                  <Edit className="h-4 w-4 text-primary" />
                </div>
                Modifier la question
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center shadow-md">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                Créer une nouvelle question
              </>
            )}
          </DialogTitle>
          <DialogDescription id="dialog-description" className="text-sm text-muted-foreground mt-2">
            {question?.id
              ? "Modifiez les détails de la question existante pour mettre à jour son contenu."
              : "Créez une nouvelle question pour évaluer les connaissances des étudiants."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          {lessonId ? (
            <QuestionForm
              question={question}
              lessonId={lessonId}
              onSuccess={() => onOpenChange(false)}
              onCancel={() => onOpenChange(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Leçon non spécifiée</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Impossible de créer ou modifier une question sans une leçon associée.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}