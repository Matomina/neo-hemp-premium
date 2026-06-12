import { useLocation } from 'react-router-dom';
import { SectionTitle } from '../components/SectionTitle';
import { legalBlocks } from '../data/siteContent';
import NotFoundPage from './NotFoundPage';

export default function LegalPage() {
  const { pathname } = useLocation();
  const page = legalBlocks.find((p) => p.path === pathname);

  if (!page) return <NotFoundPage />;

  return (
    <section className="section container page-section">
      <SectionTitle eyebrow={page.eyebrow} title={page.title} text={page.intro} />
      <div className="info-grid">
        {page.points.map((point) => (
          <div className="quality-card" key={point}>
            <h3>{point}</h3>
            <p>Information à finaliser avec les données réelles de l'entreprise avant publication officielle.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
