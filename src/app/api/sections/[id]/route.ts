import { NextRequest, NextResponse } from 'next/server';
import { updateCourseSection, deleteCourseSection, getCourseSectionById } from '@/services/courses.service';
import { ServiceError, ERROR_CODES } from '@/services/services.errors';
import { UpdateCourseSectionSchema } from '@/lib/validations/courseSections';
import { z } from 'zod';
import type { CourseSection } from '@/lib/db/schema';

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError['toJSON']> };

const CourseIdSchema = z.number().int().positive('L\'ID du cours doit être un entier positif');

// PUT /api/sections/[id] - Mettre à jour une section
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<CourseSection>>> {
  try {
    const awaitedParams = await params;
    const id = Number(awaitedParams.id);
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de section invalide');
    }
    const body = await req.json();
    const courseId = CourseIdSchema.parse(body.courseId);
    const updateData = UpdateCourseSectionSchema.parse(body);
    const section = await getCourseSectionById(id);
    if (section.courseId !== courseId) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'La section n\'appartient pas au cours spécifié'
      );
    }
    const updatedSection = await updateCourseSection(id, updateData);
    return NextResponse.json({ success: true, data: updatedSection }, { status: 200 });
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

// DELETE /api/sections/[id] - Supprimer une section
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const awaitedParams = await params;
    const id = Number(awaitedParams.id);
    if (isNaN(id) || id <= 0) {
      throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, 'ID de section invalide');
    }
    const body = await req.json();
    const courseId = CourseIdSchema.parse(body.courseId);
    const section = await getCourseSectionById(id);
    if (section.courseId !== courseId) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        'La section n\'appartient pas au cours spécifié'
      );
    }
    await deleteCourseSection(id);
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
      'Erreur serveur inattendue',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
    return NextResponse.json(
      { success: false, error: internalError.toJSON() },
      { status: 500 }
    );
  }
}