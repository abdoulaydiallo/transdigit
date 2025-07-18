"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import { Save, X } from "lucide-react";
import { useModules } from "@/features/modules/hooks/useModules";
import { toast } from "sonner";
import { CourseModule } from "@/lib/db/schema";
import { NewCourseModuleSchema } from "@/lib/zodSchemas";
import { z } from "zod";

// Type pour les données du formulaire (sans les champs techniques)
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
      number: module?.number ?? 1,
      title: module?.title ?? "",
      orderIndex: module?.orderIndex ?? 0,
      description: module?.description ?? "",
      duration: module?.duration ?? "",
    },
  });

  const onSubmit = async (formData: ModuleFormValues) => {
    try {
      const payload = {
        courseId: formData.courseId,
        number: Number(formData.number),
        title: formData.title,
        orderIndex: Number(formData.orderIndex),
        description: formData.description || null,
        duration: formData.duration || null,
      };

      if (module) {
        await updateModule({ id: module.id, data: payload });
        toast.success(`Module "${formData.title}" mis à jour`);
      } else {
        await createModule({ 
          courseId, 
          data: payload 
        });
        toast.success(`Module "${formData.title}" créé`);
      }

      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Introduction au cours..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez le contenu du module..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2h30"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderIndex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordre*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Annuler
          </Button>
          
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={form.formState.isSubmitting}
          >
            <Save className="h-4 w-4" />
            {module ? "Enregistrer" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}