import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="my-8">
      <div className="relative bg-gray-900/50 text-white w-full rounded-xl pt-8 pb-12 md:pb-24 px-8 mb-4 lg:mb-0 overflow-hidden">
        <Image
          src="https://picsum.photos/id/127/1200/800"
          alt="Arrière-plan de la section héros GouloTech"
          fill
          className="object-cover opacity-50 z-[-1]"
          loading="lazy"
        />
        <div className="w-full lg:max-w-lg py-8 lg:py-0">
          <div>
            <div className="bg-[#FFF3E8] text-gray-900 text-center line-clamp-1 px-4 py-1 lg:py-2 mb-4 rounded-full">
            🚀 Formez-vous aux métiers tech en Guinée
          </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Boostez votre avenir.
            <br /> Maîtrisez la Tech avec GouloTech.
          </h1>
          <p className="line-clamp-2">
            Lancez votre carrière dans la tech avec nos formations en
            développement web, mobile, et intelligence artificielle.
          </p>
          <Link href="#homeBootcamps">
            <Button className="mt-4 cursor-pointer" size="lg">
              Découvrez nos formations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}