"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewCourse, Course } from "@/lib/db/schema";
import { NewCourseSchema } from "@/lib/zodSchemas";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useCourses } from "../hooks/useCourses";
import { toast } from "sonner";

type CourseFormProps = {
  course?: Course | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
  const { createCourse, updateCourse } = useCourses();

  const form = useForm({
    resolver: zodResolver(NewCourseSchema),
    defaultValues: course
      ? {
          key: course.key,
          title: course.title,
          description: course.description ?? null,
          imageSrc: course.imageSrc ?? null,
          duration: course.duration ?? null,
          totalHours: course.totalHours ?? null,
          isActive: course.isActive ?? true,
        }
      : {
          key: "",
          title: "",
          description: null,
          imageSrc: null,
          duration: null,
          totalHours: null,
          isActive: true,
        },
  });

  React.useEffect(() => {
    if (course) {
      form.reset({
        key: course.key,
        title: course.title,
        description: course.description ?? null,
        imageSrc: course.imageSrc ?? null,
        duration: course.duration ?? null,
        totalHours: course.totalHours ?? null,
        isActive: course.isActive ?? true,
      });
    } else {
      form.reset();
    }
  }, [course, form]);

  const onSubmit = async (data: NewCourse) => {
    try {
      if (course) {
        await updateCourse({ id: course.id, data });
        toast.success(`Le cours "${data.title}" a été modifié avec succès.`);
      } else {
        await createCourse(data);
        toast.success(`Le cours "${data.title}" a été créé avec succès.`);
      }
      onSuccess();
    } catch {
      toast.error("Erreur lors de la sauvegarde du cours");
      form.setError("root", { message: "Erreur lors de la sauvegarde du cours" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clé</FormLabel>
              <FormControl>
                <Input placeholder="ex: react-intro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="ex: Introduction à React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez le cours..."
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="imageSrc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l&apos;image</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: https://example.com/image.jpg"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: 4 semaines"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="totalHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heures totales</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ex: 20"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <FormField
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium">Actif</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}
        <div className="flex gap-4">
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {course ? "Modifier" : "Créer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  );
}
