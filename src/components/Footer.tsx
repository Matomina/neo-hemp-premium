import { Shield } from 'lucide-react';

type FooterProps = {
  onNavigate: (path: string) => void;
};

export function Footer({ onNavigate }: FooterProps) {
  const go = (path: string) => onNavigate(path);

  return (
    <footer className="footer">
      <div className="container footer-grid">

        <div className="footer-brand-col">
          <div className="footer-logo-frame">
            <img src="/cbd-logo.jpeg" alt="Culture Bio Diamant" className="footer-logo-img" />
          </div>
          <div className="footer-brand-name">Culture Bio Diamant</div>
          <div className="footer-brand-tag">CBD Premium Naturel</div>
          <p className="footer-brand-desc">
            Catalogue informatif de produits à base de chanvre. Sélection rigoureuse,
            analyses laboratoire, traçabilité complète.
          </p>
          <p className="footer-warning">
            <Shield size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Produits réservés aux adultes. Informations non médicales.
            THC ≤ 0,30% conforme réglementation française.
          </p>
        </div>

        <div>
          <h4>Boutique</h4>
          <button type="button" className="footer-link" onClick={() => go('/boutique')}>Tous les produits</button>
          <button type="button" className="footer-link" onClick={() => go('/categorie/fleurs')}>Fleurs CBD</button>
          <button type="button" className="footer-link" onClick={() => go('/categorie/resines')}>Résines CBD</button>
          <button type="button" className="footer-link" onClick={() => go('/categorie/huiles')}>Huiles CBD</button>
          <button type="button" className="footer-link" onClick={() => go('/categorie/eliquides')}>E-Liquides CBD</button>
          <button type="button" className="footer-link" onClick={() => go('/categorie/cosmetiques')}>Cosmétiques CBD</button>
          <button type="button" className="footer-link" onClick={() => go('/categorie/accessoires')}>Accessoires</button>
        </div>

        <div>
          <h4>Informations</h4>
          <button type="button" className="footer-link" onClick={() => go('/a-propos')}>À propos</button>
          <button type="button" className="footer-link" onClick={() => go('/guide-cbd-legal')}>Guide CBD légal</button>
          <button type="button" className="footer-link" onClick={() => go('/certificats-tracabilite')}>Certificats & traçabilité</button>
          <button type="button" className="footer-link" onClick={() => go('/faq')}>FAQ</button>
          <button type="button" className="footer-link" onClick={() => go('/contact')}>Contact</button>
          <button type="button" className="footer-link" onClick={() => go('/livraison-retours')}>Livraison & retours</button>
        </div>

        <div>
          <h4>Légal</h4>
          <button type="button" className="footer-link" onClick={() => go('/mentions-legales')}>Mentions légales</button>
          <button type="button" className="footer-link" onClick={() => go('/cgv')}>CGV</button>
          <button type="button" className="footer-link" onClick={() => go('/confidentialite')}>Confidentialité</button>
          <button type="button" className="footer-link" onClick={() => go('/cookies')}>Cookies</button>
          <button type="button" className="footer-link" onClick={() => go('/retractation')}>Rétractation</button>
        </div>

      </div>

      <div className="container footer-bottom">
        <span>© 2025 Culture Bio Diamant — SIRET à compléter — Usage adulte responsable</span>
        <span className="footer-18">18+</span>
      </div>
    </footer>
  );
}
