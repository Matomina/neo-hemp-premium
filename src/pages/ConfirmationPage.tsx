import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useCart } from '../context';
import { useScrollNavigate } from '../hooks/useScrollNavigate';

type ConfirmationLocationState = {
  fromCheckout?: boolean;
};

export default function ConfirmationPage() {
  const navigate = useScrollNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const state = location.state as ConfirmationLocationState | null;
  const fromCheckout = state?.fromCheckout === true;

  useEffect(() => {
    if (fromCheckout) {
      clearCart();
    }
  }, [clearCart, fromCheckout]);

  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Confirmation"
        title={fromCheckout ? 'Commande simulée reçue' : 'Confirmation non disponible'}
        text={
          fromCheckout
            ? "Numéro fictif : CBD-2606-001. Aucun paiement réel n'a été déclenché."
            : "Cette page s'affiche après une validation de panier. Retourne au panier pour tester le parcours complet."
        }
      />
      <div className="guide-grid">
        <div className="quality-card quality-card--centered">
          <CheckCircle2 size={48} className="confirmation-icon" />
          <h3>{fromCheckout ? 'Merci pour votre commande simulée' : 'Aucune commande simulée active'}</h3>
          <p>
            {fromCheckout
              ? "Cette page confirme le parcours d'achat. Le backend réel devra envoyer un email de confirmation et créer la commande en base."
              : "Aucun panier n'a été validé dans cette session. Le panier n'a donc pas été vidé."
            }
          </p>
          <button
            type="button"
            className="primary-button confirmation-cta"
            onClick={() => navigate(fromCheckout ? '/' : '/panier')}
          >
            {fromCheckout ? "Retour à l'accueil" : 'Retour au panier'}
          </button>
        </div>
        <div className="quality-card">
          <h3>Prochaines étapes V1</h3>
          <p>Intégration paiement CBD-compatible, email transactionnel, suivi de commande et espace client à finaliser avant lancement.</p>
        </div>
      </div>
    </section>
  );
}
