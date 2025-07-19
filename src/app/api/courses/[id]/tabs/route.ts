// /app/api/courses/[id]/tabs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { 
  createCourseTab, 
  getCourseTabs, 
  CourseTabFilters, 
  CourseTabPagination
 } from "@/services/tabs.services";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { CourseTab } from "@/lib/db/schema";
import { z } from "zod";
import { NewCourseTabSchema } from "@/lib/validations/courseTabs";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

// GET /api/courses/[id]/tabs - Get all tabs for a course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<CourseTab[]>>> {
  try {
    const awaitedParams = await params;
    const courseId = Number(awaitedParams.id);
    if (isNaN(courseId) || courseId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de cours invalide");
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const key = searchParams.get("key");
    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 10;

    const filters: CourseTabFilters = {};
    if (isActive !== null) filters.isActive = isActive === "true";
    if (key) filters.key = key;

    const pagination: CourseTabPagination = { page, per_page };

    const { tabs } = await getCourseTabs(courseId, filters, pagination);

    return NextResponse.json(
      { success: true, data: tabs },
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

// POST /api/courses/[id]/tabs - Create a new course tab
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<CourseTab>>> {
  try {
    if (req.method !== "POST") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    const awaitedParams = await params;
    const courseId = Number(awaitedParams.id);
    if (isNaN(courseId) || courseId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "ID de cours invalide");
    }

    const body = await req.json();
    const parsedBody = { ...body, courseId };
    const tabData = NewCourseTabSchema.parse(parsedBody);

    const result = await createCourseTab(tabData);
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
