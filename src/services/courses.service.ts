import { db } from "@/lib/db";
import { 
  courses, 
  courseTabs, 
  courseSections, 
  courseModules, 
  moduleSteps, 
  tools, 
  moduleTools, 
  courseTools, 
  partners, 
  coursePartners, 
  Course,
  NewCourse,
  CourseTab,
  NewCourseTab,
  CourseSection,
  NewCourseSection,
  CourseModule,
  NewCourseModule,
  ModuleStep,
  NewModuleStep,
  Tool,
  NewTool,
  Partner,
  NewPartner
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
  pagination: CoursePagination = { page: 1, per_page: 10 }
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
    if (!moduleData.courseId || !moduleData.title || !moduleData.number || !moduleData.orderIndex) {
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

// Create a module step
export const createModuleStep = async (stepData: NewModuleStep): Promise<ModuleStep> => {
  try {
    if (!stepData.moduleId || !stepData.title || !stepData.orderIndex) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Les champs obligatoires (moduleId, title, orderIndex) sont requis'
      );
    }

    const newStep = await db.insert(moduleSteps).values(stepData).returning();
    if (!newStep[0]) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création de l\'étape');
    }

    return newStep[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la création de l\'étape',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get a module step by ID
export const getModuleStepById = async (id: number): Promise<ModuleStep> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'étape invalide');
    }

    const step = await db.select().from(moduleSteps).where(eq(moduleSteps.id, id));
    if (!step[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Étape avec l'ID ${id} non trouvée`);
    }

    return step[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération de l\'étape',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a module step
export const updateModuleStep = async (id: number, updateData: Partial<NewModuleStep>): Promise<ModuleStep> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'étape invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    const updatedStep = await db
      .update(moduleSteps)
      .set({ ...updateData })
      .where(eq(moduleSteps.id, id))
      .returning();
    if (!updatedStep[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Étape avec l'ID ${id} non trouvée`);
    }

    return updatedStep[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour de l\'étape',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a module step
export const deleteModuleStep = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'étape invalide');
    }

    const deletedStep = await db.delete(moduleSteps).where(eq(moduleSteps.id, id)).returning();
    if (!deletedStep[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Étape avec l'ID ${id} non trouvée`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression de l\'étape',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Create a module tool association
export const createModuleTool = async (moduleId: number, toolId: number): Promise<void> => {
  try {
    if (isNaN(moduleId) || moduleId <= 0 || isNaN(toolId) || toolId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'IDs invalides');
    }

    await db.insert(moduleTools).values({ moduleId, toolId }).returning();
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de l\'association de l\'outil au module',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get a module tool association by ID
export const getModuleToolById = async (id: number): Promise<{ id: number; moduleId: number | null; toolId: number | null; createdAt: Date | null }> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'association outil-module invalide');
    }

    const moduleTool = await db.select().from(moduleTools).where(eq(moduleTools.id, id));
    if (!moduleTool[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Association outil-module avec l'ID ${id} non trouvée`);
    }

    return moduleTool[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération de l\'association outil-module',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a module tool association
export const updateModuleTool = async (id: number, updateData: { moduleId?: number; toolId?: number }): Promise<{ id: number; moduleId: number | null; toolId: number | null; createdAt: Date | null }> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'association outil-module invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    const updatedModuleTool = await db
      .update(moduleTools)
      .set({ ...updateData })
      .where(eq(moduleTools.id, id))
      .returning();
    if (!updatedModuleTool[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Association outil-module avec l'ID ${id} non trouvée`);
    }

    return updatedModuleTool[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour de l\'association outil-module',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a module tool association
export const deleteModuleTool = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'association outil-module invalide');
    }

    const deletedModuleTool = await db.delete(moduleTools).where(eq(moduleTools.id, id)).returning();
    if (!deletedModuleTool[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Association outil-module avec l'ID ${id} non trouvée`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression de l\'association outil-module',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a course tool association
export const updateCourseTool = async (id: number, updateData: { courseId?: number; toolId?: number }): Promise<{ id: number; courseId: number | null; toolId: number | null; createdAt: Date | null }> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'association outil-cours invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    const updatedCourseTool = await db
      .update(courseTools)
      .set({ ...updateData })
      .where(eq(courseTools.id, id))
      .returning();
    if (!updatedCourseTool[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Association outil-cours avec l'ID ${id} non trouvée`);
    }

    return updatedCourseTool[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour de l\'association outil-cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a course tool association
export const deleteCourseTool = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'association outil-cours invalide');
    }

    const deletedCourseTool = await db.delete(courseTools).where(eq(courseTools.id, id)).returning();
    if (!deletedCourseTool[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Association outil-cours avec l'ID ${id} non trouvée`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression de l\'association outil-cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a course partner association
export const updateCoursePartner = async (id: number, updateData: { courseId?: number; partnerId?: number }): Promise<{ id: number; courseId: number | null; partnerId: number | null; createdAt: Date | null }> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'association partenaire-cours invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    const updatedCoursePartner = await db
      .update(coursePartners)
      .set({ ...updateData })
      .where(eq(coursePartners.id, id))
      .returning();
    if (!updatedCoursePartner[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Association partenaire-cours avec l'ID ${id} non trouvée`);
    }

    return updatedCoursePartner[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour de l\'association partenaire-cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a course partner association
export const deleteCoursePartner = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'association partenaire-cours invalide');
    }

    const deletedCoursePartner = await db.delete(coursePartners).where(eq(coursePartners.id, id)).returning();
    if (!deletedCoursePartner[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Association partenaire-cours avec l'ID ${id} non trouvée`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression de l\'association partenaire-cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Create a tool
export const createTool = async (toolData: NewTool): Promise<Tool> => {
  try {
    if (!toolData.name) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Le champ name est requis'
      );
    }

    const newTool = await db.insert(tools).values(toolData).returning();
    if (!newTool[0]) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création de l\'outil');
    }

    return newTool[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la création de l\'outil',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get a tool by ID
export const getToolById = async (id: number): Promise<Tool> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'outil invalide');
    }

    const tool = await db.select().from(tools).where(eq(tools.id, id));
    if (!tool[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Outil avec l'ID ${id} non trouvé`);
    }

    return tool[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération de l\'outil',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a tool
export const updateTool = async (id: number, updateData: Partial<NewTool>): Promise<Tool> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'outil invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    const updatedTool = await db
      .update(tools)
      .set({ ...updateData })
      .where(eq(tools.id, id))
      .returning();
    if (!updatedTool[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Outil avec l'ID ${id} non trouvé`);
    }

    return updatedTool[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour de l\'outil',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a tool
export const deleteTool = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID d\'outil invalide');
    }

    const deletedTool = await db.delete(tools).where(eq(tools.id, id)).returning();
    if (!deletedTool[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Outil avec l'ID ${id} non trouvé`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression de l\'outil',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Create a partner
export const createPartner = async (partnerData: NewPartner): Promise<Partner> => {
  try {
    if (!partnerData.name) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'Le champ name est requis'
      );
    }

    const newPartner = await db.insert(partners).values(partnerData).returning();
    if (!newPartner[0]) {
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, 'Échec de la création du partenaire');
    }

    return newPartner[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la création du partenaire',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Get a partner by ID
export const getPartnerById = async (id: number): Promise<Partner> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de partenaire invalide');
    }

    const partner = await db.select().from(partners).where(eq(partners.id, id));
    if (!partner[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Partenaire avec l'ID ${id} non trouvé`);
    }

    return partner[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la récupération du partenaire',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Update a partner
export const updatePartner = async (id: number, updateData: Partial<NewPartner>): Promise<Partner> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de partenaire invalide');
    }
    if (Object.keys(updateData).length === 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'Aucune donnée à mettre à jour fournie');
    }

    const updatedPartner = await db
      .update(partners)
      .set({ ...updateData })
      .where(eq(partners.id, id))
      .returning();
    if (!updatedPartner[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Partenaire avec l'ID ${id} non trouvé`);
    }

    return updatedPartner[0];
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la mise à jour du partenaire',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Delete a partner
export const deletePartner = async (id: number): Promise<void> => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de partenaire invalide');
    }

    const deletedPartner = await db.delete(partners).where(eq(partners.id, id)).returning();
    if (!deletedPartner[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Partenaire avec l'ID ${id} non trouvé`);
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de la suppression du partenaire',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Associate a tool with a course
export const associateToolWithCourse = async (courseId: number, toolId: number): Promise<void> => {
  try {
    if (isNaN(courseId) || courseId <= 0 || isNaN(toolId) || toolId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'IDs invalides');
    }

    await db.insert(courseTools).values({ courseId, toolId }).returning();
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de l\'association de l\'outil au cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};

// Associate a partner with a course
export const associatePartnerWithCourse = async (courseId: number, partnerId: number): Promise<void> => {
  try {
    if (isNaN(courseId) || courseId <= 0 || isNaN(partnerId) || partnerId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'IDs invalides');
    }

    await db.insert(coursePartners).values({ courseId, partnerId }).returning();
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      'Erreur lors de l\'association du partenaire au cours',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};