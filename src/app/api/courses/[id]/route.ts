import { NextRequest, NextResponse } from "next/server";
import { getCourseById, updateCourse, deleteCourse } from "@/services/courses.service";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { Course } from "@/lib/db/schema";
import { z } from "zod";
import { CourseIdSchema, UpdateCourseSchema } from "@/lib/zodSchemas";

// Type de réponse API
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

// GET /api/courses/:id - Get a course by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Note the Promise type
): Promise<NextResponse<ApiResponse<Course>>> {
  try {
    if (req.method !== "GET") {
      throw new ServiceError(
        ERROR_CODES.METHOD_NOT_ALLOWED,
        "Méthode non autorisée",
        undefined
      );
    }

    // Await params to get the actual params object
    const { id } = await params;
    const courseId = CourseIdSchema.parse(id);

    const result = await getCourseById(courseId);
    if (!result) {
      throw new ServiceError(
        ERROR_CODES.NOT_FOUND,
        "Cours non trouvé",
        { courseId }
      );
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
      return NextResponse.json({ success: false, error: error.toJSON() }, { status: ServiceError.getHttpStatus(error.code) });
    }
    const internalError = new ServiceError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Erreur serveur inattendue",
      { originalError: error instanceof Error ? error.message : String(error) },
      error instanceof Error ? error : undefined
    );
    return NextResponse.json({ success: false, error: internalError.toJSON() }, { status: 500 });
  }
}

// PUT /api/courses/:id - Update a course by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Note the Promise type
): Promise<NextResponse<ApiResponse<Course>>> {
  try {
    if (req.method !== "PUT") {
      throw new ServiceError(
        ERROR_CODES.METHOD_NOT_ALLOWED,
        "Méthode non autorisée",
        undefined
      );
    }

    // Await params to get the actual params object
    const { id } = await params;
    const courseId = CourseIdSchema.parse(id);
    const body = await req.json();
    const updateData = UpdateCourseSchema.parse(body);

    const result = await updateCourse(courseId, updateData);
    if (!result) {
      throw new ServiceError(
        ERROR_CODES.NOT_FOUND,
        "Cours non trouvé",
        { courseId }
      );
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
      return NextResponse.json({ success: false, error: error.toJSON() }, { status: ServiceError.getHttpStatus(error.code) });
    }
    const internalError = new ServiceError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Erreur serveur inattendue",
      { originalError: error instanceof Error ? error.message : String(error) },
      error instanceof Error ? error : undefined
    );
    return NextResponse.json({ success: false, error: internalError.toJSON() }, { status: 500 });
  }
}

// DELETE /api/courses/:id - Delete a course by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Note the Promise type
) {
  try {
    if (req.method !== "DELETE") {
      throw new ServiceError(
        ERROR_CODES.METHOD_NOT_ALLOWED,
        "Méthode non autorisée",
        undefined
      );
    }

    // Await params to get the actual params object
    const { id } = await params;
    const courseId = CourseIdSchema.parse(id);

    await deleteCourse(courseId);
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
      return NextResponse.json({ success: false, error: error.toJSON() }, { status: ServiceError.getHttpStatus(error.code) });
    }
    const internalError = new ServiceError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Erreur serveur inattendue",
      { originalError: error instanceof Error ? error.message : String(error) },
      error instanceof Error ? error : undefined
    );
    return NextResponse.json({ success: false, error: internalError.toJSON() }, { status: 500 });
  }
}