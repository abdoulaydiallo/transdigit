// server/trpc/exercise.router.ts
import { initTRPC } from "@trpc/server";
import { ExerciseService } from "@/services/exercise.service";
import { NewExerciseSchema, UpdateExerciseSchema } from "@/lib/validations/exercise.schema";
import { z } from "zod";

const t = initTRPC.create();

export const exerciseRouter = t.router({
  // GET /exercises/by-module?moduleId=1
  byModule: t.procedure
    .input(z.object({ 
      moduleId: z.number().int().positive(),
      isActive: z.boolean().optional(),
      type: z.enum(["projet", "quiz", "tache"]).optional(),
      difficulty: z.enum(["facile", "moyen", "difficile"]).optional(),
      search: z.string().optional(),
      page: z.number().int().positive().default(1),
      per_page: z.number().int().positive().default(10),
    }))
    .query(async ({ input }) => {
      const { moduleId, page, per_page, ...filters } = input;
      return ExerciseService.findByModule(moduleId, filters, { page, per_page });
    }),

  // GET /exercises/by-id?id=1
  byId: t.procedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return ExerciseService.findById(input.id);
    }),

  // POST /exercises/create
  create: t.procedure
    .input(NewExerciseSchema)
    .mutation(async ({ input }) => {
      return ExerciseService.create(input);
    }),

  // PUT /exercises/update
  update: t.procedure
    .input(z.object({
      id: z.number().int().positive(),
      data: UpdateExerciseSchema,
    }))
    .mutation(async ({ input }) => {
      return ExerciseService.update(input.id, input.data);
    }),

  // DELETE /exercises/delete
  delete: t.procedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return ExerciseService.delete(input.id);
    }),
});