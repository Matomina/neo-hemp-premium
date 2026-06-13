import { BookOpen, FlaskConical, Leaf, Scale, ShieldCheck, Sprout } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useScrollNavigate } from '../hooks/useScrollNavigate';

export default function GuidePage() {
  const navigate = useScrollNavigate();
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Guide CBD légal"
        title="CBD, THC et achat responsable"
        text="Ce guide explique les notions essentielles autour du cannabidiol : cadre légal français, différence CBD/THC, procédés d'extraction et critères de qualité. Un ton naturel, informatif et sans allégation médicale."
      />
      <div className="info-grid">
        <div className="quality-card">
          <Leaf size={22} />
          <h3>Qu'est-ce que le CBD ?</h3>
          <p>Le cannabidiol (CBD) est l'un des principaux cannabinoïdes du chanvre (Cannabis sativa L.). Contrairement au THC (tétrahydrocannabinol), le CBD n'a pas d'effet psychoactif. Il est naturellement présent dans les fleurs et feuilles de la plante et peut être extrait sous différentes formes : huile, fleurs séchées, résine, cosmétiques.</p>
        </div>
        <div className="quality-card">
          <Scale size={22} />
          <h3>Cadre légal en France</h3>
          <p>La vente de CBD est légale en France depuis la décision du Conseil d'État du 29 décembre 2021, confirmant l'arrêt de la Cour de Justice de l'Union Européenne. Les produits commercialisés doivent être issus de variétés de Cannabis sativa L. inscrites au catalogue officiel européen, avec un taux de delta-9-THC inférieur ou égal à 0,3 % dans la plante. Le CBD n'est pas classé comme stupéfiant.</p>
        </div>
        <div className="quality-card">
          <BookOpen size={22} />
          <h3>CBD et THC : quelle différence ?</h3>
          <p>Le THC (tétrahydrocannabinol) est le cannabinoïde psychoactif du cannabis, classé comme stupéfiant en France au-delà du seuil légal. Le CBD, lui, ne produit aucun effet psychotrope et est légal lorsqu'il respecte les seuils réglementaires. Nos produits affichent systématiquement les taux de CBD et THC dans leurs certificats d'analyse, vérifiés par laboratoire indépendant.</p>
        </div>
        <div className="quality-card">
          <FlaskConical size={22} />
          <h3>Les procédés d'extraction</h3>
          <p>La qualité d'un produit CBD dépend largement de son procédé d'extraction. L'extraction au CO₂ supercritique est la méthode la plus pure : elle préserve l'ensemble des actifs naturels sans laisser de résidus de solvants. L'extraction à l'éthanol de qualité alimentaire est également reconnue pour son efficacité et sa sécurité. Culture Bio Diamant sélectionne exclusivement des fournisseurs utilisant ces procédés certifiés.</p>
        </div>
        <div className="quality-card">
          <ShieldCheck size={22} />
          <h3>Comment choisir un produit CBD de qualité ?</h3>
          <p>Un produit CBD fiable doit présenter : un certificat d'analyse (COA) délivré par un laboratoire indépendant accrédité, un numéro de lot traçable, l'origine de la matière première, les taux exacts de CBD et THC, et l'absence de contaminants (pesticides, métaux lourds, solvants résiduels). Méfiez-vous de tout produit sans documentation analytique disponible.</p>
        </div>
        <div className="quality-card">
          <Sprout size={22} />
          <h3>Ce que nous ne disons pas</h3>
          <p>Culture Bio Diamant ne formule aucune allégation médicale ni promesse thérapeutique sur ses produits. Nos textes sont commerciaux, naturels et informatifs. Le CBD n'est pas un médicament et ne doit pas être présenté comme tel. Pour toute question de santé, consultez un professionnel de santé qualifié.</p>
        </div>
      </div>
      <div className="section-title content-spacer">
        <span>Nos produits</span>
        <h2>Une sélection conforme et documentée</h2>
        <p>Chaque produit de notre catalogue respecte ces critères de qualité et est accompagné de son certificat d'analyse complet.</p>
      </div>
      <button type="button" className="ghost-button" onClick={() => navigate('/boutique')}>Voir les produits</button>
    </section>
  );
}
