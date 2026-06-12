import { Gem } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { aboutBlocks, premiumValues } from '../data/siteContent';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AboutPage() {
  useScrollReveal();
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="À propos"
        title="Une marque naturelle, moderne et premium"
        text="Culture Bio Diamant reprend l'énergie du flyer : un univers végétal lumineux, une exigence de contrôle et une présentation haut de gamme."
      />
      <div className="info-grid">
        {aboutBlocks.map((block) => (
          <article className="quality-card" key={block.title}>
            <h3>{block.title}</h3>
            <p>{block.text}</p>
          </article>
        ))}
      </div>
      <div className="section-title content-spacer">
        <span>Valeurs</span>
        <h2>Les piliers de la marque</h2>
      </div>
      <div className="category-grid">
        {premiumValues.map((value) => (
          <article className="category-card" key={value.title}>
            <Gem size={26} />
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
