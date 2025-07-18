"use client";

import { z } from "zod";
import * as React from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, X } from "lucide-react";
import { CourseTab } from "@/lib/db/schema";
import { NewCourseTabSchema } from "@/lib/validations/courseTabs";
import { useCourseTabs } from "../hooks/useTabs";

// Type pour les données du formulaire (sans les champs techniques)
type TabFormValues = Omit<z.infer<typeof NewCourseTabSchema>, "id" | "createdAt">;

type TabFormProps = {
  tab?: CourseTab | null;
  courseId: number;
  onSuccess: () => void;
  onCancel: () => void;
};

export function TabForm({ tab, courseId, onSuccess, onCancel }: TabFormProps) {
  const { createTab, updateTab } = useCourseTabs({ courseId });

  const form = useForm<TabFormValues>({
    resolver: zodResolver(NewCourseTabSchema),
    defaultValues: {
      courseId,
      key: tab?.key ?? "",
      title: tab?.title ?? "",
      isActive: tab?.isActive ?? false,
      orderIndex: tab?.orderIndex ?? 0,
    },
  });

  const onSubmit = async (formData: TabFormValues) => {
    try {
      const payload = {
        courseId: formData.courseId,
        key: formData.key,
        title: formData.title,
        isActive: formData.isActive ?? null,
        orderIndex: Number(formData.orderIndex),
      };

      if (tab) {
        await updateTab({ courseId, id: tab.id, data: payload });
        toast.success(`Onglet "${formData.title}" mis à jour`);
      } else {
        await createTab({ courseId, data: payload });
        toast.success(`Onglet "${formData.title}" créé`);
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
                <Input placeholder="Titre de l'onglet..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clé*</FormLabel>
              <FormControl>
                <Input placeholder="onglet-introduction" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Actif</FormLabel>
                  <FormMessage />
                </div>
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
            {tab ? "Enregistrer" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
