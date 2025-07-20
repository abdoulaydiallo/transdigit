import { db } from "@/lib/db";
import { courses, courseTabs, courseSections, courseModules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ServiceError, ERROR_CODES } from "@/services/services.errors";
import { z } from "zod";
import { NewCourseSchema } from "@/lib/zodSchemas"; // Ajustez le chemin selon votre structure

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

// Fonction principale pour récupérer les détails d'un cours
export const getCourseDetailsByKey = async (courseKey: string): Promise<CourseDetail> => {
  try {
    // Valider la clé du cours avec Zod
    const validatedKey = NewCourseSchema.shape.key.parse(courseKey);

    // Récupérer le cours par sa clé
    const course = await db
      .select({
        key: courses.key,
        title: courses.title,
        description: courses.description,
        imageSrc: courses.imageSrc,
        duration: courses.duration,
        totalHours: courses.totalHours,
        id: courses.id,
      })
      .from(courses)
      .where(eq(courses.key, validatedKey))
      .limit(1);

    if (!course[0]) {
      throw new ServiceError(ERROR_CODES.NOT_FOUND, `Cours avec la clé ${validatedKey} non trouvé`);
    }

    const selectedCourse = course[0];

    // Récupérer les onglets associés au cours
    const tabs = await db
      .select({
        title: courseTabs.title,
        key: courseTabs.key,
        isActive: courseTabs.isActive,
      })
      .from(courseTabs)
      .where(eq(courseTabs.courseId, selectedCourse.id))
      .orderBy(courseTabs.orderIndex);

    // Récupérer les sections associées au cours
    const sections = await db
      .select({
        tabKey: courseSections.tabKey,
        title: courseSections.title,
        subtitle: courseSections.subtitle,
        description: courseSections.description,
        items: courseSections.items,
        children: courseSections.children,
      })
      .from(courseSections)
      .where(eq(courseSections.courseId, selectedCourse.id));

    // Récupérer les modules associés au cours
    const modules = await db
      .select({
        orderIndex: courseModules.orderIndex,
        title: courseModules.title,
        duration: courseModules.duration,
        description: courseModules.description,
        steps: courseModules.steps,
        tools: courseModules.tools,
      })
      .from(courseModules)
      .where(eq(courseModules.courseId, selectedCourse.id))
      .orderBy(courseModules.orderIndex);

    // Construire l'objet sectionContents
    const sectionContents: Record<string, SectionContentProps> = {};

    // Remplir les sections
    for (const section of sections) {
      const sectionContent: SectionContentProps = {
        title: section.title,
        subtitle: section.subtitle,
        description: section.description,
        items: section.items as any,
        children: section.children as any || {},
      };

      // Si la section est liée à l'onglet "curriculum", ajouter les modules
      if (section.tabKey === "curriculum") {
        sectionContent.children = sectionContent.children || {};
        sectionContent.children.modules = modules.map((module) => ({
          number: module.orderIndex,
          title: module.title,
          duration: module.duration,
          description: module.description,
          steps: module.steps as any,
          tools: module.tools as any ?? null,
        }));
      }

      sectionContents[section.tabKey] = sectionContent;
    }

    // Construire les onglets
    const formattedTabs: Tab[] = tabs.map((tab) => ({
      title: tab.title,
      key: tab.key, // Assurez-vous que isActive est défini
    }));

    // Construire le résultat final
    const courseDetail: CourseDetail = {
      key: selectedCourse.key,
      title: selectedCourse.title,
      description: selectedCourse.description,
      imageSrc: selectedCourse.imageSrc,
      duration: selectedCourse.duration,
      totalHours: selectedCourse.totalHours,
      tabs: formattedTabs,
      sectionContents,
    };

    return courseDetail;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ServiceError(
        ERROR_CODES.VALIDATION_ERROR,
        `Erreur de validation de la clé : ${error.message}`,
        { originalError: error }
      );
    }
    throw new ServiceError(
      ERROR_CODES.DATABASE_ERROR,
      "Erreur lors de la récupération des détails du cours",
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
};