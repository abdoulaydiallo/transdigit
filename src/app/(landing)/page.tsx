"use client";

import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Airplay } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Footer } from "@/components/Footer";
import HeroSection from "./components/HeroSection";
import PartnersSection from "./components/PartnerSection";
import BootcampsSection from "./components/BootcampsSection";

import { courses, carouselItems, impactStats } from "@/data/homeData";
import CoursesSection from "./components/CoursesSection";
import CarouselSection from "./components/CarouselSection";
import WhyChooseSection from "./components/WhyChooseSection";
import ImpactSection from "./components/ImpactSection";

export default function Home() {
  return (
     <div>
        <Container>
          <HeroSection />
          <PartnersSection />
          <BootcampsSection />
          <CoursesSection courses={courses} />

          <div className="text-center my-12 lg:my-24">
            Commencez votre aventure tech dès aujourd'hui !{" "}
            <Link href="/" className="text-[#690cff] decoration">
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