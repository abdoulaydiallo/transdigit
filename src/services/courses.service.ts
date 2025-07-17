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
  CourseModule,
  NewCourseModule,
  NewPartner,
  NewTool,
  Partner,
  Tool
} from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";
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