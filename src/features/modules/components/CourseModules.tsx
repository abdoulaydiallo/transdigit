"use client";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CourseModule, NewCourseModule, Question } from "@/lib/db/schema";
import { useModules } from "@/features/modules/hooks/useModules";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import { useExercises } from "@/features/exercises/hooks/useExercises";
import { useQuestions } from "@/features/questions/hooks/useQuestions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Plus,
  Loader2,
  AlertCircle,
  Clock,
  Calendar,
  Edit,
  Trash,
  BookOpen,
  MoreVertical,
  Users,
  ChevronRight,
  ChevronUp,
  FileText,
  Eye,
  EyeOff,
  HelpCircle,
  CheckSquare,
  BookOpenCheck
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModuleDialog } from "./ModuleDialog";
import { LessonDialog } from "@/features/lessons/components/LessonDialog";
import { QuestionDialog } from "@/features/questions/components/QuestionDialog";
import  { ExerciseDialog } from "@/features/exercises/components/ExerciseDialog";
import { Lesson } from "@/lib/db/schema";
import { Exercise } from "@/lib/db/schema";
import { ExerciseList } from "@/features/exercises/components/ExerciseList";

// -----------------------------
// TYPES
// -----------------------------

type ModuleWithLessons = CourseModule & {
  lessons: Lesson[];
};

interface CourseModulesProps {
  modules: CourseModule[];
  isLoadingModules: boolean;
  errorModules: any;
  courseId: number;
}
// -----------------------------
// UTILS
// -----------------------------
const useSortedModules = (modules: CourseModule[] = []) => {
  return useMemo(() => {
    return [...modules].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }, [modules]);
};


