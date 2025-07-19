"use client";

import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Trash, X, Plus, Loader2 } from "lucide-react";
import { useModules } from "@/features/modules/hooks/useModules";
import { CourseModule } from "@/lib/db/schema";
import { NewCourseModuleSchema } from "@/lib/zodSchemas";
import { z } from "zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

// Type pour les données du formulaire
type ModuleFormValues = Omit<
  z.infer<typeof NewCourseModuleSchema>,
  "id" | "createdAt" | "updatedAt"
>;

type ModuleFormProps = {
  module?: CourseModule | null;
  courseId: number;
  onSuccess: () => void;
  onCancel: () => void;
};

export function ModuleForm({ module, courseId, onSuccess, onCancel }: ModuleFormProps) {
  const { createModule, updateModule } = useModules({ courseId });

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(NewCourseModuleSchema),
    defaultValues: {
      courseId,
      title: module?.title ?? "",
      orderIndex: module?.orderIndex ?? 0,
      description: module?.description ?? "",
      duration: module?.duration ?? "",
      steps: module?.steps as [string] ?? [],
    },
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray<
    ModuleFormValues,
    //@ts-ignore
    "steps"
  >({
    control: form.control,
    name: "steps",
  });

  const onSubmit = async (formData: ModuleFormValues) => {
    try {
      const payload = {
        courseId: formData.courseId,
        title: formData.title,
        orderIndex: Number(formData.orderIndex),
        description: formData.description || null,
        duration: formData.duration || null,
        steps: formData.steps || null,
      };

      if (module) {
        await updateModule({ id: module.id, data: payload });
        toast.success(`Module "${formData.title}" mis à jour`);
      } else {
        await createModule({ courseId, data: payload });
        toast.success(`Module "${formData.title}" créé`);
      }

      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
  };

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Titre*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le titre du module..."
                        {...field}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                        aria-label="Titre du module"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />

              {/* Colonne 2: Durée et Ordre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Durée</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 2h30"
                        {...field}
                        value={field.value ?? ""}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                        aria-label="Durée du module"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Ordre*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                        aria-label="Index d'ordre du module"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le contenu du module..."
                        {...field}
                        value={field.value ?? ""}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary min-h-[100px]"
                        aria-label="Description du module"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />

            
          </div>

          {/* Étapes */}
          <div className="space-y-2 rounded-lg border bg-card p-4">
            <FormLabel className="text-sm font-medium flex items-center gap-2">
              Étapes
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground text-xs cursor-help">
                    (Liste des étapes du module)
                  </span>
                </TooltipTrigger>
                <TooltipContent>Ajoutez des étapes textuelles pour ce module</TooltipContent>
              </Tooltip>
            </FormLabel>
            <AnimatePresence>
              {stepFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <FormField
                    control={form.control}
                    name={`steps.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={`Étape ${index + 1}...`}
                            {...field}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            aria-label={`Étape ${index + 1}`}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-destructive" />
                      </FormItem>
                    )}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => removeStep(index)}
                        aria-label={`Supprimer l'étape ${index + 1}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Supprimer cette étape</TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 flex items-center gap-2"
              onClick={() => appendStep("")}
              aria-label="Ajouter une étape"
            >
              <Plus className="h-4 w-4" />
              Ajouter une étape
            </Button>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex items-center gap-2"
                  aria-label="Annuler les modifications"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </Button>
              </TooltipTrigger>
              <TooltipContent>Annuler les modifications</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                  disabled={form.formState.isSubmitting}
                  aria-label={module ? "Enregistrer les modifications" : "Créer le module"}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {module ? "Enregistrer" : "Créer"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{module ? "Enregistrer les modifications" : "Créer le module"}</TooltipContent>
            </Tooltip>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}