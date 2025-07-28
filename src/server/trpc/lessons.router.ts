// server/trpc/lessons.router.ts
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { NewLessonSchema, UpdateLessonSchema } from "@/lib/validations/courseLessons";
import { LessonService } from "@/services/lessons.service"

const t = initTRPC.create();

export const lessonsRouter = t.router({
  byModule: t.procedure
    .input(z.object({ moduleId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return LessonService.findByModule(input.moduleId);
    }),

  byId: t.procedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return LessonService.findById(input.id);
    }),

  create: t.procedure
    .input(NewLessonSchema)
    .mutation(async ({ input }) => {
      return LessonService.create(input);
    }),

  update: t.procedure
    .input(z.object({
      id: z.number().int().positive(),
       UpdateLessonSchema,
    }))
    .mutation(async ({ input }) => {
      return LessonService.update(input.id, input.UpdateLessonSchema);
    }),

  delete: t.procedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return LessonService.delete(input.id);
    }),
});