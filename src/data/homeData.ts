import { Course, CarouselItem, ImpactStat } from "@/types/home";

export const courses: Course[] = [
  {
    title: "Dev web fullstack",
    description:
      "Créez des sites web avec HTML, CSS, JavaScript et React.",
    imageSrc: "https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/photos/course-one.webp",
    imageAlt: "Illustration d'un projet de développement web",
    link: "/web-development",
  },
  {
    title: "Data Science & IA",
    description: "Devenez expert en analyse de données, machine learning.",
    imageSrc: "https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/photos/course-two.webp",
    imageAlt: "Illustration de l'intelligence artificielle",
    link: "/data-ai-course",
  },
  {
    title: "Pack Bureautique",
    description:
      "Devenez expert en bureautique avec Excel, Word et PowerPoint.",
    imageSrc: "https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/photos/course-tree.webp",
    imageAlt: "Illustration de la bureautique",
    link: "/bureautique-course",
  },
  {
    title: "Dev React Native",
    description:
      "Apprenez à créer des applications mobiles pour Android et iOS avec Flutter.",
    imageSrc: "https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/photos/course-four.webp",
    imageAlt: "Illustration d'un projet de développement mobile",
    link: "/mobile-development-course",
  },
];

export const carouselItems: CarouselItem[] = [
  {
    title: "Découvrez le marché tech guinéen",
    description:
      "Apprenez les compétences tech les plus demandées en Guinée grâce à nos formations pratiques et adaptées.",
    imageSrc: "https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/photos/carousel.webp",
    imageAlt: "Image du marché tech guinéen",
  },
  {
    title: "Lancez votre startup tech en Guinée",
    description:
      "Transformez vos idées en réalité avec nos cours axés sur l'innovation et l'entrepreneuriat tech.",
    imageSrc: "https://picsum.photos/id/109/600/470",
    imageAlt: "Image d'une startup tech en Guinée",
  },
  {
    title: "Devenez expert en IA",
    description:
      "Maîtrisez l'intelligence artificielle pour créer des solutions innovantes adaptées au marché africain.",
    imageSrc: "https://picsum.photos/id/110/600/470",
    imageAlt: "Image d'un projet d'intelligence artificielle",
  }
];

export const impactStats: ImpactStat[] = [
  {
    value: "500+",
    title: "Alumni en Guinée",
    description:
      "Rejoignez une communauté dynamique de professionnels tech en Guinée et accédez à des opportunités locales et régionales.",
  },
  {
    value: "#1",
    title: "Bootcamp tech en Guinée",
    description:
      "GouloTech est le leader des formations tech en Guinée, avec des programmes adaptés au marché local.",
  },
  {
    value: "80%",
    title: "Taux d'emploi",
    description:
      "Nos diplômés trouvent des emplois dans les startups, PME et grandes entreprises en Guinée et en Afrique.",
  },
  {
    value: "50+",
    title: "Partenaires locaux",
    description:
      "Collaborez avec des entreprises guinéennes et africaines grâce à notre réseau de partenaires.",
  },
];