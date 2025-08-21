"use client";
import { z } from "zod";
import * as React from "react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useTransition, useMemo, useCallback, useState } from "react";
import { useQuestions } from "../hooks/useQuestions";

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Icons
import {
  Save,
  X,
  CheckCircle,
  CheckSquare,
  HelpCircle,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Settings,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  List, // Ajouté ici
} from "lucide-react";

// Types & Schemas
import { Question } from "@/lib/db/schema";
import { NewQuestionSchema } from "@/lib/validations/questions.schema";

// Constants
const QUESTION_TYPE_OPTIONS = [
  {
    value: "choix_multiple",
    label: "Choix Multiple",
    icon: CheckSquare,
    description: "Plusieurs choix, une ou plusieurs bonnes réponses",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    value: "vrai_faux",
    label: "Vrai ou Faux",
    icon: CheckCircle,
    description: "Deux choix simples : vrai ou faux",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    value: "texte_libre",
    label: "Réponse Ouverte",
    icon: HelpCircle,
    description: "Réponse libre en texte",
    gradient: "from-purple-500 to-pink-500",
  },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: "facile", label: "Facile", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "moyen", label: "Moyen", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { value: "difficile", label: "Difficile", color: "bg-red-100 text-red-800 border-red-300" },
] as const;

// Animations
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Hook personnalisé pour la progression du formulaire
const useFormProgress = (form: any) => {
  return useMemo(() => {
    const values = form.getValues();
    const requiredFields = ["questionText", "type", "lessonId"];
    const optionalFields = ["correctAnswer", "explanation", "maxScore", "timeLimit", "tags"];
    let filledRequired = 0;
    let filledOptional = 0;

    requiredFields.forEach((field) => {
      if (values[field] && values[field] !== "") filledRequired++;
    });

    optionalFields.forEach((field) => {
      if (field === "tags") {
        if (Array.isArray(values[field]) && values[field].length > 0) filledOptional++;
      } else if (values[field] && values[field] !== "") {
        filledOptional++;
      }
    });

    const totalProgress =
      (filledRequired / requiredFields.length) * 70 +
      (filledOptional / optionalFields.length) * 30;

    return {
      progress: Math.round(totalProgress),
      requiredComplete: filledRequired === requiredFields.length,
      completedFields: filledRequired + filledOptional,
      totalFields: requiredFields.length + optionalFields.length,
    };
  }, [form.watch()]);
};

