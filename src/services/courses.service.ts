import { db } from "@/lib/db";
import { 
  courses, 
  courseTabs, 
  courseSections, 
  courseModules,  
  Course,
  NewCourse,
  CourseTab,
  NewCourseTab,
  CourseSection,
  NewCourseSection,
  CourseModule,
  NewCourseModule,
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";

export interface CourseFilters {
  isActive?: boolean;
  title?: string;
}

export interface CoursePagination {
  page: number;
  per_page: number;
}

export interface CourseSearchResult {
  courses: Course[];
  total: number;
  page: number;
  total_pages: number;
}

// Create a new course
export const createCourse = async (courseData: NewCourse): Promise<Course> => {
  try {
    if (!courseData.title || !courseData.key) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Les champs obligatoires (title, key) sont requis'
      );
    }

    const newCourse = await db.insert(courses).values(courseData).returning();
    if (!newCourse[0]) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création du cours');
    }

    return newCourse[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la création du cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get a course by ID
export const getCourseById = async (id: number): Promise<Course> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de cours invalide');
    }

    const course = await db.select().from(courses).where(eq(courses.id, id));
    if (!course[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Cours avec l'ID ${id} non trouvé`);
    }

    return course[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération du cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a course
export const updateCourse = async (id: number, updateData: Partial<NewCourse>): Promise<Course> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de cours invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    const updatedCourse = await db
      .update(courses)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    if (!updatedCourse[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Cours avec l'ID ${id} non trouvé`);
    }

    return updatedCourse[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour du cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a course
export const deleteCourse = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de cours invalide');
    }

    const deletedCourse = await db.delete(courses).where(eq(courses.id, id)).returning();
    if (!deletedCourse[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Cours avec l'ID ${id} non trouvé`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression du cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get all courses with filters and pagination
export const getAllCourses = async (
  filters: CourseFilters = {},
  pagination: CoursePagination = { page: 1, per_page: 5 }
): Promise<CourseSearchResult> => {
  try {
    let query = db.select().from(courses);

    // Apply filters
    if (filters.isActive !== undefined) {
      query = query.where(eq(courses.isActive, filters.isActive)) as typeof query;
    }
    if (filters.title?.trim()) {
      query = query.where(eq(courses.title, filters.title)) as typeof query;
    }

    // Count total for pagination
    const totalResult = await db.select({ count: sql`COUNT(*)` }).from(courses);
    const total = Number(totalResult[0].count);

    // Apply pagination
    const offset = (pagination.page - 1) * pagination.per_page;
    query = query.limit(pagination.per_page).offset(offset) as typeof query;

    const result = await query;
    const total_pages = Math.ceil(total / pagination.per_page);

    return {
      courses: result,
      total,
      page: pagination.page,
      total_pages,
    };
  } catch (error) {
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération des cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Create a course tab
export const createCourseTab = async (tabData: NewCourseTab): Promise<CourseTab> => {
  try {
    if (!tabData.title || !tabData.key || !tabData.orderIndex) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Les champs obligatoires (title, key, orderIndex) sont requis'
      );
    }

    const newTab = await db.insert(courseTabs).values(tabData).returning();
    if (!newTab[0]) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création de l\'onglet');
    }

    return newTab[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la création de l\'onglet',
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

    const tab = await db.select().from(courseTabs).where(eq(courseTabs.id, id));
    if (!tab[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Onglet avec l'ID ${id} non trouvé`);
    }

    return tab[0];
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

    const updatedTab = await db
      .update(courseTabs)
      .set({ ...updateData })
      .where(eq(courseTabs.id, id))
      .returning();
    if (!updatedTab[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Onglet avec l'ID ${id} non trouvé`);
    }

    return updatedTab[0];
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

    const deletedTab = await db.delete(courseTabs).where(eq(courseTabs.id, id)).returning();
    if (!deletedTab[0]) {
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

// Create a course section
export const createCourseSection = async (sectionData: NewCourseSection): Promise<CourseSection> => {
  try {
    if (!sectionData.courseId || !sectionData.tabKey || !sectionData.title) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Les champs obligatoires (courseId, tabKey, title) sont requis'
      );
    }

    const newSection = await db.insert(courseSections).values(sectionData).returning();
    if (!newSection[0]) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création de la section');
    }

    return newSection[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la création de la section',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get a course section by ID
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
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération de la section',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a course section
export const updateCourseSection = async (id: number, updateData: Partial<NewCourseSection>): Promise<CourseSection> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de section invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    const updatedSection = await db
      .update(courseSections)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(courseSections.id, id))
      .returning();
    if (!updatedSection[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Section avec l'ID ${id} non trouvée`);
    }

    return updatedSection[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour de la section',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a course section
export const deleteCourseSection = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de section invalide');
    }

    const deletedSection = await db.delete(courseSections).where(eq(courseSections.id, id)).returning();
    if (!deletedSection[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Section avec l'ID ${id} non trouvée`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression de la section',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Create a course module
export const createCourseModule = async (moduleData: NewCourseModule): Promise<CourseModule> => {
  try {
    if (!moduleData.courseId || !moduleData.title || !moduleData.orderIndex) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Les champs obligatoires (courseId, title, number, orderIndex) sont requis'
      );
    }

    const newModule = await db.insert(courseModules).values(moduleData).returning();
    if (!newModule[0]) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création du module');
    }

    return newModule[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la création du module',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get modules for a course
export const getCourseModules = async (courseId: number): Promise<CourseModule[]> => {
  try {
    if (isNaN(courseId) || courseId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de cours invalide');
    }

    const modules = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.orderIndex);
    
    return modules;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération des modules',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get a course module by ID
export const getCourseModuleById = async (id: number): Promise<CourseModule> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de module invalide');
    }

    const module = await db.select().from(courseModules).where(eq(courseModules.id, id));
    if (!module[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Module avec l'ID ${id} non trouvé`);
    }

    return module[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération du module',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a course module
export const updateCourseModule = async (id: number, updateData: Partial<NewCourseModule>): Promise<CourseModule> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de module invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    const updatedModule = await db
      .update(courseModules)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(courseModules.id, id))
      .returning();
    if (!updatedModule[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Module avec l'ID ${id} non trouvé`);
    }

    return updatedModule[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour du module',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a course module
export const deleteCourseModule = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de module invalide');
    }

    const deletedModule = await db.delete(courseModules).where(eq(courseModules.id, id)).returning();
    if (!deletedModule[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Module avec l'ID ${id} non trouvé`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression du module',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};
