import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Gem, ShieldCheck } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes/routes';
import { useCart } from './context';

const ACCESS_KEY = 'culture-bio-diamant-majorite-ok';

function App() {
  const [accessConfirmed, setAccessConfirmed] = useState(() => localStorage.getItem(ACCESS_KEY) === 'true');
  const { count: cartCount } = useCart();
  const location = useLocation();
  const rrNavigate = useNavigate();

  const navigate = (path: string) => {
    rrNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmAccess = () => {
    localStorage.setItem(ACCESS_KEY, 'true');
    setAccessConfirmed(true);
  };

  return (
    <div className="app-shell">
      {!accessConfirmed ? (
        <div className="age-gate" role="dialog" aria-modal="true">
          <div className="age-gate-card">
            <div className="age-gate-mark"><Gem size={34} /><span>CBD</span></div>
            <p className="eyebrow"><ShieldCheck size={16} /> Accès responsable</p>
            <h2>Culture Bio Diamant</h2>
            <p>Confirme que tu es majeur pour consulter cette boutique à base de chanvre et d'accessoires premium.</p>
            <button type="button" className="primary-button" onClick={confirmAccess}>Entrer sur le site</button>
          </div>
        </div>
      ) : null}

      <Header
        cartCount={cartCount}
        currentPath={location.pathname}
        onNavigate={navigate}
        onCategorySelect={() => undefined}
      />
      <main><AppRoutes /></main>
      <Footer onNavigate={navigate} />
      <div className="sticky-mobile-cta">
        <span>Voir les produits premium</span>
        <button type="button" onClick={() => navigate('/boutique')}>Boutique</button>
      </div>
    </div>
  );
}

export default App;
