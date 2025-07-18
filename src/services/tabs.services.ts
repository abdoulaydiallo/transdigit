// /services/tabs.services.ts
import { db } from "@/lib/db";
import { 
  courses, 
  courseTabs, 
  CourseTab,
  NewCourseTab} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";

export interface CourseTabFilters {
  isActive?: boolean;
  key?: string;
}

export interface CourseTabPagination {
  page: number;
  per_page: number;
}

export interface CourseTabSearchResult {
  tabs: CourseTab[];
  total: number;
  page: number;
  total_pages: number;
}

// Vérifier l'existence d'un cours
const checkCourseExists = async (courseId: number): Promise<void> => {
  const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
  if (!course) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, `Cours avec l'ID ${courseId} non trouvé`);
  }
};

// Create a course tab
export const createCourseTab = async (tabData: NewCourseTab): Promise<CourseTab> => {
  try {
    if (!tabData.title || !tabData.key || tabData.orderIndex === undefined || tabData.courseId === undefined) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Les champs obligatoires (courseId, title, key, orderIndex) sont requis'
      );
    }

    // Vérifier que le cours existe
    await checkCourseExists(tabData.courseId!);

    const [newTab] = await db.insert(courseTabs)
      .values(tabData)
      .returning({
        id: courseTabs.id,
        courseId: courseTabs.courseId,
        title: courseTabs.title,
        key: courseTabs.key,
        orderIndex: courseTabs.orderIndex,
        isActive: courseTabs.isActive,
        createdAt: courseTabs.createdAt
      });

    if (!newTab) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création de l\'onglet');
    }

    return newTab;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la création de l\'onglet',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get course tabs for a course
export const getCourseTabs = async (
  courseId: number,
  filters: CourseTabFilters = {},
  pagination: CourseTabPagination = { page: 1, per_page: 10 }
): Promise<CourseTabSearchResult> => {
  try {
    if (isNaN(courseId) || courseId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de cours invalide');
    }

    // Vérifier que le cours existe
    await checkCourseExists(courseId);

    let query = db.select().from(courseTabs).where(eq(courseTabs.courseId, courseId)).$dynamic();

    // Apply filters
    if (filters.isActive !== undefined) { query = query.where(eq(courseTabs.isActive, filters.isActive)); }
    if (filters.key?.trim()) { query = query.where(eq(courseTabs.key, filters.key)); }

    // Count total for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(courseTabs)
      .where(eq(courseTabs.courseId, courseId));
    const total = Number(count);

    // Apply pagination
    const offset = (pagination.page - 1) * pagination.per_page;
    query = query.limit(pagination.per_page).offset(offset).orderBy(courseTabs.orderIndex);

    const result = await query;
    const total_pages = Math.ceil(total / pagination.per_page);

    return {
      tabs: result,
      total,
      page: pagination.page,
      total_pages,
    };
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération des onglets',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get a course tab by ID
export const getCourseTabById = async (id: number): Promise<CourseTab> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'onglet invalide');
    }

    const [tab] = await db.select().from(courseTabs).where(eq(courseTabs.id, id));
    if (!tab) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Onglet avec l'ID ${id} non trouvé`);
    }

    return tab;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération de l\'onglet',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a course tab
export const updateCourseTab = async (id: number, updateData: Partial<NewCourseTab>): Promise<CourseTab> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'onglet invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    if (updateData.courseId) {
      await checkCourseExists(updateData.courseId);
    }

    const [updatedTab] = await db
      .update(courseTabs)
      .set(updateData)
      .where(eq(courseTabs.id, id))
      .returning({
        id: courseTabs.id,
        courseId: courseTabs.courseId,
        title: courseTabs.title,
        key: courseTabs.key,
        orderIndex: courseTabs.orderIndex,
        isActive: courseTabs.isActive,
        createdAt: courseTabs.createdAt
      });

    if (!updatedTab) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Onglet avec l'ID ${id} non trouvé`);
    }

    return updatedTab;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour de l\'onglet',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a course tab
export const deleteCourseTab = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'onglet invalide');
    }

    const [deletedTab] = await db.delete(courseTabs)
      .where(eq(courseTabs.id, id))
      .returning({ id: courseTabs.id });

    if (!deletedTab) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Onglet avec l'ID ${id} non trouvé`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression de l\'onglet',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};