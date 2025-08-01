// server/services/exercise.service.ts
import { db } from "@/lib/db";
import { exercises, courseModules } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { NewExerciseSchema, UpdateExerciseSchema, ExerciseInstructionsSchema } from "@/lib/validations/exercise.schema";
import { z } from "zod";

// === Types ===
export interface ExerciseFilters {
  isActive?: boolean;
  type?: "projet" | "quiz" | "tache";
  difficulty?: "facile" | "moyen" | "difficile";
  search?: string;
}

export interface ExercisePagination {
  page: number;
  per_page: number;
}

export interface ExerciseSearchResult {
  exercises: (typeof exercises.$inferSelect)[];
  total: number;
  page: number;
  total_pages: number;
}

// === Helpers ===
const cleanString = (str: string | null | undefined): string | null => {
  const trimmed = str?.trim() ?? null;
  return trimmed === "" ? null : trimmed;
};

const parseInstructions = (data: unknown) => {
  try {
    return ExerciseInstructionsSchema.parse(data);
  } catch (error) {
    throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "Instructions invalides", { originalError: error });
  }
};

// === Service Principal ===
export class ExerciseService {
  /**
   * Vérifie l'existence d'un module
   */
  private static async checkModuleExists(moduleId: number): Promise<void> {
    const [module] = await db
      .select({ id: courseModules.id })
      .from(courseModules)
      .where(eq(courseModules.id, moduleId))
      .limit(1);

    if (!module) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Module ID ${moduleId} non trouvé`);
    }
  }

  /**
   * Crée un nouvel exercice
   */
  static async create(input: z.infer<typeof NewExerciseSchema>): Promise<typeof exercises.$inferSelect> {
    const startTime = Date.now();
    console.log("[ExerciseService:create] Début création", { moduleId: input.moduleId, title: input.title });

    try {
      await this.checkModuleExists(input.moduleId);

      const validatedData = {
        ...input,
        description: cleanString(input.description),
        submissionUrl: cleanString(input.submissionUrl),
        deadline: input.deadline ? new Date(input.deadline) : null,
        instructions: input.instructions ? parseInstructions(input.instructions) : undefined,
        updatedAt: new Date(),
      };

      const [exercise] = await db
        .insert(exercises)
        .values(validatedData)
        .returning();

      if (!exercise) {
        throw new ServiceError(ERROR_CODES.DATABASE_ERROR, "Échec de création : aucun exercice retourné");
      }

      console.log("[ExerciseService:create] Succès", { id: exercise.id, duration: Date.now() - startTime });
      return exercise;
    } catch (error) {
      console.error("[ExerciseService:create] Échec", { error, input });
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, "Erreur serveur lors de la création", {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Récupère les exercices d'un module avec filtres et pagination
   */
  static async findByModule(
    moduleId: number,
    filters: ExerciseFilters = {},
    pagination: ExercisePagination = { page: 1, per_page: 10 }
  ): Promise<ExerciseSearchResult> {
    const startTime = Date.now();
    console.log("[ExerciseService:findByModule] Recherche", { moduleId, filters, pagination });

    try {
      await this.checkModuleExists(moduleId);

      let baseQuery = db
        .select()
        .from(exercises)
        .where(eq(exercises.moduleId, moduleId)) as any;

      // Appliquer les filtres
      if (filters.isActive !== undefined) {
        baseQuery = baseQuery.where(eq(exercises.isActive, filters.isActive));
      }
      if (filters.type) {
        baseQuery = baseQuery.where(eq(exercises.type, filters.type));
      }
      if (filters.difficulty) {
        baseQuery = baseQuery.where(eq(exercises.difficulty, filters.difficulty));
      }
      if (filters.search) {
        const searchTerm = `%${filters.search.trim().toLowerCase()}%`;
        baseQuery = baseQuery.where(sql`LOWER(${exercises.title}) LIKE ${searchTerm}`);
      }

      // Compter total
      const [{ count }] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(exercises)
        .where(eq(exercises.moduleId, moduleId));

      const total = Number(count);
      const offset = (pagination.page - 1) * pagination.per_page;

      const result = await baseQuery
        .limit(pagination.per_page)
        .offset(offset)
        .orderBy(exercises.createdAt);

      const validatedExercises = result.map((ex: any) => ({
        ...ex,
        instructions: ex.instructions ? parseInstructions(ex.instructions) : undefined,
      }));

      const duration = Date.now() - startTime;
      console.log("[ExerciseService:findByModule] Succès", { total, count: validatedExercises.length, duration });

      return {
        exercises: validatedExercises,
        total,
        page: pagination.page,
        total_pages: Math.ceil(total / pagination.per_page),
      };
    } catch (error) {
      console.error("[ExerciseService:findByModule] Échec", { error, moduleId });
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, "Erreur serveur lors de la récupération", {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Récupère un exercice par ID
   */
  static async findById(id: number): Promise<typeof exercises.$inferSelect> {
    const startTime = Date.now();
    console.log("[ExerciseService:findById] Recherche par ID", { id });

    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID d'exercice invalide");
      }

      const [exercise] = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, id))
        .limit(1);

      if (!exercise) {
        throw new ServiceError(ERROR_CODES.NOT_FOUND, `Exercice ID ${id} non trouvé`);
      }

      console.log("[ExerciseService:findById] Succès", { duration: Date.now() - startTime });
      return {
        ...exercise,
        instructions: exercise.instructions ? parseInstructions(exercise.instructions) : undefined,
      };
    } catch (error) {
      console.error("[ExerciseService:findById] Échec", { error, id });
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, "Erreur serveur lors de la récupération", {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Met à jour un exercice
   */
  static async update(
    id: number,
    input: Partial<z.infer<typeof UpdateExerciseSchema>>
  ): Promise<typeof exercises.$inferSelect> {
    const startTime = Date.now();
    console.log("[ExerciseService:update] Début mise à jour", { id, changes: Object.keys(input) });

    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID d'exercice invalide");
      }
      if (Object.keys(input).length === 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "Aucune donnée à mettre à jour");
      }

      // Vérifier le module si présent
      if (input.moduleId) {
        await this.checkModuleExists(input.moduleId);
      }

      const validatedData: Partial<typeof exercises.$inferInsert> = {};

      // Nettoyer et valider chaque champ
      if (input.title !== undefined) validatedData.title = input.title.trim();
      if (input.description !== undefined) validatedData.description = cleanString(input.description);
      if (input.type !== undefined) validatedData.type = input.type;
      if (input.submissionUrl !== undefined) validatedData.submissionUrl = cleanString(input.submissionUrl);
      if (input.maxScore !== undefined) validatedData.maxScore = Number(input.maxScore);
      if (input.difficulty !== undefined) validatedData.difficulty = input.difficulty;
      if (input.isActive !== undefined) validatedData.isActive = Boolean(input.isActive);
      if (input.tags !== undefined) validatedData.tags = Array.isArray(input.tags) ? input.tags.filter(Boolean) : [];

      // deadline: string → Date
      if (input.deadline !== undefined) {
        validatedData.deadline = input.deadline ? new Date(input.deadline) : null;
      }

      // instructions: validation
      if (input.instructions !== undefined) {
        validatedData.instructions = parseInstructions(input.instructions);
      }

      validatedData.updatedAt = new Date();

      const [updated] = await db
        .update(exercises)
        .set(validatedData)
        .where(eq(exercises.id, id))
        .returning();

      if (!updated) {
        throw new ServiceError(ERROR_CODES.NOT_FOUND, `Exercice ID ${id} non trouvé`);
      }

      console.log("[ExerciseService:update] Succès", { id: updated.id, duration: Date.now() - startTime });
      return {
        ...updated,
        instructions: updated.instructions ? parseInstructions(updated.instructions) : undefined,
      };
    } catch (error) {
      console.error("[ExerciseService:update] Échec", { error, id, input });
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, "Erreur serveur lors de la mise à jour", {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Supprime un exercice
   */
  static async delete(id: number): Promise<void> {
    const startTime = Date.now();
    console.log("[ExerciseService:delete] Début suppression", { id });

    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID d'exercice invalide");
      }

      const [deleted] = await db
        .delete(exercises)
        .where(eq(exercises.id, id))
        .returning({ id: exercises.id });

      if (!deleted) {
        throw new ServiceError(ERROR_CODES.NOT_FOUND, `Exercice ID ${id} non trouvé`);
      }

      console.log("[ExerciseService:delete] Succès", { duration: Date.now() - startTime });
    } catch (error) {
      console.error("[ExerciseService:delete] Échec", { error, id });
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(ERROR_CODES.DATABASE_ERROR, "Erreur serveur lors de la suppression", {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }
}