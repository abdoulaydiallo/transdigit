
//services/lessons.service.ts
import { eq, sql } from "drizzle-orm";
import { courseModules, lessons } from "@/lib/db/schema";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { NewLessonSchema, UpdateLessonSchema, TiptapJsonContentSchema, Lesson } from "@/lib/validations/courseLessons";
import { z } from "zod";
import { db } from "@/lib/db";

export interface LessonFilters {
  isActive?: boolean;
  type?: string;
  difficulty?: string;
  title?: string;
}

export interface LessonPagination {
  page: number;
  per_page: number;
}

export interface LessonSearchResult {
  lessons: Lesson[];
  total: number;
  page: number;
  total_pages: number;
}

export class LessonService {
  // Vérifier l'existence d'un module
  private static async checkModuleExists(moduleId: number): Promise<void> {
    const [module] = await db.select().from(courseModules).where(eq(courseModules.id, moduleId));
    if (!module) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Module avec l'ID ${moduleId} non trouvé`);
    }
  }

  // Créer une leçon
  static async create(lessonData: z.infer<typeof NewLessonSchema>): Promise<Lesson> {
    try {
      await this.checkModuleExists(lessonData.moduleId);
      
      const validatedContent = TiptapJsonContentSchema.parse(lessonData.content);
      
      const [newLesson] = await db
        .insert(lessons)
        .values({
          ...lessonData,
          content: validatedContent,
          updatedAt: new Date(),
        })
        .returning();
      
      if (!newLesson) {
        throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création de la leçon');
      }
      
      return {
        ...newLesson,
        content: TiptapJsonContentSchema.parse(newLesson.content),
      } as Lesson;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      if (error instanceof z.ZodError) {
        throw new ServiceError(
          ERROR_CODES.VALIDATION_ERROR,
          'Format du contenu JSON invalide',
          { originalError: error.message }
        );
      }
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la création de la leçon',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  // Récupérer les leçons d'un module
  static async findByModule(
    moduleId: number,
    filters: LessonFilters = {},
    pagination: LessonPagination = { page: 1, per_page: 10 }
  ): Promise<LessonSearchResult> {
    try {
      await this.checkModuleExists(moduleId);
      
      let query = db.select().from(lessons).where(eq(lessons.moduleId, moduleId)).$dynamic();
      
      // Appliquer les filtres
      if (filters.isActive !== undefined) {
        query = query.where(eq(lessons.isActive, filters.isActive));
      }
      if (filters.type?.trim()) {
        query = query.where(eq(lessons.type, filters.type as any));
      }
      if (filters.difficulty?.trim()) {
        query = query.where(eq(lessons.difficulty, filters.difficulty as any));
      }
      if (filters.title?.trim()) {
        query = query.where(sql`LOWER(${lessons.title}) LIKE ${'%' + filters.title.toLowerCase() + '%'}`);
      }
      
      // Compter le total
      const [{ count }] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(lessons)
        .where(eq(lessons.moduleId, moduleId));
      
      const total = Number(count);
      const offset = (pagination.page - 1) * pagination.per_page;
      
      query = query.limit(pagination.per_page).offset(offset).orderBy(lessons.orderIndex);
      const result = await query;
      
      // Valider et transformer chaque leçon
      const validatedLessons: Lesson[] = result.map((lesson) => ({
        ...lesson,
        content: TiptapJsonContentSchema.parse(lesson.content),
      }));
      
      const total_pages = Math.ceil(total / pagination.per_page);
      
      return {
        lessons: validatedLessons,
        total,
        page: pagination.page,
        total_pages,
      };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      if (error instanceof z.ZodError) {
        throw new ServiceError(
          ERROR_CODES.VALIDATION_ERROR,
          'Format du contenu JSON invalide dans les leçons récupérées',
          { originalError: error.message }
        );
      }
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la récupération des leçons',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  // Récupérer une leçon par ID
  static async findById(id: number): Promise<Lesson> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de leçon invalide');
      }

      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
      if (!lesson) {
        throw new ServiceError(ERROR_CODES.NOT_FOUND, `Leçon avec l'ID ${id} non trouvée`);
      }

      return {
        ...lesson,
        content: TiptapJsonContentSchema.parse(lesson.content),
      } as Lesson;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      if (error instanceof z.ZodError) {
        throw new ServiceError(
          ERROR_CODES.VALIDATION_ERROR,
          'Format du contenu JSON invalide',
          { originalError: error.message }
        );
      }
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la récupération de la leçon',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  // Mettre à jour une leçon
  static async update(id: number, updateData: Partial<z.infer<typeof UpdateLessonSchema>>): Promise<Lesson> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de leçon invalide');
      }
      if (Object.keys(updateData).length === 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
      }

      if (updateData.moduleId) {
        await this.checkModuleExists(updateData.moduleId);
      }

      const [updatedLesson] = await db
        .update(lessons)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(lessons.id, id))
        .returning();

      if (!updatedLesson) {
        throw new ServiceError(ERROR_CODES.NOT_FOUND, `Leçon avec l'ID ${id} non trouvée`);
      }

      return {
        ...updatedLesson,
        content: TiptapJsonContentSchema.parse(updatedLesson.content),
      } as Lesson;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      if (error instanceof z.ZodError) {
        throw new ServiceError(
          ERROR_CODES.VALIDATION_ERROR,
          'Format du contenu JSON invalide',
          { originalError: error.message }
        );
      }
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la mise à jour de la leçon',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  // Supprimer une leçon
  static async delete(id: number): Promise<void> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de leçon invalide');
      }

      const [deletedLesson] = await db.delete(lessons)
        .where(eq(lessons.id, id))
        .returning({ id: lessons.id });

      if (!deletedLesson) {
        throw new ServiceError(ERROR_CODES.NOT_FOUND, `Leçon avec l'ID ${id} non trouvée`);
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        ERROR_CODES.DATABASE_ERROR,
        'Erreur lors de la suppression de la leçon',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }
}