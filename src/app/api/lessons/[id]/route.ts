import { NextRequest, NextResponse } from "next/server";
import { LessonService } from "@/services/lessons.service";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { z } from "zod";
import { Lesson } from "@/lib/validations/courseLessons";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

// PUT /api/lessons/[id] - Mettre à jour une leçon
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Lesson>>> {
  try {
    if (req.method !== "PUT") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    const awaitedParams = await params;
    const id = Number(awaitedParams.id);
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de leçon invalide");
    }

    const body = await req.json();
    const updatedLesson = await LessonService.update(id, body);

    return NextResponse.json({ success: true, data: updatedLesson }, { status: 200 });
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

// DELETE /api/lessons/[id] - Supprimer une leçon
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    if (req.method !== "DELETE") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    const awaitedParams = await params;
    const id = Number(awaitedParams.id);
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de leçon invalide");
    }

    await LessonService.delete(id);
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