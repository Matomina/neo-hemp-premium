import { CheckCircle2 } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useScrollNavigate } from '../hooks/useScrollNavigate';
import { useCart } from '../context';
import { useEffect } from 'react';

export default function ConfirmationPage() {
  const navigate = useScrollNavigate();
  const { clearCart } = useCart();

  useEffect(() => { clearCart(); }, [clearCart]);

  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Confirmation"
        title="Commande simulée reçue"
        text="Numéro fictif : CBD-2606-001. Aucun paiement réel n'a été déclenché."
      />
      <div className="guide-grid">
        <div className="quality-card" style={{ textAlign: 'center' }}>
          <CheckCircle2 size={48} style={{ margin: '0 auto 1rem', color: 'var(--neon-green)' }} />
          <h3>Merci pour votre commande simulée</h3>
          <p>Cette page confirme le parcours d'achat. Le backend réel devra envoyer un email de confirmation et créer la commande en base.</p>
          <button type="button" className="primary-button" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/')}>
            Retour à l'accueil
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
