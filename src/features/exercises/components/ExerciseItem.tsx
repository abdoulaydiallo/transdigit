// features/exercises/components/ExerciseItem.tsx
"use client";

import { Exercise } from "@/lib/db/schema";
import { useExercises } from "../hooks/useExercises";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Eye, EyeOff, Plus, CheckSquare, HelpCircle,} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface ExerciseItemProps {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onAddExercise: () => void;
}

export function ExerciseItem({
  exercise,
  onEdit,
  onDelete,
  onToggleActive,
  onAddExercise,
}: ExerciseItemProps) {
  const { exercises, isLoading: isLoadingExercises } = useExercises({exerciseId: exercise.id });
  const exerciseCount = exercises?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group rounded-lg border border-border/30 bg-card/80 p-4 hover:bg-card transition-colors duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
          {exercise.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-semibold text-sm truncate">{exercise.title}</h5>
            <Badge variant="outline" className="text-xs">
              {exercise.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {exercise.difficulty}
            </Badge>
            {exercise.isActive && (
              <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                Actif
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {exercise.maxScore} pts • {format(new Date(exercise.createdAt), "dd/MM/yyyy", { locale: fr })}
          </p>
          {exercise.tags && Array.isArray(exercise.tags) && exercise.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {exercise.tags.map((tag: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash className="h-3.5 w-3.5 text-destructive" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggleActive}>
            {exercise.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}