"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/Container";
import { ListItem } from "@/components/ListItem";
import { TabNavigation } from "@/components/TabNavigation";
import { SectionContent } from "@/components/SectionContent";
import { courseDetails } from "@/data/courseData";
import { CourseDetail } from "@/types/course";
import { CourseApplicationDialog } from "./ApplyDialog";
import { Button } from "@/components/ui/button";
import { downloadCourseByTitle } from "@/lib/downloadCourse";

interface CourseDetailPageProps {
  courseKey: string;
}

export default function CourseDetailPage({ courseKey }: CourseDetailPageProps) {
  const normalizedCourseKey = courseKey.toLowerCase().replace(/^\/+/, "");
  const course: CourseDetail | undefined = courseDetails.find(
    (c) => c.key.toLowerCase() === normalizedCourseKey
  );
  const [activeTab, setActiveTab] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (course) {
      const defaultTab = course.tabs.find((tab) => tab.active)?.key || course.tabs[0]?.key || "";
      setActiveTab(defaultTab);
      console.log(`Active tab set to: ${defaultTab}`);
      console.log(`Available section keys for ${normalizedCourseKey}:`, Object.keys(course.sectionContents));
    } else {
      console.log(`Course not found for key: ${normalizedCourseKey}`);
      console.log("Available course keys:", courseDetails.map((c) => c.key));
    }
  }, [course, normalizedCourseKey]);

  if (!course) {
    const availableKeys = courseDetails.map((c) => c.key).join(", ");
    return (
      <div className="my-8 text-center">
        <p>
          Cours non trouvé pour la clé : <strong>{normalizedCourseKey}</strong>
        </p>
        <p>Clés disponibles : {availableKeys}</p>
      </div>
    );
  }

  if (!course.sectionContents[activeTab]) {
    return (
      <div className="my-8 text-center">
        <p>
          Contenu non trouvé pour l'onglet : <strong>{activeTab}</strong>
        </p>
        <p>Clés de sections disponibles : {Object.keys(course.sectionContents).join(", ") || "Aucune"}</p>
        <p>Clés des onglets : {course.tabs.map((tab) => tab.key).join(", ")}</p>
        <p>Course key: {normalizedCourseKey}</p>
      </div>
    );
  }

  console.log(`Rendering course: ${course}`);

  const handleSubmit = (values: any) => {
    console.log("Formulaire soumis :", values);
    setIsDialogOpen(false); // Ferme le dialogue après soumission
  };

  const handleDownload = async () => {
    try {
      await downloadCourseByTitle(course.title);
      
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    
    }
  };

  return (
    <div className="my-4 md:my-8">
      <Container>
        <div className="lg:flex gap-4 space-y-8 lg:space-y-0">
          <div className="w-full lg:w-3/4 space-y-8 bg-[#f5f2fb] rounded-xl py-8 px-4 md:px-16">
            <p className="text-xs">
              ⭐️⭐️⭐️⭐️⭐️ 4.9/5 - Inspiré des meilleurs bootcamps africains
            </p>
            <h1 className="text-xl md:text-5xl font-bold">{course.title}</h1>
            <div className="space-y-2">
              <ListItem title="Un bootcamp qui illumine les carrières en Guinée" />
              <ListItem title="9 semaines intensives à Conakry, sans prérequis" />
              <ListItem title="Décrochez un job tech ou tissez votre startup" />
            </div>
            <div className="flex gap-4">
              <CourseApplicationDialog
                courseKey={normalizedCourseKey}
                courseTitle={course.title}
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onSubmit={handleSubmit}
              />
              <Button
                variant="outline"
                onClick={handleDownload}
                size="lg"
                className="border-[#670BFF] text-[#670BFF] hover:bg-[#670BFF] hover:text-white"
              >
                Télécharger le syllabus
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-2/4 relative aspect-video lg:h-auto rounded-xl overflow-hidden">
            <Image
              src={course.imageSrc}
              alt={course.imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="my-8 md:my-12">
          <h1 className="text-sm text-center font-semibold">
            Nos diplômés brillent auprès d'entreprises locales et globales
          </h1>
          <div className="w-full flex flex-wrap gap-4 md:gap-16 justify-around mt-8">
            {course.partners.map((partner, index) => (
              <span key={index} className="text-gray-500 text-lg font-medium">
                {partner.name}
              </span>
            ))}
          </div>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={course.tabs} />

        <SectionContent {...course.sectionContents[activeTab]} />
      </Container>
    </div>
  );
}