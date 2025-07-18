import { db } from '@/lib/db';
import { courseSections, courses, courseTabs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { ServiceError, ERROR_CODES } from '@/services/services.errors';
import type { CourseSection, NewCourseSection } from '@/lib/db/schema';

// Vérifie l'existence d'un cours
const checkCourseExists = async (courseId: number): Promise<void> => {
  const course = await db.select().from(courses).where(eq(courses.id, courseId));
  if (!course[0]) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, `Cours avec l'ID ${courseId} non trouvé`);
  }
};

// Vérifie l'existence d'un onglet
const checkTabExists = async (courseId: number, tabKey: string): Promise<void> => {
  const tab = await db
    .select()
    .from(courseTabs)
    .where(and(eq(courseTabs.courseId, courseId), eq(courseTabs.key, tabKey)));
  if (!tab[0]) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, `Onglet avec la clé ${tabKey} non trouvé pour le cours ${courseId}`);
  }
};

// Récupérer une section par ID
export const getCourseSectionById = async (id: number): Promise<CourseSection> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de section invalide');
    }
    const section = await db.select().from(courseSections).where(eq(courseSections.id, id));
    if (!section[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Section avec l'ID ${id} non trouvée`);
    }
    return section[0];
  } catch (error) {
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération de la section',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Récupérer les sections d'un cours
export const getCourseSections = async (courseId: number): Promise<CourseSection[]> => {
  try {
    if (isNaN(courseId) || courseId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de cours invalide');
    }
    await checkCourseExists(courseId);
    const sections = await db
      .select()
      .from(courseSections)
      .where(eq(courseSections.courseId, courseId))
    return sections;
  } catch (error) {
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération des sections',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Créer une nouvelle section
export const createCourseSection = async (sectionData: NewCourseSection): Promise<CourseSection> => {
  try {
    if (!sectionData.courseId || !sectionData.tabKey || !sectionData.title) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Les champs obligatoires (courseId, tabKey, title) sont requis'
      );
    }
    await checkCourseExists(sectionData.courseId);
    await checkTabExists(sectionData.courseId, sectionData.tabKey);
    const newSection = await db.insert(courseSections).values(sectionData).returning();
    if (!newSection[0]) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création de la section');
    }
    return newSection[0];
  } catch (error) {
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la création de la section',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Mettre à jour une section
export const updateCourseSection = async (
  id: number,
  sectionData: Partial<NewCourseSection>
): Promise<CourseSection> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de section invalide');
    }
    if (sectionData.courseId) {
      await checkCourseExists(sectionData.courseId);
    }
    if (sectionData.tabKey && sectionData.courseId) {
      await checkTabExists(sectionData.courseId, sectionData.tabKey);
    }
    const updatedSection = await db
      .update(courseSections)
      .set({ ...sectionData, updatedAt: new Date() })
      .where(eq(courseSections.id, id))
      .returning();
    if (!updatedSection[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Section avec l'ID ${id} non trouvée`);
    }
    return updatedSection[0];
  } catch (error) {
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour de la section',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Supprimer une section
export const deleteCourseSection = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de section invalide');
    }
    const deleted = await db.delete(courseSections).where(eq(courseSections.id, id)).returning();
    if (!deleted[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Section avec l'ID ${id} non trouvée`);
    }
  } catch (error) {
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression de la section',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};