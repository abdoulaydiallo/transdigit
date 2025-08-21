// features/exercises/components/ExerciseForm.tsx
"use client";
import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useTransition, useMemo, useCallback, useState } from "react";
import { useExercises } from "../hooks/useExercises";
import { formatDateTimeLocal } from "@/lib/utils";

// UI Components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Icons
import {
  Save,
  X,
  List,
  FileText,
  Target,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Settings,
  Plus,
} from "lucide-react";

// Types & Schemas
import { Exercise } from "@/lib/db/schema";
import { NewExerciseSchema, ExerciseFormData } from "@/lib/validations/exercise.schema";

// Constants
const EXERCISE_TYPE_OPTIONS = [
  { 
    value: "projet", 
    label: "Projet", 
    icon: Target, 
    description: "Projet complet à réaliser",
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    value: "quiz", 
    label: "Quiz", 
    icon: FileText, 
    description: "Série de questions à choix multiples",
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    value: "tache", 
    label: "Tâche", 
    icon: List, 
    description: "Tâche simple à accomplir",
    gradient: "from-purple-500 to-pink-500"
  },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: "facile", label: "Facile", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "moyen", label: "Moyen", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { value: "difficile", label: "Difficile", color: "bg-red-100 text-red-800 border-red-300" },
] as const;

const INSTRUCTION_TEMPLATES = {
  projet: {
    description: "Instructions pour un projet complet à réaliser.",
    example: [
      "1. Objectif : Développer une application avec les fonctionnalités suivantes : [listez les fonctionnalités].",
      "2. Technologies requises : [ex. React, Node.js, MongoDB].",
      "3. Livrables : Lien vers un dépôt GitHub avec le code source et un README expliquant l'installation.",
      "4. Critères d'évaluation : [ex. Qualité du code, fonctionnalités implémentées, respect des délais].",
      "5. Ressources suggérées : [liens ou références utiles]."
    ],
    placeholder: "Décrivez les étapes du projet, les technologies à utiliser et les livrables attendus."
  },
  quiz: {
    description: "Instructions pour un quiz à choix multiples ou questions ouvertes.",
    example: [
      "1. Format : Répondez aux questions suivantes en sélectionnant la bonne réponse ou en rédigeant une réponse courte.",
      "2. Nombre de questions : [ex. 10 questions].",
      "3. Durée : [ex. 30 minutes].",
      "4. Instructions spécifiques : [ex. Une seule réponse correcte par question, pas d'utilisation de ressources externes].",
      "5. Exemple de question : [ex. Quelle est la différence entre var, let et const en JavaScript ?]."
    ],
    placeholder: "Listez les instructions du quiz, le format des questions et les règles."
  },
  tache: {
    description: "Instructions pour une tâche simple à accomplir.",
    example: [
      "1. Objectif : Réaliser une tâche spécifique [ex. Écrire une fonction pour trier un tableau].",
      "2. Instructions : [ex. Utilisez JavaScript, fournissez des tests unitaires].",
      "3. Livrable : [ex. Code source soumis via un lien ou fichier].",
      "4. Contraintes : [ex. Temps maximum, format attendu]."
    ],
    placeholder: "Décrivez la tâche à accomplir, les contraintes et le format de soumission."
  }
} as const;

// Animations
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

// Hook personnalisé pour la progression du formulaire
const useFormProgress = (form: any) => {
  return useMemo(() => {
    const values = form.getValues();
    const requiredFields = ['title', 'type', 'moduleId', 'maxScore'];
    const optionalFields = ['description', 'submissionUrl', 'deadline', 'tags', 'instructions'];
    let filledRequired = 0;
    let filledOptional = 0;
    
    requiredFields.forEach(field => {
      if (values[field] && values[field] !== '') filledRequired++;
    });
    
    optionalFields.forEach(field => {
      if (field === 'tags') {
        if (Array.isArray(values[field]) && values[field].length > 0) filledOptional++;
      } else if (values[field] && values[field] !== '') {
        filledOptional++;
      }
    });
    
    const totalProgress = ((filledRequired / requiredFields.length) * 70) + 
                         ((filledOptional / optionalFields.length) * 30);
    
    return {
      progress: Math.round(totalProgress),
      requiredComplete: filledRequired === requiredFields.length,
      completedFields: filledRequired + filledOptional,
      totalFields: requiredFields.length + optionalFields.length
    };
  }, [form.watch()]);
};

