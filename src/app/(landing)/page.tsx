"use client";

import Link from "next/link";

import { Container } from "@/components/Container";

import HeroSection from "./components/HeroSection";
import BootcampsSection from "./components/BootcampsSection";

import { courses, carouselItems, impactStats } from "@/data/homeData";
import CoursesSection from "./components/CoursesSection";
import CarouselSection from "./components/CarouselSection";
import WhyChooseSection from "./components/WhyChooseSection";
import ImpactSection from "./components/ImpactSection";

export default function Home() {
  return (
     <div>
        <HeroSection />
        <Container>
          <BootcampsSection />
          <CoursesSection courses={courses} />

          <div className="text-center my-12 lg:my-24">
            Commencez votre aventure tech dès aujourd&apos;hui !{" "}
            <Link href="/" className="text-secondary decoration">
              Inscrivez-vous à nos ateliers en ligne
            </Link>{" "}
            en Développement Web, Mobile ou IA.
          </div>
        <CarouselSection items={carouselItems} />
        </Container>
        
        <WhyChooseSection />
        <ImpactSection stats={impactStats} />
      </div>
  );
}