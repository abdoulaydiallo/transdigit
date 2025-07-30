// server/trpc/question.router.ts
import { initTRPC } from "@trpc/server";
import { QuestionService } from "@/services/question.service";
import { NewQuestionSchema, UpdateQuestionSchema } from "@/lib/validations/questions.schema";
import { z } from "zod";

const t = initTRPC.create();

export const questionsRouter = t.router({
  // GET /questions/by-lesson?lessonId=1
  byLesson: t.procedure
    .input(z.object({ 
      lessonId: z.number().int().positive(),
      isActive: z.boolean().optional(),
      type: z.enum(["choix_multiple", "texte_libre", "vrai_faux"]).optional(),
      difficulty: z.enum(["facile", "moyen", "difficile"]).optional(),
      search: z.string().optional(),
      page: z.number().int().positive().default(1),
      per_page: z.number().int().positive().default(10),
    }))
    .query(async ({ input }) => {
      const { lessonId, page, per_page, ...filters } = input;
      return QuestionService.findByLesson(lessonId, filters, { page, per_page });
    }),

  // GET /questions/by-id?id=1
  byId: t.procedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return QuestionService.findById(input.id);
    }),

  // POST /questions/create
  create: t.procedure
    .input(NewQuestionSchema)
    .mutation(async ({ input }) => {
      return QuestionService.create(input);
    }),

  // PUT /questions/update
  update: t.procedure
    .input(z.object({
      id: z.number().int().positive(),
       UpdateQuestionSchema,
    }))
    .mutation(async ({ input }) => {
      return QuestionService.update(input.id, input.UpdateQuestionSchema);
    }),

  // DELETE /questions/delete
  delete: t.procedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return QuestionService.delete(input.id);
    }),
});