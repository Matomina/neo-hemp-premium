import { useLocation } from 'react-router-dom';
import { SectionTitle } from '../components/SectionTitle';
import { legalBlocks } from '../data/siteContent';
import NotFoundPage from './NotFoundPage';

const legalPathAliases: Record<string, string> = {
  '/politique-confidentialite': '/confidentialite',
  '/politique-cookies': '/cookies',
  '/droit-de-retractation': '/retractation',
};

export default function LegalPage() {
  const { pathname } = useLocation();
  const canonicalPath = legalPathAliases[pathname] ?? pathname;
  const page = legalBlocks.find((p) => p.path === canonicalPath);

  if (!page) return <NotFoundPage />;

  return (
    <section className="section container page-section">
      <SectionTitle eyebrow={page.eyebrow} title={page.title} text={page.intro} />
      <div className="info-grid">
        {page.points.map((point) => (
          <div className="quality-card" key={point.title}>
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
