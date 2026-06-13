import { ClipboardCheck, FileSearch, Microscope, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useScrollNavigate } from '../hooks/useScrollNavigate';

export default function CertificatesPage() {
  const navigate = useScrollNavigate();
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Certificats & traçabilité"
        title="Transparence analytique, lot par lot"
        text="Culture Bio Diamant s'engage à fournir un certificat d'analyse de laboratoire indépendant pour chaque produit référencé. Aucun article n'est mis en ligne sans dossier analytique complet et validé."
      />
      <div className="info-grid">
        <div className="quality-card">
          <Microscope size={22} />
          <h3>Qu'est-ce qu'un certificat d'analyse (COA) ?</h3>
          <p>Un certificat d'analyse (Certificate of Analysis) est un document délivré par un laboratoire indépendant accrédité après analyse physico-chimique d'un lot de produit. Il atteste de la composition exacte du produit, de sa conformité aux seuils légaux et de l'absence de contaminants. C'est la preuve documentaire incontournable de la qualité et de la légalité d'un produit CBD.</p>
        </div>
        <div className="quality-card">
          <FileSearch size={22} />
          <h3>Informations présentes dans chaque certificat</h3>
          <p>Chaque certificat d'analyse disponible sur notre site indique : le taux de CBD (%w/w), le taux de delta-9-THC (≤ 0,3 %), le profil terpénique lorsque disponible, l'absence de métaux lourds (plomb, cadmium, mercure, arsenic), l'absence de pesticides et de mycotoxines, le numéro de lot de production, la date d'analyse et l'identification du laboratoire certificateur.</p>
        </div>
        <div className="quality-card">
          <ShieldCheck size={22} />
          <h3>Notre politique de traçabilité</h3>
          <p>Culture Bio Diamant applique une politique stricte de traçabilité : chaque produit référencé est systématiquement lié à un numéro de lot unique, une fiche fournisseur, un certificat d'analyse et une déclaration d'origine de la matière première. Nous ne référençons aucun produit sans dossier analytique complet transmis et validé par nos soins avant toute mise en ligne.</p>
        </div>
        <div className="quality-card">
          <ClipboardCheck size={22} />
          <h3>Laboratoires indépendants accrédités</h3>
          <p>Nous exigeons que les analyses soient réalisées par des laboratoires indépendants accrédités ISO 17025 — le standard international de compétence des laboratoires d'essais et d'étalonnages. Cette accréditation garantit la fiabilité, la répétabilité et l'impartialité des résultats. Un laboratoire lié au fournisseur ne saurait en aucun cas remplacer une analyse indépendante.</p>
        </div>
        <div className="quality-card">
          <h3>Où trouver les certificats ?</h3>
          <p>Le certificat d'analyse de chaque produit est accessible directement depuis la fiche produit correspondante. En cas de questions sur un lot spécifique ou si vous souhaitez obtenir un document complémentaire (fiche fournisseur, déclaration d'origine), contactez notre service client à contact@culturebiodiamant.fr en indiquant la référence et le numéro de lot du produit concerné.</p>
        </div>
        <div className="quality-card">
          <h3>Mise à jour des lots</h3>
          <p>Les certificats sont mis à jour à chaque nouveau lot reçu de nos fournisseurs. La date d'analyse est visible sur chaque document. Si le certificat en ligne ne correspond pas au lot reçu dans votre commande, signalez-le immédiatement à notre service client. Nous nous engageons à une totale transparence documentaire sur l'ensemble de notre catalogue.</p>
        </div>
      </div>
      <button type="button" className="ghost-button" onClick={() => navigate('/boutique')}>Voir les produits et leurs certificats</button>
    </section>
  );
}
