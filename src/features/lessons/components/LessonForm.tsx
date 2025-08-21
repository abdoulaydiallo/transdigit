"use client";

import { z } from "zod";
import * as React from "react";
import { toast } from "sonner";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useTransition, useMemo, useCallback, useState } from "react";
import dynamic from "next/dynamic";

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
  Clock,
  Hash,
  BookOpen,
  Video,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Settings,
  Tag,
  Lightbulb,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

// Types & Schemas
import { Lesson } from "@/lib/db/schema";
import { NewLessonSchema } from "@/lib/validations/courseLessons";
import { useLessons } from "../hooks/useLessons";

// Lazy load components avec fallback amélioré
const RichTextEditor = dynamic(
  () => import("@/components/tiptap/RichTextEditor").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <Card className="animate-pulse">
        <CardContent className="flex items-center justify-center h-40">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="relative">
              <Loader2 className="h-8 w-8 animate-spin" />
              <div className="absolute inset-0 h-8 w-8 animate-ping border-2 border-primary/20 rounded-full" />
            </div>
            <div className="text-center">
              <p className="font-medium">Chargement de l'éditeur</p>
              <p className="text-sm text-muted-foreground/60">Préparation de l'interface...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  }
);

// Types améliorés
type LessonFormValues = z.infer<typeof NewLessonSchema>;

