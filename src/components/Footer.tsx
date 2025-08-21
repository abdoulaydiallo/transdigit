import Link from "next/link";
import { Container } from "./Container";
import { Button } from "./ui/button";
import { FiArrowRight } from "react-icons/fi";

export const Footer = () => {
  return (
    <div className="relative bg-primary/95 text-white/80 py-12 md:py-16 overflow-hidden animate-fade-in">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-secondary/20 z-0"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-2xl z-0"></div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-secondary/20 pb-12 mb-8">
          {/* À propos */}
          <div className="min-w-48">
            <p className="text-white text-lg font-bold mb-6 uppercase tracking-wider">
              À propos
            </p>
            <div className="space-y-3">
              {[
                "FAQ",
                "À propos de nous",
                "Presse",
                "Rejoignez-nous",
                "Nous contacter",
                "Politique de confidentialité",
                "Mentions légales",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="block"
                >
                  <div className="relative text-sm font-light text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all duration-300 group">
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Ressources */}
          <div className="min-w-48">
            <p className="text-white text-lg font-bold mb-6 uppercase tracking-wider">
              Ressources
            </p>
            <div className="space-y-3">
              {[
                "Prochaines sessions",
                "Blog",
                "Atelier gratuit",
                "Service carrière",
                "Les carrières dans le développement web",
                "Carrière dans le data",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="block"
                >
                  <div className="relative text-sm font-light text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all duration-300 group">
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Cours gratuits */}
          <div className="max-w-72 ml-0 lg:ml-auto">
            <p className="text-white text-lg font-bold mb-6 uppercase tracking-wider">
              Découvrez nos cours gratuits
            </p>
            <div className="relative bg-secondary/10 rounded-lg p-4 mb-6">
              <p className="text-sm font-light text-gray-300 line-clamp-2">
                Accédez à plus de 200 heures de contenu tech développé par des experts.
              </p>
            </div>
            <Button
              size="lg"
              className="w-full bg-secondary hover:bg-secondary/80 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-secondary/20 hover:scale-105 flex items-center gap-2"
            >
              Commencer maintenant !
              <FiArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-light text-gray-300">
            &copy; 2025 TransDigit Sarl. Tous droits réservés.
          </p>
          <p className="text-sm font-light text-gray-300">
            Dernière mise à jour : 21/08/2025
          </p>
        </div>
      </Container>
    </div>
  );
};