import { z } from "zod";

// Schéma pour la structure de children.content
const ContentItemSchema = z.object({
  src: z.string().min(1, "Le chemin de l'image est requis"),
  name: z.string().min(1, "Le nom de la technologie est requis"),
});

// Schéma pour la structure de children
const ChildrenSchema = z.object({
  title: z.string().min(1, "Le titre de children est requis"),
  content: z.array(ContentItemSchema).optional(),
}).optional().nullable();

// Schéma pour la création d'une section (POST)
export const NewCourseSectionSchema = z.object({
  courseId: z.number(),
  tabKey: z.string().min(1, { message: "Tab key is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  items: z.array(z.string()).optional().nullable(),
  children: z
    .object({
      title: z.string().optional().nullable(),
      content: z
        .array(
          z.object({
            src: z.string().min(1, { message: "Source is required" }),
            name: z.string().min(1, { message: "Name is required" }),
          })
        )
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

// Schéma pour la mise à jour d'une section (PUT)
export const UpdateCourseSectionSchema = z.object({
  courseId: z.number().int().positive().optional(),
  tabKey: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(255).optional(),
  subtitle: z.string().max(500).optional(),
  description: z.string().optional(),
  items: z.array(z.string().min(1)).optional().nullable(),
  children: ChildrenSchema,
  orderIndex: z.number().int().min(0).optional(),
}).partial();

export type SectionFormValues = z.infer<typeof NewCourseSectionSchema>;
export type UpdateSectionFormValues = z.infer<typeof UpdateCourseSectionSchema>;