interface LessonFormProps {
  lesson?: Lesson | null;
  moduleId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

// Constants avec design amélioré
const LESSON_TYPE_OPTIONS = [
  { 
    value: "texte", 
    label: "Contenu Textuel", 
    icon: FileText, 
    description: "Leçon basée sur du texte enrichi",
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    value: "video", 
    label: "Contenu Vidéo", 
    icon: Video, 
    description: "Leçon avec vidéo intégrée",
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    value: "pdf", 
    label: "Document PDF", 
    icon: BookOpen, 
    description: "Document PDF à télécharger",
    gradient: "from-green-500 to-emerald-500"
  },
] as const;

const DIFFICULTY_OPTIONS = [
  { 
    value: "facile", 
    label: "Débutant", 
    color: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
    icon: "🟢"
  },
  { 
    value: "moyen", 
    label: "Intermédiaire", 
    color: "bg-gradient-to-r from-yellow-100 to-orange-200 text-orange-800 border-orange-300",
    icon: "🟡"
  },
  { 
    value: "difficile", 
    label: "Avancé", 
    color: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
    icon: "🔴"
  },
] as const;

const DEFAULT_CONTENT = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

// Animations
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

// Hook personnalisé pour la progression du formulaire
const useFormProgress = (form: any) => {
  return useMemo(() => {
    const values = form.getValues();
    const requiredFields = ['title', 'type', 'difficulty', 'orderIndex'];
    const optionalFields = ['content', 'estimatedTime', 'videoUrl', 'pdfUrl', 'tags'];
    
    let filledRequired = 0;
    let filledOptional = 0;
    
    requiredFields.forEach(field => {
      if (values[field] && values[field] !== '') filledRequired++;
    });
    
    optionalFields.forEach(field => {
      if (field === 'tags') {
        if (values[field]?.length > 0) filledOptional++;
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

export function LessonForm({ lesson, moduleId, onSuccess, onCancel }: LessonFormProps) {
  if (!Number.isInteger(moduleId) || moduleId <= 0) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="flex items-center gap-3 p-6">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <div>
            <h3 className="font-semibold text-destructive">Erreur de configuration</h3>
            <p className="text-sm text-muted-foreground">L'ID du module doit être un entier positif</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const [isPending, startTransition] = useTransition();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { createLesson, updateLesson } = useLessons({ moduleId });

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(NewLessonSchema) as unknown as Resolver<LessonFormValues>,
    defaultValues: {
      moduleId,
      title: lesson?.title ?? "",
      type: lesson?.type ?? "texte",
      content: lesson?.content ?? DEFAULT_CONTENT,
      orderIndex: lesson?.orderIndex ?? 0,
      estimatedTime: lesson?.estimatedTime ?? 30,
      difficulty: lesson?.difficulty ?? "facile",
      tags: lesson?.tags ?? [],
      videoUrl: lesson?.videoUrl ?? "",
      pdfUrl: lesson?.pdfUrl ?? "",
      isActive: lesson?.isActive ?? false,
    },
    mode: "onChange", // Validation en temps réel
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control: form.control,
    //@ts-ignore
    name: "tags",
  });

  const watchedType = form.watch("type");
  const watchedTitle = form.watch("title");
  const formProgress = useFormProgress(form);

  // Soumission optimisée avec gestion d'erreurs avancée
  const onSubmit = useCallback(async (formData: LessonFormValues) => {
    if (Object.keys(form.formState.errors).length > 0) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          moduleId: formData.moduleId,
          title: formData.title.trim(),
          type: formData.type,
          content: formData.content,
          videoUrl: formData.videoUrl?.trim() || null,
          pdfUrl: formData.pdfUrl?.trim() || null,
          orderIndex: Number(formData.orderIndex),
          estimatedTime: formData.estimatedTime ? Number(formData.estimatedTime) : null,
          difficulty: formData.difficulty,
          tags: formData.tags?.filter((tag) => tag?.trim()) || [],
          isActive: formData.isActive ?? false,
        };

        if (lesson?.id) {
          await updateLesson({ moduleId, id: lesson.id, data: payload });
          toast.success(
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Leçon "{formData.title}" mise à jour</span>
            </div>
          );
        } else {
          await createLesson({ moduleId, data: payload });
          toast.success(
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Leçon "{formData.title}" créée avec succès</span>
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
  }, [lesson, moduleId, createLesson, updateLesson, onSuccess, form.formState.errors]);

  // Gestion optimisée des tags
  const handleAddTag = useCallback(() => {
    appendTag("");
  }, [appendTag]);

  const handleTagChange = useCallback((index: number, value: string) => {
    form.setValue(`tags.${index}`, value, { shouldValidate: true });
  }, [form]);

  return (
    <TooltipProvider>
      <motion.div
        variants={formVariants as any}
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
                    {lesson?.id ? `Modifier la leçon ${lesson?.id}` : "Nouvelle leçon"}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {watchedTitle ? `"${watchedTitle}"` : "Créez du contenu pédagogique engageant"}
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
                    <Progress 
                      value={formProgress.progress} 
                      className="w-full h-2" 
                    />
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
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Informations générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            Titre de la leçon *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Introduction aux bases de données"
                              className="text-base h-12 border-2 focus:border-primary/50 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Un titre clair et descriptif qui donne envie d'apprendre
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <FormField
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Type de contenu *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-2">
                                  <SelectValue placeholder="Choisir le type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {LESSON_TYPE_OPTIONS.map((option) => {
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
                            <FormLabel className="text-base font-semibold">Niveau de difficulté *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-2">
                                  <SelectValue placeholder="Sélectionner le niveau" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DIFFICULTY_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-3 py-1">
                                      <span className="text-lg">{option.icon}</span>
                                      <Badge className={`${option.color} border`}>
                                        {option.label}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="estimatedTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              Durée (minutes)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="5"
                                step="5"
                                placeholder="30"
                                className=" border-2"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contenu principal */}
              <motion.div variants={sectionVariants} layout>
                <Card className="hover:shadow-md transition-shadow duration-200 px-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Contenu de la leçon
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RichTextEditor
                              defaultValue={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            Rédigez le contenu pédagogique de votre leçon avec l'éditeur enrichi
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* URLs conditionnelles avec animations fluides */}
                    <AnimatePresence mode="wait">
                      {watchedType === "video" && (
                        <motion.div
                          key="video-url"
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <FormField
                            name="videoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold flex items-center gap-2">
                                  <Video className="h-4 w-4 text-purple-600" />
                                  URL de la vidéo
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://youtube.com/watch?v=..."
                                    type="url"
                                    className="h-12 border-2 focus:border-purple-500/50"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Lien vers votre vidéo (YouTube, Vimeo, Wistia, etc.)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      {watchedType === "pdf" && (
                        <motion.div
                          key="pdf-url"
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <FormField
                            name="pdfUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-green-600" />
                                  URL du document PDF
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://example.com/document.pdf"
                                    type="url"
                                    className="h-12 border-2 focus:border-green-500/50"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Lien vers le document PDF à télécharger ou consulter
                                </FormDescription>
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

              {/* Section avancée repliable */}
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
                              name="orderIndex"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-primary" />
                                    Ordre d'affichage *
                                  </FormLabel>
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
                                  <FormDescription>
                                    Position de cette leçon dans le module
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
                                        ? "✅ Visible par les étudiants" 
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
                          </div>

                          {/* Tags avec interface améliorée */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-base font-semibold flex items-center gap-2">
                                  <Tag className="h-4 w-4 text-primary" />
                                  Mots-clés et tags
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Ajoutez des mots-clés pour faciliter la recherche
                                </p>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={handleAddTag}
                                className="hover:bg-primary/10"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Ajouter
                              </Button>
                            </div>

                            <div className="space-y-3 max-h-40 overflow-y-auto">
                              <AnimatePresence mode="popLayout">
                                {tagFields.map((field, index) => (
                                  <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="flex-1">
                                      <Input
                                        placeholder="Ex: SQL, Base de données, Débutant"
                                        value={form.watch(`tags.${index}`) || ""}
                                        onChange={(e) => handleTagChange(index, e.target.value)}
                                        className="border-2 focus:border-primary/50"
                                      />
                                    </div>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => removeTag(index)}
                                          className="hover:bg-destructive/10 hover:border-destructive/50"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Supprimer ce tag</TooltipContent>
                                    </Tooltip>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                              
                              {tagFields.length === 0 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-center py-8 text-muted-foreground"
                                >
                                  <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">Aucun tag ajouté</p>
                                  <p className="text-xs">Les tags aident à organiser et rechercher vos leçons</p>
                                </motion.div>
                              )}
                            </div>
                          </div>
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
                      
                      {formProgress.requiredComplete && Object.keys(form.formState.errors).length === 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">Prêt pour la publication</span>
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

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="submit"
                            disabled={isPending || (!formProgress.requiredComplete && !lesson)}
                            className={`flex-1 sm:flex-none min-w-[140px] h-12 font-semibold transition-all duration-200 ${
                              formProgress.requiredComplete 
                                ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl' 
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                <span>Sauvegarde...</span>
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                <span>{lesson ? "Mettre à jour" : "Créer la leçon"}</span>
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!formProgress.requiredComplete 
                            ? "Complétez les champs obligatoires pour continuer" 
                            : lesson 
                              ? "Sauvegarder les modifications" 
                              : "Créer cette nouvelle leçon"
                          }
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Indicateur de progression en bas */}
                  {!formProgress.requiredComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-border/50"
                    >
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Progression du formulaire</span>
                        <span className="font-medium">{formProgress.progress}%</span>
                      </div>
                      <Progress value={formProgress.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Champs requis manquants</span>
                        <span>{formProgress.completedFields}/{formProgress.totalFields} complétés</span>
                      </div>
                    </motion.div>
                  )}
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
                <p className="font-semibold">💡 Conseils pour une bonne leçon :</p>
                <ul className="text-xs space-y-1">
                  <li>• Titre accrocheur et descriptif</li>
                  <li>• Contenu structuré avec des exemples</li>
                  <li>• Durée réaliste (15-45 min recommandé)</li>
                  <li>• Tags pertinents pour la recherche</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Raccourcis clavier */}
        <div className="hidden">
          <div
            onKeyDown={(e) => {
              if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                  case 's':
                    e.preventDefault();
                    if (formProgress.requiredComplete) {
                      form.handleSubmit(onSubmit)();
                    }
                    break;
                  case 'Escape':
                    e.preventDefault();
                    onCancel();
                    break;
                }
              }
            }}
            tabIndex={-1}
          />
        </div>
      </motion.div>
    </TooltipProvider>
  );
}