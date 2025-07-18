"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Save, X, Plus, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CourseSection } from "@/lib/db/schema";
import { NewCourseSectionSchema, SectionFormValues } from "@/lib/validations/courseSections";
import { useCourseSections } from "../hooks/useCourseSections";
import { useCourseTabs } from "@/features/tabs/hooks/useTabs";
import { motion, AnimatePresence } from "framer-motion";

type SectionFormProps = {
  section?: CourseSection | null;
  courseId: number;
  tabKey?: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export function SectionForm({ section, courseId, tabKey, onSuccess, onCancel }: SectionFormProps) {
  const { createSection, updateSection } = useCourseSections({ courseId });
  const { tabs } = useCourseTabs({ courseId });

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(NewCourseSectionSchema),
    defaultValues: {
      courseId,
      tabKey: section?.tabKey ?? tabKey ?? "",
      title: section?.title ?? "",
      subtitle: section?.subtitle ?? "",
      description: section?.description ?? "",
      items: section?.items as [string] ?? [],
      children: section?.children ?? { title: "", content: [] },
    },
  });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray<
    SectionFormValues,
    //@ts-ignore
    "items"
  >({
    control: form.control,
    name: "items",
  });

  const { fields: contentFields, append: appendContent, remove: removeContent } = useFieldArray<
    SectionFormValues,
    "children.content"
  >({
    control: form.control,
    name: "children.content",
  });

  const onSubmit = async (formData: SectionFormValues) => {
    try {
      const payload = {
        courseId: formData.courseId,
        tabKey: formData.tabKey,
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        items: formData.items || null,
        children: formData.children || null,
      };

      if (section) {
        await updateSection({ courseId, id: section.id, data: payload });
        toast.success(`Section "${formData.title}" mise à jour`);
      } else {
        await createSection({ courseId, data: payload });
        toast.success(`Section "${formData.title}" créée`);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne 1: Clé de l'onglet et Titre */}
            <div className="space-y-4">
              <FormField
                name="tabKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Clé de l'onglet*</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                        aria-label="Sélectionner un onglet"
                      >
                        <option value="">Sélectionner un onglet</option>
                        {tabs?.map((tab) => (
                          <option key={tab.key} value={tab.key}>
                            {tab.title} ({tab.key})
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
              
            </div>

            {/* Colonne 2: Sous-titre et Description */}
            <div className="space-y-4">
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Titre*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le titre de la section..."
                        {...field}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                        aria-label="Titre de la section"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
              </div>
              
          {/* Colonne 3: sous-titre*/}
          <div>
            <FormField
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Sous-titre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le sous-titre de la section..."
                        {...field}
                        value={field.value ?? ""}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                        aria-label="Sous-titre de la section"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              
              />
            </div>
          </div>

          <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le contenu de la section..."
                        {...field}
                        value={field.value ?? ""}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary min-h-[100px]"
                        aria-label="Description de la section"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />

          {/* Éléments */}
          <div className="space-y-2 rounded-lg border bg-card p-4">
            <FormLabel className="text-sm font-medium flex items-center gap-2">
              Éléments
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground text-xs cursor-help">
                    (Liste des éléments associés à la section)
                  </span>
                </TooltipTrigger>
                <TooltipContent>Ajoutez des éléments textuels pour cette section</TooltipContent>
              </Tooltip>
            </FormLabel>
            <AnimatePresence>
              {itemFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <FormField
                    name={`items.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={`Élément ${index + 1}...`}
                            {...field}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            aria-label={`Élément ${index + 1}`}
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
                        onClick={() => removeItem(index)}
                        aria-label={`Supprimer l'élément ${index + 1}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Supprimer cet élément</TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 flex items-center gap-2"
              onClick={() => appendItem("")}
            >
              <Plus className="h-4 w-4" />
              Ajouter un élément
            </Button>
          </div>

          {/* Stack technique */}
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
              name="children.title"
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
                      name={`children.content.${index}.name`}
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
                      name={`children.content.${index}.src`}
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
              >
                <Plus className="h-4 w-4" />
                Ajouter une technologie
              </Button>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 justify-end">
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
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={form.formState.isSubmitting}
              aria-label={section ? "Enregistrer les modifications" : "Créer la section"}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {section ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}