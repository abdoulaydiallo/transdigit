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
import { output } from "zod";
import { formSchema } from "./ApplyForm";
import { 
  FiStar, 
  FiDownload, 
  FiPlay, 
  FiClock, 
  FiUsers, 
  FiMapPin,
  FiTrendingUp,
  FiAward
} from "react-icons/fi";
import { FaRocket } from "react-icons/fa";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiTrendingUp className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cours introuvable</h2>
          <p className="text-gray-600 mb-4">
            Cours non trouvé pour : <strong>{normalizedCourseKey}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Clés disponibles : {availableKeys}
          </p>
        </div>
      </div>
    );
  }

  if (!course.sectionContents[activeTab]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiPlay className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Contenu non disponible</h2>
          <p className="text-gray-600 mb-4">
            Contenu non trouvé pour l'onglet : <strong>{activeTab}</strong>
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Sections disponibles : {Object.keys(course.sectionContents).join(", ") || "Aucune"}</p>
            <p>Onglets : {course.tabs.map((tab) => tab.key).join(", ")}</p>
          </div>
        </div>
      </div>
    );
  }

  console.log(`Rendering course: ${course}`);

  const handleSubmit = (values: output<typeof formSchema>) => {
    console.log("Formulaire soumis :", values);
    setIsDialogOpen(false);
  };

  const handleDownload = async () => {
    try {
      await downloadCourseByTitle(course.title);
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-white to-gray-50/30 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <Container>
        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12 rounded-3xl">
          {/* Content Column */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden h-full">
            <div className="absolute inset-0 bg-primary"></div>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/20 z-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl z-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-2xl z-10"></div>
            
            {/* Content */}
            <div className="relative z-20 px-8 lg:px-12 py-12 lg:py-16 h-full flex flex-col justify-between">
              <div className="max-w-2xl">
                {/* Rating Badge */}
                <div className="inline-flex items-center gap-2 bg-secondary/15 backdrop-blur-sm border border-secondary/25 text-secondary px-4 py-2 rounded-full mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold text-sm">4.9/5</span>
                  <span className="text-xs text-gray-300">• Inspiré des meilleurs bootcamps africains</span>
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                  {course.title}
                </h1>
                
                {/* Key Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiAward className="w-3 h-3 text-secondary" />
                    </div>
                    <div className="text-gray-300">Un bootcamp qui illumine les carrières en Guinée</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiClock className="w-3 h-3 text-secondary" />
                    </div>
                    <div className="text-gray-300">9 semaines intensives à Conakry, sans prérequis</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiTrendingUp className="w-3 h-3 text-secondary" />
                    </div>
                    <div className="text-gray-300">Décrochez un job tech ou tissez votre startup</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-gray-900/50 rounded-2xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FiUsers className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-2xl font-bold text-white">200+</div>
                    <div className="text-sm text-gray-300">Étudiants</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FiAward className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-2xl font-bold text-white">85%</div>
                    <div className="text-sm text-gray-300">Emploi</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FiMapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-2xl font-bold text-white">Conakry</div>
                    <div className="text-sm text-gray-300">Campus</div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
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
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-medium px-8 py-4 h-auto rounded-xl transition-all duration-300"
                >
                  <FiDownload className="w-5 h-5 mr-2" />
                  Télécharger le programme
                </Button>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-1/4 right-8 opacity-20 z-10">
              <div className="w-24 h-24 border-2 border-secondary/30 rounded-2xl rotate-45 animate-pulse"></div>
            </div>
            <div className="absolute bottom-1/3 right-1/4 opacity-10 z-10">
              <div className="w-16 h-16 bg-secondary/20 rounded-full blur-sm animate-bounce"></div>
            </div>
          </div>
          
          {/* Image Column */}
          <div className="lg:col-span-1 relative rounded-3xl overflow-hidden h-full">
            <div className="relative h-full bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <Image
                src={course.imageSrc}
                alt={course.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                priority
              />
              
              {/* Enhanced Play Button Overlay with Glow */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors cursor-pointer shadow-lg shadow-secondary/50 animate-glow">
                  <FiPlay className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              {/* Subtle Border Glow on Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary/30 transition-all duration-300 rounded-3xl"></div>
            </div>
          </div>
        </div>

        {/* Navigation & Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={course.tabs} />
          <div className="p-8 lg:p-12">
            <SectionContent {...course.sectionContents[activeTab]} />
          </div>
        </div>
      </Container>
    </div>
  );
}