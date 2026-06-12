import { Boxes, FileText, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useScrollNavigate } from '../hooks/useScrollNavigate';

export default function GuidePage() {
  const navigate = useScrollNavigate();
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Guide CBD légal"
        title="CBD, THC et achat responsable"
        text="Le guide explique les notions essentielles avec un ton naturel, premium et prudent. Il doit aider le client à comprendre la sélection sans promesse médicale."
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
