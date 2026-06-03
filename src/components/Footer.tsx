type FooterProps = {
  onNavigate: (path: string) => void;
};

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <span className="brand-mark">CBD</span>
            <div>
              <h3>Culture Bio Diamant</h3>
              <p>Premium Naturel • Noir profond • Vert néon • Sélection responsable.</p>
            </div>
          </div>
          <p className="footer-warning">Informations non médicales. Produits réels à publier uniquement avec certificats, lots et documents fournisseur.</p>
        </div>
        <div>
          <h4>Boutique</h4>
          <button onClick={() => onNavigate('/categorie/fleurs')}>Fleurs CBD</button>
          <button onClick={() => onNavigate('/categorie/resines')}>Résines CBD</button>
          <button onClick={() => onNavigate('/categorie/cosmetiques')}>Cosmétiques</button>
          <button onClick={() => onNavigate('/categorie/accessoires')}>Accessoires</button>
        </div>
        <div>
          <h4>Informations</h4>
          <button onClick={() => onNavigate('/a-propos')}>À propos</button>
          <button onClick={() => onNavigate('/guide-cbd-legal')}>Guide CBD légal</button>
          <button onClick={() => onNavigate('/certificats-tracabilite')}>Certificats & traçabilité</button>
          <button onClick={() => onNavigate('/faq')}>FAQ</button>
          <button onClick={() => onNavigate('/contact')}>Contact</button>
        </div>
        <div>
          <h4>Légal</h4>
          <button onClick={() => onNavigate('/livraison-retours')}>Livraison & retours</button>
          <button onClick={() => onNavigate('/mentions-legales')}>Mentions légales</button>
          <button onClick={() => onNavigate('/cgv')}>CGV</button>
          <button onClick={() => onNavigate('/confidentialite')}>Confidentialité</button>
          <button onClick={() => onNavigate('/cookies')}>Cookies</button>
          <button onClick={() => onNavigate('/retractation')}>Rétractation</button>
        </div>
      </div>
      <div className="footer-bottom">© Culture Bio Diamant — SIRET à compléter — Usage responsable — Aucun paiement réel en V1</div>
    </footer>
  );
}
