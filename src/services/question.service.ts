// server/services/question.service.ts
import { db } from "@/lib/db";
import { questions, lessons, Question } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { NewQuestionSchema, UpdateQuestionSchema } from "@/lib/validations/questions.schema";
import { z } from "zod";

export interface QuestionFilters {
  isActive?: boolean;
  type?: "choix_multiple" | "texte_libre" | "vrai_faux";
  difficulty?: "facile" | "moyen" | "difficile";
  lessonId?: number;
  search?: string;
}

export interface QuestionPagination {
  page: number;
  per_page: number;
}

export interface QuestionSearchResult {
  questions: Question[];
  total: number;
  page: number;
  total_pages: number;
}

export class QuestionService {
  // Vérifier l'existence d'une leçon
  private static async checkLessonExists(lessonId: number): Promise<void> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId));
    if (!lesson) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Leçon avec l'ID ${lessonId} non trouvée`);
    }
  }

  // Créer une question
  static async create(questionData: z.infer<typeof NewQuestionSchema>): Promise<Question> {
    try {
      //await this.checkLessonExists(questionData.lessonId);
      
      const [newQuestion] = await db
        .insert(questions)
        .values({
          ...questionData,
          updatedAt: new Date(),
        })
        .returning();
      
      if (!newQuestion) {
        throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création de la question');
      }
      
      return newQuestion;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      if (error instanceof z.ZodError) {
        throw new ServiceError(
          ERROR_CODES.VALIDATION_ERROR,
          'Format des données invalide',
          { originalError: error.message }
        );
      }
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la création de la question',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  // Récupérer les questions d'une leçon
  static async findByLesson(
    lessonId: number,
    filters: QuestionFilters = {},
    pagination: QuestionPagination = { page: 1, per_page: 10 }
  ): Promise<QuestionSearchResult> {
    try {
     // await this.checkLessonExists(lessonId);
      
      let query = db.select().from(questions).where(eq(questions.lessonId, lessonId)).$dynamic();
      
      // Appliquer les filtres
      if (filters.isActive !== undefined) {
        query = query.where(eq(questions.isActive, filters.isActive));
      }
      if (filters.type) {
        query = query.where(eq(questions.type, filters.type));
      }
      if (filters.difficulty) {
        query = query.where(eq(questions.difficulty, filters.difficulty));
      }
      if (filters.search?.trim()) {
        query = query.where(sql`LOWER(${questions.questionText}) LIKE ${'%' + filters.search.toLowerCase() + '%'}`);
      }
      
      // Compter le total
      const [{ count }] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(questions)
        .where(eq(questions.lessonId, lessonId));
      
      const total = Number(count);
      const offset = (pagination.page - 1) * pagination.per_page;
      
      query = query.limit(pagination.per_page).offset(offset).orderBy(questions.orderIndex);
      const result = await query;
      
      return {
        questions: result,
        total,
        page: pagination.page,
        total_pages: Math.ceil(total / pagination.per_page),
      };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la récupération des questions',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  // Récupérer une question par ID
  static async findById(id: number): Promise<Question> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de question invalide');
      }

      const [question] = await db.select().from(questions).where(eq(questions.id, id));
      if (!question) {
        throw new ServiceError(ERROR_CODES.NOT_FOUND, `Question avec l'ID ${id} non trouvée`);
      }

      return question;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la récupération de la question',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  // Mettre à jour une question
  static async update(id: number, updateData: Partial<z.infer<typeof UpdateQuestionSchema>>): Promise<Question> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de question invalide');
      }
      if (Object.keys(updateData).length === 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
      }

      if (updateData.lessonId) {
        await this.checkLessonExists(updateData.lessonId);
      }

      const [updatedQuestion] = await db
        .update(questions)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(questions.id, id))
        .returning();

      if (!updatedQuestion) {
        throw new ServiceError(ERROR_CODES.NOT_FOUND, `Question avec l'ID ${id} non trouvée`);
      }

      return updatedQuestion;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la mise à jour de la question',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  // Supprimer une question
  static async delete(id: number): Promise<void> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de question invalide');
      }

      const [deletedQuestion] = await db.delete(questions)
        .where(eq(questions.id, id))
        .returning({ id: questions.id });

      if (!deletedQuestion) {
        throw new ServiceError(ERROR_CODES.NOT_FOUND, `Question avec l'ID ${id} non trouvée`);
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la suppression de la question',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }
}