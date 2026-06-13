import { Clock, Package, RefreshCw, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useScrollNavigate } from '../hooks/useScrollNavigate';

export default function DeliveryPage() {
  const navigate = useScrollNavigate();
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Livraison & retours"
        title="Expédition suivie, retours simples"
        text="Culture Bio Diamant s'engage à traiter et expédier votre commande dans les meilleurs délais, avec un suivi complet et une politique de retour transparente conforme au Code de la consommation."
      />
      <div className="info-grid">
        <div className="quality-card">
          <Clock size={22} />
          <h3>Délais d'expédition</h3>
          <p>Toutes les commandes sont préparées et expédiées sous 24 à 48 heures ouvrées après confirmation du paiement. Une confirmation d'expédition incluant votre numéro de suivi vous est envoyée par email dès l'envoi de votre colis.</p>
        </div>
        <div className="quality-card">
          <Package size={22} />
          <h3>Modes de livraison</h3>
          <p>Nous expédions vos commandes en colissimo suivi (2 à 3 jours ouvrés) ou en lettre suivie (3 à 5 jours ouvrés) selon le poids et le montant de votre commande. Les frais de port sont calculés automatiquement et affichés lors du passage en caisse.</p>
        </div>
        <div className="quality-card">
          <ShieldCheck size={22} />
          <h3>Colis endommagé ou manquant</h3>
          <p>En cas de colis endommagé à la livraison, conservez l'emballage et signalez le problème à contact@culturebiodiamant.fr dans les 48 heures suivant la réception. Joignez des photos du colis et du produit. Nous prendrons en charge le remplacement ou le remboursement selon votre préférence.</p>
        </div>
        <div className="quality-card">
          <RefreshCw size={22} />
          <h3>Droit de rétractation et retours</h3>
          <p>Conformément à l'article L.221-18 du Code de la consommation, vous disposez de 14 jours calendaires à compter de la réception pour exercer votre droit de rétractation, sans motif. Les produits retournés doivent être non ouverts, non descellés et dans leur emballage d'origine. Les frais de retour sont à votre charge, sauf erreur de notre part.</p>
        </div>
        <div className="quality-card">
          <h3>Remboursements</h3>
          <p>En cas de rétractation acceptée ou de produit défectueux, nous procédons au remboursement intégral (produit + frais de livraison standard) dans un délai maximum de 14 jours après réception et vérification du retour. Le remboursement s'effectue via le même moyen de paiement que celui utilisé lors de l'achat.</p>
        </div>
        <div className="quality-card">
          <h3>Produits exclus du retour</h3>
          <p>Conformément à l'article L.221-28 du Code de la consommation, les produits descellés après livraison ne peuvent être retournés pour des raisons d'hygiène ou de protection de la santé. Tout produit ouvert ou dont le sceau de sécurité a été brisé ne pourra faire l'objet d'un remboursement.</p>
        </div>
      </div>
      <div className="section-title content-spacer">
        <span>Contact SAV</span>
        <h2>Une question sur votre commande ?</h2>
        <p>Notre service client répond à toutes les demandes sous 48h ouvrées. Indiquez votre numéro de commande pour un traitement plus rapide.</p>
      </div>
      <button type="button" className="ghost-button" onClick={() => navigate('/contact')}>Contacter le service client</button>
    </section>
  );
}
