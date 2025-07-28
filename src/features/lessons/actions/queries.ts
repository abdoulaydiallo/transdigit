import { getLessons, getLessonById, LessonFilters, LessonPagination, LessonSearchResult } from "@/services/lessons.service";
import { Lesson } from "@/lib/db/schema";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { courseModules } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

// Vérifier l'existence d'un module
export async function checkModuleExists(moduleId: number): Promise<void> {
  try {
    const [module] = await db.select().from(courseModules).where(eq(courseModules.id, moduleId));
    if (!module) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Module avec l'ID ${moduleId} non trouvé`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      "Erreur lors de la vérification du module",
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}

// Récupérer toutes les leçons d'un module pour le rendu côté serveur
export async function getServerSideLessons(
  moduleId: number,
  filters: LessonFilters = {},
  pagination: LessonPagination = { page: 1, per_page: 10 }
): Promise<LessonSearchResult> {
  try {
    if (isNaN(moduleId) || moduleId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de module invalide");
    }

    await checkModuleExists(moduleId);

    const result = await getLessons(moduleId, filters, pagination);
    return result;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Erreur lors de la récupération des leçons côté serveur",
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}

// Récupérer une leçon spécifique par ID pour le rendu côté serveur
export async function getServerSideLessonById(id: number, moduleId: number): Promise<Lesson> {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de leçon invalide");
    }
    if (isNaN(moduleId) || moduleId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de module invalide");
    }

    await checkModuleExists(moduleId);

    const lesson = await getLessonById(id);
    if (lesson.moduleId !== moduleId) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        "La leçon n'appartient pas au module spécifié"
      );
    }

    return lesson;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Erreur lors de la récupération de la leçon côté serveur",
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}