"use client";

import * as React from "react";
import { SubmitHandler, useFieldArray, useForm, Resolver } from "react-hook-form";
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
import { ModuleFormValues, NewCourseModuleSchema } from "@/lib/zodSchemas";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

type ResolverType = Resolver<FormValues>;

type FormValues = {
  id: number;
  courseId: number;
  title: string;
  orderIndex: number;
  duration: number | null;
  description: string | null;
  steps: string[];
  tools: {
    title: string;
    content: Array<{
      name: string;
      src: string;
    }>;
  } | null;
};

type ModuleFormProps = {
  module?: FormValues | null;
  courseId: number;
  onSuccess: () => void;
  onCancel: () => void;
};

export function ModuleForm({ module, courseId, onSuccess, onCancel }: ModuleFormProps) {
  const { createModule, updateModule } = useModules({ courseId });

const form = useForm<FormValues>({
  resolver: zodResolver(NewCourseModuleSchema) as unknown as ResolverType,
  defaultValues: {
    courseId,
    title: module?.title ?? "",
    orderIndex: module?.orderIndex ?? 0,
    duration: module?.duration ?? null,
    description: module?.description ?? null,
    steps: module?.steps as any ?? [],
    tools: module?.tools 
      ? { 
          title: module.tools.title ?? "", 
          content: module.tools.content ?? [] 
        }
      : null
  }
});

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray<
    ModuleFormValues,
    //@ts-ignore
    "steps"
  >({
    control: form.control,
    name: "steps",
  });

  const { fields: contentFields, append: appendContent, remove: removeContent } = useFieldArray<
    ModuleFormValues,
    "tools.content"
  >({
    //@ts-ignore
    control: form.control,
    name: "tools.content",
  });

  const onSubmit: SubmitHandler<ModuleFormValues> = async (data) => {
    try {
      const payload = {
        courseId: data.courseId,
        title: data.title,
        orderIndex: data.orderIndex,
        description: data.description,
        duration: data.duration,
        steps: data.steps?.filter(step => step.trim() !== '') ?? [],
        tools:
          data.tools &&
          data.tools.content.length > 0 &&
          data.tools.title
            ? { title: data.tools.title, content: data.tools.content }
            : null

      };

      if (module) {
        await updateModule({
          id: module.id,
          data: payload,
        });
        toast.success(`Module "${data.title}" mis à jour`);
      } else {
        await createModule({
          courseId,
          data: payload,
        });
        toast.success(`Module "${data.title}" créé`);
      }
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Durée (heures)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Ex: 2"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                        aria-label="Durée du module"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
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

          <div className="space-y-2 rounded-lg border bg-card p-4">
            <FormLabel className="text-sm font-medium flex items-center gap-2">
              Stack technique
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground text-xs cursor-help">
                    (Technologies utilisées dans la section)
                  </span>
                </TooltipTrigger>
                <TooltipContent>Ajoutez des technologies avec leurs noms et images</TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormField
              name="tools.title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Titre du stack technique..."
                      {...field}
                      value={field.value ?? ""}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                      aria-label="Titre du stack technique"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel className="text-sm font-medium">Technologies</FormLabel>
              <AnimatePresence>
                {contentFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2"
                  >
                    <FormField
                      name={`tools.content.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={`Nom de la technologie ${index + 1}...`}
                              {...field}
                              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                              aria-label={`Nom de la technologie ${index + 1}`}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-destructive" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`tools.content.${index}.src`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={`Chemin de l'image ${index + 1}...`}
                              {...field}
                              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                              aria-label={`Chemin de l'image ${index + 1}`}
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
                          className="text-destructive hover:text-destructive/80 md:col-span-2 justify-self-end"
                          onClick={() => removeContent(index)}
                          aria-label={`Supprimer la technologie ${index + 1}`}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Supprimer cette technologie</TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 flex items-center gap-2"
                onClick={() => appendContent({ src: "", name: "" })}
                aria-label="Ajouter une technologie"
              >
                <Plus className="h-4 w-4" />
                Ajouter une technologie
              </Button>
            </div>
          </div>

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