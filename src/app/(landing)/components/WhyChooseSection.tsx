import Image from "next/image";
import { Container } from "@/components/Container";
import { FiCode, FiUsers, FiBriefcase, FiArrowRight } from "react-icons/fi";

export default function WhyChooseSection() {
  return (
    <section id="homeWhyChoose" className="relative overflow-hidden bg-primary py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90"></div>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <Container>
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <span className="text-secondary font-medium text-sm uppercase tracking-wide">
              Pourquoi choisir Transdigit
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Apprenez avec des experts et lancez{" "}
            <span className="text-secondary">votre carrière tech</span>{" "}
            en Guinée
          </h1>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary"></div>
            <span className="text-secondary font-semibold text-lg">3 à 6 mois</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary"></div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-32">
          {/* Feature 1 */}
          <div className="group">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 lg:order-1">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
                    <FiCode className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white">
                    Projets pratiques réels
                  </h2>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  Travaillez sur des projets concrets adaptés au marché guinéen pour bâtir 
                  un portfolio impressionnant. Nos projets simulent des scénarios réels pour 
                  des startups locales et PME africaines.
                </p>
                
                <button className="group/btn inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors">
                  Voir les projets
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>

              <div className="lg:order-2">
                <div className="relative group/img">
                  <div className="absolute -inset-4 bg-secondary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src="https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/photos/whychoose-one.webp"
                      alt="Étudiants travaillant sur des projets pratiques"
                      width={600}
                      height={400}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-1">
                <div className="relative group/img">
                  <div className="absolute -inset-4 bg-secondary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src="https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/photos/whychoose-two.webp"
                      alt="Formateurs experts enseignant"
                      width={600}
                      height={400}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:order-2">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
                    <FiUsers className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white">
                    Formateurs locaux experts
                  </h2>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  Apprenez avec des experts passionnés qui comprennent parfaitement 
                  les besoins du marché tech africain. Nos formateurs combinent expertise 
                  technique et connaissance du marché local.
                </p>
                
                <button className="group/btn inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors">
                  Rencontrer l'équipe
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 lg:order-1">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
                    <FiBriefcase className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white">
                    Accompagnement emploi
                  </h2>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  Bénéficiez d'un coaching personnalisé et de connexions directes avec 
                  des entreprises guinéennes et africaines pour décrocher votre premier 
                  emploi tech.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium border border-secondary/20">
                    Coaching CV
                  </span>
                  <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium border border-secondary/20">
                    Préparation entretiens
                  </span>
                  <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium border border-secondary/20">
                    Réseau entreprises
                  </span>
                </div>
                
                <button className="group/btn inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors">
                  Nos partenaires
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>

              <div className="lg:order-2">
                <div className="relative group/img">
                  <div className="absolute -inset-4 bg-secondary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src="https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/photos/whychoose-tree.webp"
                      alt="Succès des étudiants en emploi"
                      width={600}
                      height={400}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <button className="group inline-flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-secondary/25">
            Découvrir nos formations
            <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </Container>
    </section>
  );
}