const useSortedLessons = (lessons: Lesson[]) => {
  return useMemo(() => {
    return [...lessons].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }, [lessons]);
};
const useSortedExercises = (exercises: Exercise[]) => {
  return useMemo(() => {
    return [...exercises].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [exercises]);
};

const useActiveLessons = (lessons: Lesson[] = []) => {
  return useMemo(() => lessons.filter((l) => l.isActive), [lessons]);
};

const useActiveExercises = (exercises: Exercise[] = []) => {
  return useMemo(() => exercises.filter((e) => e.isActive), [exercises]);
}

// -----------------------------
// COMPOSANTS
// -----------------------------
const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="relative mb-8">
      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center">
        <BookOpen className="h-10 w-10 text-muted-foreground/70" />
      </div>
      <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background">
        <Plus className="h-4 w-4 text-primary" />
      </div>
    </div>
    <h3 className="text-xl font-bold mb-3">Créez votre premier module</h3>
    <p className="text-muted-foreground mb-8 max-w-md">
      Structurez votre cours avec des modules et ajoutez des leçons interactives.
    </p>
    <Button size="lg" onClick={onCreate}>
      <Plus className="h-5 w-5 mr-2" />
      Créer le premier module
    </Button>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
    <p className="text-muted-foreground">Chargement des modules...</p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <Alert variant="destructive" className="mx-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Erreur</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

// Module Header
const ModuleHeader = ({
  module,
  onEdit,
  onDelete,
  onToggleExpand,
  isExpanded,
  lessonCount,
  exerciseCount
}: {
  module: ModuleWithLessons;
  onEdit: (m: any) => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
  lessonCount: number;
  exerciseCount: number;
}) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex items-start gap-4 flex-1 min-w-0">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg flex-shrink-0">
        {module.orderIndex || 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <h3 className="font-bold text-lg truncate">{module.title}</h3>
          <Badge variant="secondary">Module {module.orderIndex || 1}</Badge>
        </div>
        {module.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{module.description}</p>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {module.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {module.duration}h
            </span>
          )}
          {module.createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />{" "}
              {format(new Date(module.createdAt), "dd/MM/yyyy", { locale: fr })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <BookOpenCheck className="h-3 w-3" /> {lessonCount} leçon{lessonCount !== 1 ? "s" : ""}
          </span>
          
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {exerciseCount} exercice{exerciseCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>Modifier</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash className="h-4 w-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="sm" onClick={onToggleExpand}>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  </div>
);

// Lesson Item
const LessonItem = ({
  lesson,
  onEdit,
  onDelete,
  onToggleActive,
  onAddQuestion,
}: {
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onAddQuestion: () => void;
}) => {
  const { questions, isLoading } = useQuestions({lessonId: lesson.id});
  const questionCount = questions?.length || 0;
  return (
    <div className="group rounded-lg border bg-card/50 p-4 hover:bg-card transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary font-semibold">
          {lesson.orderIndex}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-semibold text-sm truncate">{lesson.title}</h5>
            <Badge variant="outline" className="text-xs">{lesson.type}</Badge>
            <Badge variant="outline" className="text-xs">{lesson.difficulty}</Badge>
            {lesson.isActive && <Badge>Actif</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            {lesson.estimatedTime} min • {format(new Date(lesson.createdAt), "dd/MM/yyyy", { locale: fr })}
          </p>
          {lesson.tags!.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {lesson.tags!.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <HelpCircle className="h-3 w-3" />
                {questionCount} question{questionCount !== 1 ? "s" : ""}
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={onAddQuestion}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            {isLoading ? (
              <div className="text-xs text-muted-foreground mt-1">Chargement...</div>
            ) : questionCount > 0 && (
              <div className="mt-1 space-y-1">
                {questions?.slice(0, 2).map((q, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs">
                    <CheckSquare className="h-3 w-3 text-primary" />
                    <span className="truncate">{q.questionText}</span>
                  </div>
                ))}
                {questionCount > 2 && (
                  <span className="text-xs text-muted-foreground">+ {questionCount - 2} autres</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
          <Button variant="ghost" size="sm" onClick={onEdit}><Edit className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" onClick={onDelete}><Trash className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" onClick={onToggleActive}>
            {lesson.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Lessons List
const LessonsList = ({
  lessons,
  onCreate,
  onEdit,
  onDelete,
  onToggleActive,
  onAddQuestion,
}: {
  lessons: Lesson[];
  onCreate: () => void;
  onEdit: (l: Lesson) => void;
  onDelete: (id: number, title: string) => void;
  onToggleActive: (l: Lesson) => void;
  onAddQuestion: (id: number) => void;
}) => {
  const sortedLessons = useSortedLessons(lessons);
  const activeLessons = useActiveLessons(sortedLessons);

  if (sortedLessons.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-4">Aucune leçon pour ce module.</p>
        <Button size="sm" onClick={onCreate}>Créer une leçon</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold">Leçons ({activeLessons.length} active{activeLessons.length !== 1 ? "s" : ""})</h4>
        <Button size="sm" variant="outline" onClick={onCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle
        </Button>
      </div>
      <div className="space-y-3">
        {sortedLessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            onEdit={() => onEdit(lesson)}
            onDelete={() => onDelete(lesson.id, lesson.title)}
            onToggleActive={() => onToggleActive(lesson)}
            onAddQuestion={() => onAddQuestion(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Module Item
const ModuleItem = ({
  module,
  onDeleteModule,
  onEditModule,
  onCreateLesson,
  onEditLesson,
  onDeleteLesson,
  onToggleLesson,
  onAddQuestion,

  
  OnCreateExercise,
  onEditExercise,
  onDeleteExercise,
  onToggleExercise,
  onAddExercise
}: {
  module: ModuleWithLessons;
  onDeleteModule: (id: number, title: string) => void;
  onEditModule: (m: ModuleWithLessons) => void;
  onCreateLesson: (moduleId: number) => void;
  onEditLesson: (l: Lesson) => void;
  onDeleteLesson: (id: number, title: string) => void;
  onToggleLesson: (l: Lesson) => void;

  OnCreateExercise: (moduleId: number) => void;
  onEditExercise: (l: Exercise) => void;
  onDeleteExercise: (id: number, title: string) => void;
  onToggleExercise: (l: Exercise) => void;

  onAddQuestion: (lessonId: number) => void;
  onAddExercise: (moduleId: number) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { lessons, isLoading, error } = useLessons({ moduleId: module.id });
  const { exercises } = useExercises({ moduleId: module.id });

  const transformedLessons: Lesson[] = lessons
    ? lessons.map(({createdAt, updatedAt, ...rest }) => ({
      ...rest,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    }))
    : []

    const transformedExercises: Exercise[] = exercises
    ? exercises.map(({createdAt, updatedAt, deadline, ...rest }) => ({
      ...rest,
      deadline: new Date(deadline!),
      createdAt: new Date(createdAt!),
      updatedAt: new Date(updatedAt!),
    }))
    : []

  const sortedLessons = useSortedLessons(transformedLessons);
  const sortedExercises = useSortedExercises(transformedExercises);
  const activeLessons = useActiveLessons(sortedLessons);
  const activeExercises = useActiveExercises(sortedExercises);

  return (
    <div className="rounded-xl border bg-card/60 backdrop-blur-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <ModuleHeader
          module={module}
          onEdit={onEditModule}
          onDelete={() => onDeleteModule(module.id, module.title)}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}
          lessonCount={activeLessons.length}
          exerciseCount={activeExercises.length}
        />
      </div>
      {isExpanded && (
        <div className="border-t  bg-muted/20 p-6  ">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : error ? (
            <ErrorState message="Erreur de chargement des leçons." />
          ) : (
            <div className="space-y-4">
              <LessonsList
                lessons={sortedLessons}
                onCreate={() => onCreateLesson(module.id)}
                onEdit={onEditLesson}
                onDelete={onDeleteLesson}
                onToggleActive={onToggleLesson}
                onAddQuestion={onAddQuestion}
              />
              <ExerciseList
                exercises={sortedExercises}
                onCreate={() => OnCreateExercise(module.id)}
                onEdit={onEditExercise}
                onDelete={onDeleteExercise}
                onToggleActive={onToggleExercise}
                onAddExercise={onAddExercise}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Add Module Button
const AddModuleButton = ({ onClick }: { onClick: () => void }) => (
  <div className="mt-8">
    <button
      onClick={onClick}
      className="w-full p-8 rounded-2xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/20 hover:bg-muted/40 transition-all"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus className="h-7 w-7 text-primary" />
        </div>
        <h4 className="font-semibold">Ajouter un nouveau module</h4>
        <p className="text-sm text-muted-foreground">Enrichissez votre cours avec un nouveau module</p>
      </div>
    </button>
  </div>
);

// -----------------------------
// COMPOSANT PRINCIPAL
// -----------------------------
export function CourseModules({
  modules,
  isLoadingModules,
  errorModules,
  courseId,
}: CourseModulesProps) {
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<NewCourseModule | null>(null);
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const { deleteModule } = useModules({ courseId });
  const sortedModules = useSortedModules(modules);

  const openModuleDialog = (module: NewCourseModule | null = null) => {
    setSelectedModule(module);
    setIsModuleOpen(true);
  };

  const openLessonDialog = (lesson: Lesson | null, moduleId: number) => {
    if (lesson) {
      setSelectedLesson({
        ...lesson,
        moduleId,
      });
    } else {
      setSelectedLesson({
        id: 0,
        title: "",
        moduleId,
        type: "video",
        difficulty: "facile",
        orderIndex: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: {},
        videoUrl: null,
        pdfUrl: null,
        estimatedTime: null,
        tags: [],
      });
    }
    setIsLessonOpen(true);
  };

  const openQuestionDialog = (question: Question | null, lessonId: number) => {
    setSelectedQuestion(question ? { ...question, lessonId } : ({ lessonId } as Question));
    setIsQuestionOpen(true);
  };
  
  const openExerciseDialog = (exercise: Exercise | null, moduleId: number) => {
    setSelectedExercise(exercise ? { ...exercise, moduleId } : ({ moduleId } as Exercise));
    setIsExerciseOpen(true);
  };

  const handleDeleteModule = (id: number, title: string) => {
    if (confirm(`Supprimer le module "${title}" ?`)) {
      deleteModule(id)
        .then(() => toast.success(`Module "${title}" supprimé.`))
        .catch(() => toast.error("Échec de suppression."));
    }
  };
  

  const handleToggleLesson = () => {
    // Géré via useLessons dans le composant LessonItem
  };
  const handleToggleExercise = () => {
    // Géré via useLessons dans le composant LessonItem
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border border-primary/15 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Modules du cours</h1>
              <p className="text-muted-foreground">Organisez votre contenu pédagogique</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{sortedModules.length} module{sortedModules.length !== 1 ? "s" : ""}</Badge>
            <Button size="sm" onClick={() => openModuleDialog()}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl border bg-card/30 backdrop-blur-sm">
        {isLoadingModules ? (
          <LoadingState />
        ) : errorModules ? (
          <ErrorState message="Impossible de charger les modules." />
        ) : sortedModules.length === 0 ? (
          <EmptyState onCreate={() => openModuleDialog()} />
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {sortedModules.map((module) => (
                <ModuleItem
                  key={module.id}
                  module={{ ...module, lessons: [] }}
                  onDeleteModule={handleDeleteModule}
                  onEditModule={openModuleDialog}
                  onCreateLesson={(moduleId) => openLessonDialog(null, moduleId)}
                  onEditLesson={(lesson) => openLessonDialog(lesson, lesson.moduleId)}
                  onDeleteLesson={() => {
                    // Géré dans le composant
                  }}
                  onToggleLesson={handleToggleLesson}

                  OnCreateExercise={(moduleId) => openExerciseDialog(null, moduleId)}
                  onEditExercise={(exercise) => openExerciseDialog(exercise, exercise.moduleId)}
                  onDeleteExercise={() => {
                    // Géré dans le composant
                  }}
                  onToggleExercise={handleToggleExercise}

                  onAddQuestion={(lessonId) => openQuestionDialog(null, lessonId)}
                  onAddExercise={(moduleId) => openExerciseDialog(null, moduleId)}
                />
              ))}
            </div>
            <AddModuleButton onClick={() => openModuleDialog()} />
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ModuleDialog
        isOpen={isModuleOpen}
        onOpenChange={(open) => {
          setIsModuleOpen(open);
          if (!open) setSelectedModule(null);
        }}
        module={selectedModule}
        courseId={courseId}
      />
      <LessonDialog
        isOpen={isLessonOpen}
        onOpenChange={(open) => {
          setIsLessonOpen(open);
          if (!open) setSelectedLesson(null);
        }}
        lesson={selectedLesson}
        moduleId={selectedLesson?.moduleId || null}
      />
      <QuestionDialog
        isOpen={isQuestionOpen}
        onOpenChange={(open) => {
          setIsQuestionOpen(open);
          if (!open) setSelectedQuestion(null);
        }}
        question={selectedQuestion}
        lessonId={selectedQuestion?.lessonId || null}
      />
      <ExerciseDialog
        isOpen={isExerciseOpen}
        onOpenChange={(open) => {
          setIsExerciseOpen(open);
          if (!open) setSelectedExercise(null);
        }}
        exercise={selectedExercise}
        moduleId={selectedExercise?.moduleId || null}
      />
    </div>
  );
}