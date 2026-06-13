import { SectionTitle } from '../components/SectionTitle';
import { faqs } from '../data/faqs';

export default function FaqPage() {
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="FAQ"
        title="Questions fréquentes"
        text="Retrouvez ici les réponses aux questions les plus courantes sur nos produits, notre conformité réglementaire, la livraison, les retours et la protection de vos données."
      />
      <div className="info-grid">
        {faqs.map((faq) => (
          <div className="quality-card" key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
