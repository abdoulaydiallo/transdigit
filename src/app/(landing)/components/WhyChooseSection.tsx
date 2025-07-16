import Image from "next/image";
import { Container } from "@/components/Container";

export default function WhyChooseSection() {
  return (
    <div id="homeWhyChoose" className="w-full my-12 lg:my-24 py-16 bg-[#371373] text-white">
      <Container>
        <div className="max-w-xl mx-auto text-center mb-12">
          <h1 className="uppercase mb-4 font-bold text-gray-100/80">
            Pourquoi choisir GouloTech
          </h1>
          <p className="text-2xl font-semibold">
            Apprenez avec des experts et lancez votre carrière tech en
            Guinée en 3 à 6 mois
          </p>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-center md:gap-16 px-0 md:px-12 mb-8 md:mb-12">
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
            <h1 className="text-2xl font-bold mb-2 md:mb-4">
              Projets pratiques pour des compétences réelles
            </h1>
            <p className="text-sm text-white/80">
              Travaillez sur des projets concrets adaptés au marché guinéen
              pour bâtir un portfolio qui impressionnera les recruteurs. Nos
              projets simulent des scénarios réels, comme le développement
              d'applications pour des startups locales ou des solutions pour
              des PME africaines, vous préparant directement aux exigences
              du marché du travail.
            </p>
          </div>
          <Image
            src="https://picsum.photos/id/111/600/306"
            alt="Étudiants GouloTech travaillant sur un projet à Conakry"
            width={600}
            height={306}
            className="w-full md:w-1/3 h-[306px] rounded-xl"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-center md:gap-16 px-0 md:px-12 mb-8 md:mb-12">
          <Image
            src="https://picsum.photos/id/112/600/306"
            alt="Formateurs GouloTech enseignant à Conakry"
            width={600}
            height={306}
            className="w-full md:w-1/3 h-[306px] rounded-xl"
            loading="lazy"
          />
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
            <h1 className="text-2xl font-bold mb-2 md:mb-4">
              Formateurs locaux et internationaux
            </h1>
            <p className="text-sm text-white/80">
              Apprenez avec des experts passionnés qui comprennent les
              besoins du marché tech africain et vous guident à chaque étape.
              Nos formateurs, basés en Guinée et à l'international, combinent
              une expertise technique pointue avec une connaissance approfondie
              des défis et opportunités du marché local.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-center px-0 md:px-12 gap-2 md:gap-8 mt-8">
          <div className="w-full md:w-1/3 mt-2 md:mt-0">
            <h1 className="text-2xl font-bold mb-2 md:mb-4">
              Accompagnement vers l'emploi
            </h1>
            <p className="text-sm text-white/80">
              Bénéficiez d'un coaching personnalisé et de connexions avec
              des entreprises guinéennes et africaines pour décrocher votre
              job tech. Nous vous aidons à naviguer le marché de l'emploi
              tech grâce à des partenariats avec des entreprises innovantes
              et des sessions de coaching axées sur les entretiens,
              la rédaction de CV et les compétences interpersonnelles.
            </p>
          </div>
          <Image
            src="https://picsum.photos/id/113/600/306"
            alt="Événement de recrutement GouloTech à Conakry"
            width={600}
            height={306}
            className="w-full md:w-1/3 h-[306px] rounded-xl"
            loading="lazy"
          />
        </div>
      </Container>
    </div>
  );
}