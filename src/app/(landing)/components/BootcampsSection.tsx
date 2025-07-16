import Image from "next/image";

export default function BootcampsSection() {
  return (
    <div id="homeBootcamps" className="my-4 py-4 w-full">
      <h1 className="text-start md:text-center text-3xl md:text-4xl font-bold mb-4">
        Transformez votre carrière avec GouloTech
      </h1>
      <p className="text-start md:text-center text-sm md:text-lg font-thin">
        Des formations intensives conçues pour vous préparer aux métiers
        tech les plus demandés en Guinée et au-delà.
      </p>
      <div className="w-full flex flex-col md:flex-row gap-2 justify-start lg:justify-center mt-4">
        <div className="font-bold flex items-center">
          <Image
            alt="Coche verte pour la durée des formations"
            src="/img/check-red.svg"
            width={18}
            height={18}
          />
          <p className="mx-4 text-sm lg:text-lg">100 à 300 heures</p>
        </div>
        <div className="font-bold flex items-center">
          <Image
            alt="Coche verte pour les cours en direct"
            src="/img/check-red.svg"
            width={18}
            height={18}
          />
          <p className="mx-4 text-sm lg:text-lg">Cours en direct</p>
        </div>
        <div className="font-bold flex items-center">
          <Image
            alt="Coche verte pour la flexibilité des formations"
            src="/img/check-red.svg"
            width={18}
            height={18}
          />
          <p className="mx-4 text-sm lg:text-lg">3 à 6 mois flexibles</p>
        </div>
        <div className="font-bold flex items-center">
          <Image
            alt="Coche verte pour les options de formation"
            src="/img/check-red.svg"
            width={18}
            height={18}
          />
          <p className="mx-4 text-sm lg:text-lg">En ligne ou à Conakry</p>
        </div>
      </div>
    </div>
  );
}