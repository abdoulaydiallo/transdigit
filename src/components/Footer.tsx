import Link from "next/link";
import { Container } from "./Container";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <div className="bg-[#371373] text-white/80 py-12">
      <Container>
        <div className="flex flex-wrap gap-4 border-b pb-12 mb-4">
          <div className="min-w-48">
            <p className="text-white text-md font-semibold mb-4 uppercase">A propos</p>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">FAQ</div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">A propos du wagon</div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">Presse</div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">Rejoingnez-nous</div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">Nous contacter</div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">
                Politique de confidentialité
              </div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">Mentions legales</div>
            </Link>
          </div>

          <div className="max-w-48">
            <p className="text-white text-md font-semibold mb-4 uppercase">Ressources</p>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">Prochaines sessions</div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">Blog</div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">Atélier gratuit</div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">Service carrière</div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">
                Les carrières dans le développement web
              </div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">
                Carrière dans le data
              </div>
            </Link>
          </div>

          <div className="max-w-48">
            <p className="text-white text-md font-semibold mb-4 uppercase">Entreprises</p>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">
                Goulotech for business
              </div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">
                Parteneurs recriteurs
              </div>
            </Link>
            <Link href="/">
              <div className="text-sm font-light mb-2 hover:font-semibold hover:text-white">
                Ecoles et Universites
              </div>
            </Link>
          </div>

          <div className="max-w-72 ml-0 lg:ml-auto">
            <p className="text-white text-md font-semibold mb-4 uppercase">
              Découvrez nos cours gratuits
            </p>
            <p className="text-sm font-light mb-2 line-clamp-2">
              Accédez à plus de 200 heures de contenu tech developpé par des
              experts.
            </p>
            <Button size="lg">Commencer maintenant !</Button>
          </div>
        </div>
        <div>
          <p className="text-sm font-light">
            &copy; 2025 Goulotech, Sarl. Tous droits resérvés
          </p>
          <p className="text-sm font-light">Dernière mise à jour: 21/12/2024</p>
        </div>
      </Container>
    </div>
  );
};
