import { SectionTitle } from '../components/SectionTitle';

export default function ContactPage() {
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Contact"
        title="Support client"
        text="Formulaire visuel pour la V1. Aucun message n'est envoyé tant que le backend n'est pas intégré."
      />
      <div className="guide-grid">
        <div className="contact-form">
          <h3>Envoyer un message</h3>
          <input placeholder="Votre nom" />
          <input placeholder="Votre email" type="email" />
          <textarea placeholder="Votre message" rows={5} />
          <button type="button" className="primary-button">Envoyer en simulation</button>
        </div>
        <div className="quality-card">
          <h3>Nous contacter</h3>
          <p>L'équipe Culture Bio Diamant reste disponible pour toute question sur les produits, la conformité ou la livraison. Les coordonnées réelles seront ajoutées avant la mise en ligne.</p>
        </div>
      </div>
    </section>
  );
}
