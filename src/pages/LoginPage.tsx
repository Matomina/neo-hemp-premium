import { UserRound } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';

export default function LoginPage() {
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Connexion"
        title="Espace client premium"
        text="Page de connexion simulée pour préparer le futur compte client : commandes, adresses, favoris, certificats consultés et suivi livraison."
      />
      <div className="cart-checkout-grid">
        <form className="checkout-panel checkout-form">
          <input placeholder="Email" />
          <input placeholder="Mot de passe" type="password" />
          <button type="button" className="primary-button">Se connecter en simulation</button>
          <button type="button" className="ghost-button">Créer un compte</button>
        </form>
        <div className="quality-card">
          <UserRound size={34} />
          <h3>Compte client à venir</h3>
          <p>La V1 prépare les écrans. Le backend devra ensuite gérer l'authentification, les commandes, les adresses et la sécurité des données.</p>
        </div>
      </div>
    </section>
  );
}
