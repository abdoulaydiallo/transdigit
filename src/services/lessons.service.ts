import { db } from "@/lib/db";
import { courseModules, lessons, NewLesson } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { Lesson, TiptapJsonContentSchema } from "@/lib/validations/courseLessons";
import { z } from "zod";

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

// Vérifier l'existence d'un module
const checkModuleExists = async (moduleId: number): Promise<void> => {
  const [module] = await db.select().from(courseModules).where(eq(courseModules.id, moduleId));
  if (!module) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, `Module avec l'ID ${moduleId} non trouvé`);
  }
};

// Créer une leçon
export const createLesson = async (lessonData: NewLesson): Promise<Lesson> => {
  try {
    if (!lessonData.title || lessonData.orderIndex === undefined || lessonData.moduleId === undefined) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Les champs obligatoires (moduleId, title, orderIndex) sont requis'
      );
    }

    await checkModuleExists(lessonData.moduleId);

    // Valider le champ content avec Zod avant l'insertion
    const validatedContent = TiptapJsonContentSchema.parse(lessonData.content);

    const [newLesson] = await db
      .insert(lessons)
      .values({
        ...lessonData,
        content: validatedContent, // Utiliser le contenu validé
        updatedAt: new Date(),
      })
      .returning();

    if (!newLesson) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création de la leçon');
    }

    // Valider le contenu retourné pour s'assurer qu'il correspond au type Lesson
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
};

// Récupérer les leçons d'un module
export const getLessons = async (
  moduleId: number,
  filters: LessonFilters = {},
  pagination: LessonPagination = { page: 1, per_page: 10 }
): Promise<LessonSearchResult> => {
  try {
    if (isNaN(moduleId) || moduleId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de module invalide');
    }

    await checkModuleExists(moduleId);

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

    // Compter le total pour la pagination
    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId));
    const total = Number(count);

    // Appliquer la pagination
    const offset = (pagination.page - 1) * pagination.per_page;
    query = query.limit(pagination.per_page).offset(offset).orderBy(lessons.orderIndex);

    const result = await query;

    // Valider et transformer chaque leçon pour garantir le type Lesson
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
};

// Récupérer une leçon par ID
export const getLessonById = async (id: number): Promise<Lesson> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de leçon invalide');
    }

    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    if (!lesson) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Leçon avec l'ID ${id} non trouvée`);
    }

    // Valider le contenu pour garantir le type Lesson
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
};

// Mettre à jour une leçon
export const updateLesson = async (id: number, updateData: Partial<NewLesson>): Promise<Lesson> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de leçon invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    if (updateData.moduleId) {
      await checkModuleExists(updateData.moduleId);
    }

    

    const [updatedLesson] = await db
      .update(lessons)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(lessons.id, id))
      .returning();

    if (!updatedLesson) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Leçon avec l'ID ${id} non trouvée`);
    }

    // Valider le contenu retourné
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
};

// Supprimer une leçon
export const deleteLesson = async (id: number): Promise<void> => {
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
};