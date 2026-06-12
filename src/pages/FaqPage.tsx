import { Boxes, FileText, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useScrollNavigate } from '../hooks/useScrollNavigate';

export default function FaqPage() {
  const navigate = useScrollNavigate();
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="FAQ"
        title="Questions fréquentes"
        text="Retrouve les informations essentielles sur la sélection, la livraison, le panier, les certificats et le futur compte client."
      />
      <div className="guide-grid">
        <div className="guide-points">
          <p><ShieldCheck /> <span><strong>Confiance :</strong> lots, origine et documents fournisseur.</span></p>
          <p><FileText /> <span><strong>Clarté :</strong> fiches produit propres et textes compréhensibles.</span></p>
          <p><Boxes /> <span><strong>Gamme maîtrisée :</strong> peu de produits, mais mieux présentés.</span></p>
        </div>
        <div className="quality-card">
          <h3>Charte premium</h3>
          <p>Noir profond, vert néon, glow diamant, cartes glassmorphism et communication responsable. Le contenu doit être aussi soigné que le visuel.</p>
          <button type="button" className="ghost-button" onClick={() => navigate('/boutique')}>Voir les produits</button>
        </div>
      </div>
    </section>
  );
}
