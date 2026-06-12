import { SectionTitle } from '../components/SectionTitle';
import { useScrollNavigate } from '../hooks/useScrollNavigate';

export default function NotFoundPage() {
  const navigate = useScrollNavigate();
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="404"
        title="Page introuvable"
        text="Cette page n'existe pas ou a été déplacée."
      />
      <button type="button" className="primary-button" onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </section>
  );
}
