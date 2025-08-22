"use client";

import Image from "next/image";
import { Container } from "@/components/Container";
import { ApplicationForm, formSchema } from "@/components/ApplyForm";
import { output } from "zod";


export default function ApplyPage() {

  const handleSubmit = (values: output<typeof formSchema>) => {
    console.log("Formulaire soumis :", values);
  };

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-16">
        {/* Section du formulaire (2/3 sur tablette/desktop) */}
        <div className="md:col-span-2">
          <h1 className="text-xl md:text-4xl font-bold mb-2 text-gray-900">
            Postuler à Transdigit
          </h1>
          <p className="text-sm text-justify text-gray-600">
            Rejoignez notre bootcamp à Conakry pour transformer votre avenir avec des compétences tech adaptées aux besoins guinéens. Restez informé des nouveaux programmes, hackathons locaux, et promotions. Cette candidature prend moins de 5 minutes. Notre équipe vous contactera pour un entretien de 30 minutes.
          </p>
          <ApplicationForm onSubmit={handleSubmit} />
        </div>

        {/* Section des avantages (1/3 sur tablette/desktop, cachée sur mobile) */}
        <div className="hidden md:block md:col-span-1 space-y-8">
          <div className="p-4 border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <Image
                alt="Icône de validation"
                src="https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/icons/check-red.svg"
                width={14}
                height={14}
              />
              <p className="ml-2 text-sm font-semibold text-gray-900">
                500+ diplômés formés à Conakry
              </p>
            </div>
            <div className="flex items-center mb-3">
              <Image
                alt="Icône de validation"
                src="https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/icons/check-red.svg"
                width={14}
                height={14}
              />
              <p className="ml-2 text-sm font-semibold text-gray-900">
                Moins de 5 minutes
              </p>
            </div>
            <div className="flex items-center">
              <Image
                alt="Icône de validation"
                src="https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/icons/check-red.svg"
                width={14}
                height={14}
              />
              <p className="ml-2 text-sm font-semibold text-gray-900">
                Pas de prépaiement ni d&apos;engagement.
              </p>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-xl shadow-sm">
            <h1 className="text-xl font-bold">
              Que se passe-t-il dans cette pré-inscription ?
            </h1>
            <div className="space-y-2.5 mt-4 text-justify">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">1 Présentez-vous (3 min) :</span>{" "}
                expliquez-nous pourquoi vous souhaitez participer à un bootcamp et comment nous pouvons vous contacter concernant votre inscription.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">2 Choisissez votre formation (2 min) :</span>{" "}
                indiquez-nous où et quand vous souhaitez étudier.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Soumettez le formulaire</span> et surveillez votre boîte de réception (30 secondes).
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}