export function QuestionForm({
  question,
  lessonId,
  onSuccess,
  onCancel,
}: {
  question?: Question | null;
  lessonId: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { createQuestion, updateQuestion } = useQuestions({ lessonId });

  const form = useForm<z.infer<typeof NewQuestionSchema>>({
    resolver: zodResolver(NewQuestionSchema),
    defaultValues: {
      lessonId,
      questionText: question?.questionText ?? "",
      type: question?.type ?? "choix_multiple",
      options: question?.options ?? undefined,
      correctAnswer: question?.correctAnswer ?? undefined,
      explanation: question?.explanation ?? undefined,
      maxScore: question?.maxScore ?? 1,
      orderIndex: question?.orderIndex ?? 0,
      difficulty: question?.difficulty ?? "facile",
      tags: question?.tags ?? [],
      timeLimit: question?.timeLimit ?? 0,
      isActive: question?.isActive ?? false,
    },
    mode: "onChange",
  });

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: "options.choices",
  });

  const watchedType = form.watch("type");
  const watchedQuestionText = form.watch("questionText");
  const formProgress = useFormProgress(form);

  const onSubmit = useCallback(
    async (formData: z.infer<typeof NewQuestionSchema>) => {
      console.log("Données du formulaire:", JSON.stringify(formData, null, 2));
      startTransition(async () => {
        try {
          if (question?.id) {
            await updateQuestion({
              id: question.id,
              lessonId,
              data: formData,
            });
            toast.success(
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Question mise à jour</span>
              </div>
            );
          } else {
            await createQuestion({ lessonId, data: formData as any });
            toast.success(
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Question créée avec succès</span>
              </div>
            );
          }
          onSuccess();
        } catch (error) {
          console.error("Erreur de soumission:", error);
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
    },
    [question, lessonId, createQuestion, updateQuestion, onSuccess]
  );

  const handleAddOption = useCallback(() => {
    appendOption({
      id: crypto.randomUUID(),
      text: "",
      isCorrect: false,
    });
  }, [appendOption]);

  return (
    <TooltipProvider>
      <motion.div variants={formVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-8">
        {/* En-tête avec progression */}
        <motion.div variants={sectionVariants}>
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {question?.id ? `Modifier la question` : "Nouvelle question"}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {watchedQuestionText ? `"${watchedQuestionText}"` : "Créez une question d'évaluation"}
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
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          formProgress.requiredComplete ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                        }`}
                      >
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
                      <List className="h-5 w-5 text-primary" />
                      Informations générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      
                      name="questionText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Texte de la question *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Quelle est la principale fonction d'une base de données relationnelle ?"
                              className="text-base h-12 border-2 focus:border-primary/50 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Formulez une question claire et précise</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Type de question *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-2">
                                  <SelectValue placeholder="Choisir le type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {QUESTION_TYPE_OPTIONS.map((option) => {
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Options spécifiques au type */}
              <motion.div variants={sectionVariants} layout>
                <Card className="hover:shadow-md transition-shadow duration-200 px-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      Options de réponse
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <AnimatePresence mode="wait">
                      {watchedType === "choix_multiple" && (
                        <motion.div
                          key="multiple-choice"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-base font-semibold">Choix de réponse</FormLabel>
                              <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                                <Plus className="h-4 w-4 mr-1" />
                                Ajouter
                              </Button>
                            </div>

                            {optionFields.length === 0 && (
                              <div className="text-center py-8 text-muted-foreground">
                                <List className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Aucun choix ajouté</p>
                                <p className="text-xs">Ajoutez des options de réponse pour cette question</p>
                              </div>
                            )}

                            {optionFields.map((field, index) => (
                              <div key={field.id} className="flex items-center gap-3">
                                <div className="flex-1">
                                  <FormField
                                    
                                    name={`options.choices.${index}.text`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder="Ex: Stocker des données de manière structurée"
                                            className="border-2 focus:border-primary/50"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  
                                  name={`options.choices.${index}.isCorrect`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeOption(index)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <FormField
                            
                            name="explanation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">Explication de la réponse</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ex: Une base de données relationnelle permet de stocker des données structurées avec des relations entre elles"
                                    className="h-12 border-2"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>Expliquez pourquoi cette réponse est correcte</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      {watchedType === "vrai_faux" && (
                        <motion.div
                          key="true-false"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FormField
                            
                            name="options.choices"
                            render={() => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">Réponse correcte</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button
                                    type="button"
                                    variant={form.watch("options.choices.0.isCorrect") ? "default" : "outline"}
                                    onClick={() => {
                                      form.setValue("options.choices", [
                                        { id: crypto.randomUUID(), text: "Vrai", isCorrect: true },
                                        { id: crypto.randomUUID(), text: "Faux", isCorrect: false },
                                      ]);
                                    }}
                                    className="h-12"
                                  >
                                    Vrai
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={form.watch("options.choices.1.isCorrect") ? "default" : "outline"}
                                    onClick={() => {
                                      form.setValue("options.choices", [
                                        { id: crypto.randomUUID(), text: "Vrai", isCorrect: false },
                                        { id: crypto.randomUUID(), text: "Faux", isCorrect: true },
                                      ]);
                                    }}
                                    className="h-12"
                                  >
                                    Faux
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            
                            name="explanation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">Explication</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ex: Cette affirmation est correcte car..."
                                    className="h-12 border-2"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>Expliquez pourquoi la réponse est vraie ou fausse</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      {watchedType === "texte_libre" && (
                        <motion.div
                          key="open-question"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FormField
                            
                            name="correctAnswer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">Réponse attendue</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ex: Une base de données relationnelle permet de stocker des données structurées avec des relations entre elles"
                                    className="h-12 border-2"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>Saisissez la réponse attendue pour cette question</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            
                            name="explanation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">Explication</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ex: Une bonne réponse devrait mentionner la structure des données et les relations"
                                    className="h-12 border-2"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>Expliquez ce que devrait contenir une bonne réponse</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                              
                              name="maxScore"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-semibold">Score maximum</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.5"
                                      min="0.5"
                                      placeholder="1"
                                      className="h-12 border-2"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                                    />
                                  </FormControl>
                                  <FormDescription>Points attribués pour une réponse correcte</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              
                              name="timeLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-semibold">Limite de temps (secondes)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="10"
                                      placeholder="0"
                                      className="h-12 border-2"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormDescription>Temps accordé pour répondre (0 pour illimité)</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            
                            name="orderIndex"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">Ordre d'affichage</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="1"
                                    className="h-12 border-2"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormDescription>Position de cette question dans la leçon</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border-2 border-dashed">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base font-semibold">Publication</FormLabel>
                                  <FormDescription>
                                    {field.value ? "✅ Visible pour les étudiants" : "📝 Brouillon (non publié)"}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                          <span className="font-medium">{Object.keys(form.formState.errors).length} erreur(s) à corriger</span>
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
                            <span>{question?.id ? "Mettre à jour" : "Créer une question"}</span>
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
                <p className="font-semibold">💡 Conseils pour une bonne question :</p>
                <ul className="text-xs space-y-1">
                  <li>• Question claire et sans ambiguïté</li>
                  <li>• Choix de réponse plausibles</li>
                  <li>• Explication détaillée de la réponse</li>
                  <li>• Score adapté à la difficulté</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}