export function ExerciseForm({ exercise, moduleId, onSuccess, onCancel }: {
  exercise?: Exercise | null;
  moduleId: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { createExercise, updateExercise } = useExercises({moduleId, exerciseId: exercise?.id});

  const form = useForm({
    resolver: zodResolver(NewExerciseSchema),
    defaultValues: {
      moduleId,
      title: exercise?.title ?? "",
      description: exercise?.description ?? "",
      type: exercise?.type ?? "projet",
      submissionUrl: exercise?.submissionUrl ?? "",
      maxScore: exercise?.maxScore ?? 10,
      deadline: formatDateTimeLocal(exercise?.deadline),
      difficulty: exercise?.difficulty ?? "facile",
      tags: Array.isArray(exercise?.tags) ? exercise.tags : [],
      instructions: exercise?.instructions ?? { type: "doc", content: [] },
      isActive: exercise?.isActive ?? true,
    },
    mode: "onChange",
  });

  const watchedType = form.watch("type");
  const watchedTitle = form.watch("title");
  const formProgress = useFormProgress(form);

  const onSubmit = useCallback(async (formData: ExerciseFormData) => {
    if (Object.keys(form.formState.errors).length > 0) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    
    startTransition(async () => {
      try {
        const payload = {
          moduleId: formData.moduleId,
          title: formData.title.trim(),
          description: formData.description?.trim() || undefined,
          type: formData.type,
          submissionUrl: formData.submissionUrl?.trim() ? formData.submissionUrl.trim() : null,
          maxScore: Number(formData.maxScore) || 1,
          deadline: formData.deadline ? formData.deadline : null,
          difficulty: formData.difficulty,
          tags: Array.isArray(formData.tags) ? formData.tags.filter((tag: string) => tag?.trim()) : [],
          instructions: formData.instructions ?? { type: "doc", content: [] },
          isActive: formData.isActive ?? true,
        };

        if (exercise?.id) {
          await updateExercise({ id: exercise!.id, data: payload });
          toast.success(
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Exercice mis à jour</span>
            </div>
          );
        } else {
          console.log(payload)
          await createExercise(payload);
          toast.success(
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Exercice créé avec succès</span>
            </div>
          );
        }
        
        onSuccess();
      } catch (error) {
        console.error("Submission error:", error);
        toast.error(
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <div>
              <p className="font-medium">Erreur lors de la sauvegarde</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Une erreur inattendue est survenue"}
              </p>
            </div>
          </div>
        );
      }
    });
  }, [exercise, moduleId, createExercise, updateExercise, onSuccess, form.formState.errors]);

  return (
    <TooltipProvider>
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* En-tête avec progression */}
        <motion.div variants={sectionVariants}>
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {exercise?.id ? `Modifier l'exercice` : "Nouvel exercice"}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {watchedTitle ? `"${watchedTitle}"` : "Créez un exercice pour évaluer les compétences"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{formProgress.progress}% complété</p>
                    <p className="text-xs text-muted-foreground">
                      {formProgress.completedFields}/{formProgress.totalFields} champs
                    </p>
                  </div>
                  <div className="relative w-16 h-16">
                    <Progress value={formProgress.progress} className="w-full h-2" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        formProgress.requiredComplete 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {formProgress.requiredComplete ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <span className="text-sm font-bold">{formProgress.progress}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <LayoutGroup>
              {/* Informations de base */}
              <motion.div variants={sectionVariants} layout>
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Informations générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            Titre de l&apos;exercice *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Créer une application de gestion de tâches"
                              className="text-base h-12 border-2 focus:border-primary/50 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Formulez un titre clair et motivant
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Type d&apos;exercice *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-2">
                                  <SelectValue placeholder="Choisir le type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {EXERCISE_TYPE_OPTIONS.map((option) => {
                                  const Icon = option.icon;
                                  return (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center gap-3 py-2">
                                        <div className={`p-2 rounded-lg bg-gradient-to-r ${option.gradient}`}>
                                          <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                          <p className="font-medium">{option.label}</p>
                                          <p className="text-xs text-muted-foreground">{option.description}</p>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        name="maxScore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">
                              Score maximum *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.5"
                                min="1"
                                placeholder="10"
                                className="h-12 border-2"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormDescription>
                              Points attribués pour une réponse complète
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Difficulté *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-2">
                                <SelectValue placeholder="Sélectionner la difficulté" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DIFFICULTY_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <Badge className={option.color}>{option.label}</Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Description et instructions */}
              <motion.div variants={sectionVariants} layout>
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Contenu de l&apos;exercice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Un exercice complet qui combine les concepts de React, Node.js et MongoDB"
                              className="h-12 border-2"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Brève description de l&apos;exercice
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name="instructions"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-base font-semibold">
                              Instructions détaillées
                            </FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                field.onChange({
                                  type: "doc",
                                  content: INSTRUCTION_TEMPLATES[watchedType as keyof typeof INSTRUCTION_TEMPLATES].example
                                });
                                toast.success("Modèle d'instructions inséré !");
                              }}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Insérer un modèle
                            </Button>
                          </div>
                          <FormControl>
                            <div className="border-2 rounded-lg p-4 min-h-32">
                              <textarea
                                className="w-full min-h-[100px] p-2 text-sm bg-transparent focus:outline-none resize-y"
                                placeholder={INSTRUCTION_TEMPLATES[watchedType as keyof typeof INSTRUCTION_TEMPLATES].placeholder}
                                value={Array.isArray(field.value?.content) ? field.value.content.join("\n") : ""}
                                onChange={(e) => {
                                  field.onChange({
                                    type: "doc",
                                    content: e.target.value.split("\n").filter(line => line.trim())
                                  });
                                }}
                              />
                              <div className="mt-2 text-sm text-muted-foreground">
                                <p>{INSTRUCTION_TEMPLATES[watchedType as keyof typeof INSTRUCTION_TEMPLATES].description}</p>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Étapes, consignes, et attentes spécifiques pour {EXERCISE_TYPE_OPTIONS.find(opt => opt.value === watchedType)?.label.toLowerCase() || "l'exercice"}.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Paramètres avancés */}
              <motion.div variants={sectionVariants} layout>
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        Paramètres avancés
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showAdvanced ? "Masquer" : "Afficher"}
                      </Button>
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              name="submissionUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-semibold">
                                    URL de soumission
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="url"
                                      placeholder="https://github.com/username/project"
                                      className="h-12 border-2"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Lien vers le dépôt ou la plateforme de soumission
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              name="deadline"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-semibold">
                                    Date limite
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="datetime-local"
                                      className="h-12 border-2"
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) => {
                                        console.log('Valeur saisie:', e.target.value);
                                        field.onChange(e.target.value || null);
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Date et heure limite de soumission
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            name="tags"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  Tags
                                </FormLabel>
                                <FormControl>
                                  <div className="flex flex-wrap gap-2">
                                    {field.value?.map((tag: string, index: number) => (
                                      <Badge
                                        key={index}
                                        className="flex items-center gap-1 px-2 py-1 text-sm"
                                      >
                                        {tag}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newTags = [...field.value];
                                            newTags.splice(index, 1);
                                            field.onChange(newTags);
                                          }}
                                          className="ml-1 hover:bg-white/20 rounded-full"
                                        >
                                          x
                                        </button>
                                      </Badge>
                                    ))}
                                    <Input
                                      placeholder="Ajouter un tag"
                                      className="h-8 w-32"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                          e.preventDefault();
                                          const newTag = e.currentTarget.value.trim();
                                          if (!field.value.includes(newTag)) {
                                            field.onChange([...field.value, newTag]);
                                          }
                                          e.currentTarget.value = "";
                                        }
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Mots-clés pour catégoriser l'exercice
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border-2 border-dashed">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base font-semibold">
                                    Publication
                                  </FormLabel>
                                  <FormDescription>
                                    {field.value 
                                      ? "✅ Visible pour les étudiants" 
                                      : "📝 Brouillon (non publié)"
                                    }
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </LayoutGroup>

            {/* Actions du formulaire */}
            <motion.div variants={sectionVariants} layout>
              <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-3">
                      {Object.keys(form.formState.errors).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium">
                            {Object.keys(form.formState.errors).length} erreur(s) à corriger
                          </span>
                        </motion.div>
                      )}
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isPending}
                        className="flex-1 sm:flex-none h-12 border-2 hover:bg-muted/50 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending || !formProgress.requiredComplete}
                        className="flex-1 sm:flex-none min-w-[140px] h-12 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span>Sauvegarde...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            <span>{exercise?.id ? "Mettre à jour" : "Créer un exercice"}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </form>
        </Form>

        {/* Bouton d'aide flottant */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-110"
              >
                <Lightbulb className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold">💡 Conseils pour un bon exercice :</p>
                <ul className="text-xs space-y-1">
                  <li>• Titre clair et motivant</li>
                  <li>• Instructions détaillées et réalisables</li>
                  <li>• Score adapté à la difficulté</li>
                  <li>• Date limite réaliste</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}