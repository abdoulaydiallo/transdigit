import { z } from "zod";
import { Course } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { NewCourseSchema, SearchParamsSchema } from "@/lib/zodSchemas";
import { createCourse, getAllCourses, CourseFilters, CoursePagination } from "@/services/courses.service";

// Type de réponse API
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

// POST /api/courses - Create a new course
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<Course>>> {
  try {
    if (req.method !== "POST") {
      throw new ServiceError(
        ERROR_CODES.METHOD_NOT_ALLOWED,
        "Méthode non autorisée",
        undefined
      );
    }

    const body = await req.json();
    const courseData = NewCourseSchema.parse(body);

    const result = await createCourse(courseData);
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

// GET /api/courses - Get all courses with filters and pagination
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    if (req.method !== "GET") {
      throw new ServiceError(
        ERROR_CODES.METHOD_NOT_ALLOWED,
        "Méthode non autorisée",
        undefined
      );
    }

    const { searchParams } = new URL(req.url);
    const params = SearchParamsSchema.parse({
      isActive: searchParams.get("isActive") || undefined,
      title: searchParams.get("title")?.trim() || undefined,
      page: searchParams.get("page") || undefined,
      per_page: searchParams.get("per_page") || undefined,
    });

    const filters: CourseFilters = {
      isActive: params.isActive,
      title: params.title,
    };
    const pagination: CoursePagination = {
      page: params.page ? parseInt(params.page, 10) : 1 ,
      per_page: params.per_page ? parseInt(params.per_page, 10) : 10
    };

    const result = await getAllCourses(filters, pagination);
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
    const internalError = ServiceError.fromError(
      error,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Erreur serveur inattendue"
    );
    return NextResponse.json({ success: false, error: internalError.toJSON() }, { status: 500 });
  }
}

