import { NextRequest, NextResponse } from "next/server";
import { createLesson, getLessons, LessonFilters, LessonPagination } from "@/services/lessons.service";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { z } from "zod";
import { Lesson, NewLessonSchema } from "@/lib/validations/courseLessons";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

// GET /api/modules/[id]/lessons - Récupérer toutes les leçons d'un module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Lesson[]>>> {
  try {
    const awaitedParams = await params;
    const moduleId = Number(awaitedParams.id);
    
    if (isNaN(moduleId) || moduleId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de module invalide");
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const type = searchParams.get("type");
    const difficulty = searchParams.get("difficulty");
    const title = searchParams.get("title");
    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 10;

    const filters: LessonFilters = {};
    if (isActive !== null) filters.isActive = isActive === "true";
    if (type) filters.type = type;
    if (difficulty) filters.difficulty = difficulty;
    if (title) filters.title = title;

    const pagination: LessonPagination = { page, per_page };

    const { lessons } = await getLessons(moduleId, filters, pagination);

    return NextResponse.json(
      { success: true, data: lessons },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json(
        { success: false, error: error.toJSON() },
        { status: error.code === ERROR_CODES.NOT_FOUND ? 404 : 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: new ServiceError(
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          "Erreur serveur"
        ).toJSON(),
      },
      { status: 500 }
    );
  }
}

// POST /api/modules/[id]/lessons - Créer une nouvelle leçon
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Lesson>>> {
  try {
    if (req.method !== "POST") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    const awaitedParams = await params;
    const moduleId = Number(awaitedParams.id);
    if (isNaN(moduleId) || moduleId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de module invalide");
    }

    const body = await req.json();
    const parsedBody = { ...body, moduleId };
    const lessonData = NewLessonSchema.parse(parsedBody);

    const result = await createLesson(lessonData);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
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