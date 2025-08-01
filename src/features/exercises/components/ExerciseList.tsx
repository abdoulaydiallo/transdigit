// features/exercises/components/ExercisesList.tsx
"use client";

import { Exercise } from "@/lib/db/schema";
import { ExerciseItem } from "./ExerciseItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface ExercisesListProps {
  exercises: Exercise[];
  onCreate: () => void;
  onEdit: (e: Exercise) => void;
  onDelete: (id: number, title: string) => void;
  onToggleActive: (e: Exercise) => void;
  onAddExercise: (id: number) => void;
}

export function ExerciseList({
  exercises,
  onCreate,
  onEdit,
  onDelete,
  onToggleActive,
  onAddExercise,
}: ExercisesListProps) {
  
  const sortedExercises = exercises
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  const activeExercises = sortedExercises.filter((e) => e.isActive);

  if (sortedExercises.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="w-12 h-12 mx-auto mb-3 bg-muted/50 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Aucun exercice pour ce module.</p>
        <Button 
          size="sm" 
          onClick={onCreate}
          className="gap-2 shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Créer un exercice
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-foreground">
          Exercices ({activeExercises.length} actif{activeExercises.length !== 1 ? "s" : ""})
        </h4>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCreate}
          className="gap-2 hover:bg-primary/5 border-primary/20"
        >
          <Plus className="h-4 w-4" />
          Nouveau
        </Button>
      </div>
      <div className="space-y-3">
        {sortedExercises.map((exercise) => (
          <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            onEdit={() => onEdit(exercise)}
            onDelete={() => onDelete(exercise.id, exercise.title)}
            onToggleActive={() => onToggleActive(exercise)}
            onAddExercise={() => onAddExercise(exercise.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}