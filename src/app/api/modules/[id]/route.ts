import { NextRequest, NextResponse } from "next/server";
import { getCourseModuleById, updateCourseModule, deleteCourseModule } from "@/services/courses.service";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { CourseModule } from "@/lib/db/schema";
import { z } from "zod";
import { ModuleIdSchema, UpdateCourseModuleSchema } from "@/lib/zodSchemas";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

// GET /api/modules/:id - Get a module by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<CourseModule>>> {
  try {
    if (req.method !== "GET") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    // Await params to get the actual params object
    const { id } = await params;
    const moduleId = ModuleIdSchema.parse(id);

    const result = await getCourseModuleById(moduleId);
    if (!result) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, "Module non trouvé", { moduleId });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: error.issues[0].message,
            details: error.issues,
            cause: null,
          },
        },
        { status: 400 }
      );
    }
    if (error instanceof ServiceError) {
      return NextResponse.json(
        { success: false, error: error.toJSON() },
        { status: ServiceError.getHttpStatus(error.code) }
      );
    }
    const internalError = new ServiceError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Erreur serveur inattendue",
      { originalError: error instanceof Error ? error.message : String(error) },
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { success: false, error: internalError.toJSON() },
      { status: 500 }
    );
  }
}

// PUT /api/modules/:id - Update a module by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<CourseModule>>> {
  try {
    if (req.method !== "PUT") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    // Await params to get the actual params object
    const { id } = await params;
    const moduleId = ModuleIdSchema.parse(id);
    const body = await req.json();
    const updateData = UpdateCourseModuleSchema.parse(body);

    // Convert 'orderIndex' property from string to number if necessary
    const sanitizedUpdateData = {
      ...updateData,
      orderIndex: Number(updateData.orderIndex),
    };

    const result = await updateCourseModule(moduleId, sanitizedUpdateData);
    if (!result) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, "Module non trouvé", { moduleId });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: error.issues[0].message,
            details: error.issues,
            cause: null,
          },
        },
        { status: 400 }
      );
    }
    if (error instanceof ServiceError) {
      return NextResponse.json(
        { success: false, error: error.toJSON() },
        { status: ServiceError.getHttpStatus(error.code) }
      );
    }
    const internalError = new ServiceError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Erreur serveur inattendue",
      { originalError: error instanceof Error ? error.message : String(error) },
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { success: false, error: internalError.toJSON() },
      { status: 500 }
    );
  }
}

// DELETE /api/modules/:id - Delete a module by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (req.method !== "DELETE") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    // Await params to get the actual params object
    const { id } = await params;
    const moduleId = ModuleIdSchema.parse(id);

    await deleteCourseModule(moduleId);
    return NextResponse.json({ success: true, data: {} });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: error.issues[0].message,
            details: error.issues,
            cause: null,
          },
        },
        { status: 400 }
      );
    }
    if (error instanceof ServiceError) {
      return NextResponse.json(
        { success: false, error: error.toJSON() },
        { status: ServiceError.getHttpStatus(error.code) }
      );
    }
    const internalError = new ServiceError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Erreur serveur inattendue",
      { originalError: error instanceof Error ? error.message : String(error) },
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { success: false, error: internalError.toJSON() },
      { status: 500 }
    );
  }
}
