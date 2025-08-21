import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {  FiArrowRight, FiStar } from "react-icons/fi";
import { FaRocket } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="mb-6">
      <div className="relative bg-primary text-white overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/photos/banner.webp"
          alt="Étudiants Transdigit en formation tech"
          fill
          className="object-cover opacity-30 z-0"
          priority
        />
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/20 z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-2xl z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 px-8 lg:px-16 py-16 lg:py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/15 backdrop-blur-sm border border-secondary/25 text-secondary px-4 py-2 rounded-full mb-8">
              <FaRocket className="w-4 h-4" />
              <span className="font-medium text-sm">
                Formez-vous aux métiers tech en Guinée
              </span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Boostez votre avenir.
              <br />
              Maîtrisez la{" "}
              <span className="text-secondary">Tech</span>{" "}
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-xl">
              Lancez votre carrière dans la tech avec nos formations pratiques en 
              développement web, mobile, et intelligence artificielle.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2">
                <div className="flex text-secondary">
                  <FiStar className="w-5 h-5 fill-current" />
                  <FiStar className="w-5 h-5 fill-current" />
                  <FiStar className="w-5 h-5 fill-current" />
                  <FiStar className="w-5 h-5 fill-current" />
                  <FiStar className="w-5 h-5 fill-current" />
                </div>
                <span className="text-gray-300 text-sm">200+ étudiants formés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-gray-300 text-sm">85% taux d'emploi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-gray-300 text-sm">3-6 mois de formation</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#homeBootcamps">
                <Button 
                  size="lg" 
                  className="group w-full bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-4 h-auto rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-secondary/25"
                >
                  Découvrez nos formations
                  <FiArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-medium px-8 py-4 h-auto rounded-xl transition-all duration-300"
              >
                Voir les témoignages
              </Button>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-1/4 right-8 lg:right-16 opacity-20">
            <div className="w-24 h-24 border-2 border-secondary/30 rounded-2xl rotate-45 animate-pulse"></div>
          </div>
          <div className="absolute bottom-1/3 right-1/4 opacity-10">
            <div className="w-16 h-16 bg-secondary/20 rounded-full blur-sm animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}