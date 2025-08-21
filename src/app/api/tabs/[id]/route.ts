// /app/api/courses/[id]/tabs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateCourseTab, deleteCourseTab, getCourseTabById } from "@/services/tabs.services";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { CourseTab } from "@/lib/db/schema";
import { z } from "zod";
import { UpdateCourseTabSchema } from "@/lib/validations/courseTabs";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };


// PUT /api/tabs/[id] - Update a course tab
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<CourseTab>>> {
  try {
    if (req.method !== "PUT") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    const awaitedParams = await params;
    const courseId = Number(awaitedParams.id);
    const id = Number(awaitedParams.id);
    if (isNaN(courseId) || courseId <= 0 || isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de cours ou d'onglet invalide");
    }

    const body = await req.json();
    const updateData = UpdateCourseTabSchema.parse(body);

    const updatedTab = await updateCourseTab(id, updateData);
    if (updatedTab.courseId !== courseId) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "L'onglet n'appartient pas au cours spécifié");
    }

    return NextResponse.json({ success: true, data: updatedTab }, { status: 200 });
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

// DELETE /api/tabs/[id] - Delete a course tab
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    if (req.method !== "DELETE") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    const awaitedParams = await params;
    const courseId = Number(awaitedParams.id);
    const id = Number(awaitedParams.id);
    if (isNaN(courseId) || courseId <= 0 || isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de cours ou d'onglet invalide");
    }

    const tab = await getCourseTabById(id);
    if (tab.courseId !== courseId) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "L'onglet n'appartient pas au cours spécifié");
    }

    await deleteCourseTab(id);
    return NextResponse.json({ success: true, data: null }, { status: 200 });
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
