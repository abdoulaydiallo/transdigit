import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselItem as CarouselItemType } from "@/types/home";

interface CarouselSectionProps {
  items: CarouselItemType[];
}

export default function CarouselSection({ items }: CarouselSectionProps) {
  return (
    <div id="homeEvents" className="my-12 lg:my-24 w-full flex justify-center">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full lg:max-w-screen-lg"
      >
        <CarouselPrevious aria-label="Diapositive précédente">Précédent</CarouselPrevious>
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="md:flex flex-row-reverse">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                width={600}
                height={470}
                className="h-[240px] aspect-auto object-cover md:h-[470px] w-full md:w-1/3 rounded-t-xl md:rounded-l-none md:rounded-r-xl"
                loading="lazy"
              />
              <div className="h-full w-full md:w-2/3 p-8 md:p-12 bg-primary/5 rounded-b-xl md:rounded-b-none md:rounded-l-xl">
                <Badge>Nouveau</Badge>
                <h1 className="text-4xl font-bold mt-4">{item.title}</h1>
                <p className="text-md my-4">{item.description}</p>
                <Button size="lg">En savoir plus</Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext aria-label="Diapositive suivante" className="hidden sm:flex">Suivant</CarouselNext>
      </Carousel>
    </div>
  );
}