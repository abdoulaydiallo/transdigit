import { NextRequest, NextResponse } from "next/server";
import { createCourseModule, getCourseModules } from "@/services/courses.service";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { CourseModule } from "@/lib/db/schema";
import { z } from "zod";

import { 
    CourseIdSchema, 
    NewCourseModuleSchema, 
} from "@/lib/zodSchemas";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

// GET /api/courses/:id/modules - Get all modules for a course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<CourseModule[]>>> {
  try {
    // Attendre les paramètres dynamiques
    const awaitedParams = await params;
    
    // Validation de l'ID
    const courseId = CourseIdSchema.parse(Number(awaitedParams.id));

    // Récupération des modules
    const modules = await getCourseModules(courseId);
    
    return NextResponse.json({ 
      success: true, 
      data: modules 
    }, { 
      status: 200 
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: "ID de cours invalide",
          details: error.issues,
          cause: null
        }
      }, { status: 400 });
    }

    if (error instanceof ServiceError) {
      return NextResponse.json({
        success: false,
        error: error.toJSON()
      }, { 
        status: error.code === ERROR_CODES.NOT_FOUND ? 404 : 400 
      });
    }

    return NextResponse.json({
      success: false,
      error: new ServiceError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Erreur serveur"
      ).toJSON()
    }, { status: 500 });
  }
}

// POST /api/courses/:id/modules - Create a new module for a course
export async function POST(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<ApiResponse<CourseModule>>> {
  try {
    if (req.method !== "POST") {
      throw new ServiceError(ERROR_CODES.METHOD_NOT_ALLOWED, "Méthode non autorisée");
    }

    const courseId = CourseIdSchema.parse(params.id);
    const body = await req.json();
    const parsedBody = { ...body, courseId, number: typeof body.number === "string" ? Number(body.number) : body.number };
    const moduleData = NewCourseModuleSchema.parse(parsedBody);

    // Ensure 'number' is a number before passing to createCourseModule
    const moduleDataWithNumber = { ...moduleData, number: Number(moduleData.number) };

    const result = await createCourseModule(moduleDataWithNumber);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
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
