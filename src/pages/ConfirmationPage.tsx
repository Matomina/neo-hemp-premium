import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, Mail, Package } from 'lucide-react';
import { useCart } from '../context';
import { useScrollNavigate } from '../hooks/useScrollNavigate';

type ConfirmationLocationState = {
  fromCheckout?: boolean;
  isMock?: boolean;
  publicRef?: string;
  customerEmail?: string;
};

export default function ConfirmationPage() {
  const navigate = useScrollNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const state = location.state as ConfirmationLocationState | null;
  const fromCheckout = state?.fromCheckout === true;
  const isMock = state?.isMock !== false;
  const publicRef = state?.publicRef;
  const customerEmail = state?.customerEmail;

  useEffect(() => {
    if (fromCheckout) clearCart();
  }, [clearCart, fromCheckout]);

  if (!fromCheckout) {
    return (
      <section className="section container page-section">
        <div className="confirm-wrap">
          <div className="quality-card quality-card--centered">
            <Package size={48} className="confirm-empty-icon" />
            <h2 className="confirm-title">Aucune commande active</h2>
            <p className="confirm-empty-text">
              Cette page s'affiche uniquement après la validation d'un panier.
            </p>
            <button type="button" className="primary-button" onClick={() => navigate('/panier')}>
              Retour au panier
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section container page-section">
      <div className="confirm-wrap">

        {/* Bloc principal */}
        <div className="quality-card quality-card--centered">
          <CheckCircle2 size={56} className="confirm-icon" />

          {isMock ? (
            <>
              <span className="confirm-mock-badge">Mode démo</span>
              <h1 className="confirm-title">Simulation réussie</h1>
              <p className="confirm-mock-text">
                Le parcours de commande fonctionne correctement. En production, votre commande
                sera enregistrée et vous recevrez un email de confirmation avec votre numéro de référence.
              </p>
            </>
          ) : (
            <>
              <h1 className="confirm-title">Commande reçue</h1>
              {publicRef && (
                <p className="confirm-ref">
                  Votre référence :{' '}
                  <strong className="confirm-ref-value">{publicRef}</strong>
                </p>
              )}
              {customerEmail && (
                <p className="confirm-email-hint">
                  Un email de confirmation vous sera envoyé à <strong>{customerEmail}</strong>.
                </p>
              )}
            </>
          )}

          <button
            type="button"
            className="primary-button confirmation-cta"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </button>
        </div>

        {/* Prochaines étapes */}
        <div className="quality-card">
          <h3 className="confirm-steps-title">
            {isMock ? 'En production, voici ce qui se passera' : 'Prochaines étapes'}
          </h3>
          <div className="confirm-steps-list">
            <div className="confirm-step">
              <Mail size={16} className="confirm-step-icon-green" />
              <span className="confirm-step-text">
                Notre équipe reçoit votre commande et vous contacte par email pour confirmer
                les détails et le mode de règlement.
              </span>
            </div>
            <div className="confirm-step">
              <Clock size={16} className="confirm-step-icon-violet" />
              <span className="confirm-step-text">
                Délai de traitement : 24 à 48 h ouvrées. Expédition suivie sous 24 h après
                validation du paiement.
              </span>
            </div>
            <div className="confirm-step">
              <Package size={16} className="confirm-step-icon-green" />
              <span className="confirm-step-text">
                Tous nos produits sont expédiés en emballage discret avec certificat d'analyse
                inclus. THC ≤ 0,3 % garanti.
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
