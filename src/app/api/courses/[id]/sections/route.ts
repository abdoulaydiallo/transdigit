import { z } from 'zod';
import type { CourseSection } from '@/lib/db/schema';
import { NextRequest, NextResponse } from 'next/server';

import { ServiceError, ERROR_CODES } from '@/services/services.errors';
import { NewCourseSectionSchema } from '@/lib/validations/courseSections';
import { createCourseSection } from '@/services/courses.service';
import { getCourseSections } from '@/services/sections.service';

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError['toJSON']> };

// GET /api/courses/[id]/sections - Lister les sections d’un cours
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<CourseSection[]>>> {
  try {
    const awaitedParams = await params;
    const courseId = Number(awaitedParams.id);
    if (isNaN(courseId) || courseId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de cours invalide');
    }
    const sections = await getCourseSections(courseId);
    return NextResponse.json({ success: true, data: sections }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ServiceError) {
      return NextResponse.json(
        { success: false, error: error.toJSON() },
        { status: ServiceError.getHttpStatus(error.code) }
      );
    }
    const internalError = new ServiceError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      'Erreur serveur inattendue',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
    return NextResponse.json(
      { success: false, error: internalError.toJSON() },
      { status: 500 }
    );
  }
}

// POST /api/courses/[id]/sections - Créer une nouvelle section
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{id: string}> }
): Promise<NextResponse<ApiResponse<CourseSection>>> {
  try {
    const awaitedParams = await params;
    const courseId = Number(awaitedParams.id);
    if (isNaN(courseId) || courseId <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de cours invalide');
    }
    const body = await req.json();
    const sectionData = NewCourseSectionSchema.parse({ ...body, courseId });
    const newSection = await createCourseSection(sectionData);
    return NextResponse.json({ success: true, data: newSection }, { status: 201 });
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
      'Erreur serveur inattendue',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
    return NextResponse.json(
      { success: false, error: internalError.toJSON() },
      { status: 500 }
    );
  }
}