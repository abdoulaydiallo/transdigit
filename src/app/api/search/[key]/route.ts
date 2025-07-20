import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { NewCourseSchema } from "@/lib/zodSchemas";
import { getCourseDetailsByKey } from "@/services/search.service"; // Ajustez le chemin selon votre structure

// Types pour la structure de sortie (alignés avec la base de données)
interface Tool {
  src: string;
  name: string;
}

interface Tab {
  title: string;
  key: string;
  active?: boolean;
}

interface SectionContentProps {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  items?: string[] | null;
  children?: {
    title?: string | null;
    content?: Tool[] | null;
    type?: string;
    label?: string;
    size?: string;
    overviewTitle?: string;
    overviewDescription?: string;
    technologies?: Tool[] | null;
    modules?: {
      number: number;
      title: string;
      duration: string | null;
      description: string | null;
      steps: string[] | null;
      tools: Tool[] | null;
    }[];
  };
}

interface CourseDetail {
  key: string;
  title: string;
  description: string | null;
  imageSrc: string | null;
  duration: string | null;
  totalHours: number | null;
  tabs: Tab[];
  sectionContents: Record<string, SectionContentProps>;
}

// Type de réponse API
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ReturnType<ServiceError["toJSON"]> };

// GET /api/search/[key] - Get course details by key
export async function GET(req: NextRequest, { params }: { params: { key: string } }): Promise<NextResponse<ApiResponse<CourseDetail>>> {
  try {
    if (req.method !== "GET") {
      throw new ServiceError(
        ERROR_CODES.METHOD_NOT_ALLOWED,
        "Méthode non autorisée",
        undefined
      );
    }

    // Extraire et valider la clé du cours depuis les paramètres d'URL
    const courseKey = params.key;
    const validatedKey = NewCourseSchema.shape.key.parse(courseKey);

    // Appeler la fonction pour récupérer les détails du cours
    const result = await getCourseDetailsByKey(validatedKey);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
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