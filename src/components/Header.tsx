import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import type { CategorySlug } from '../types';

type HeaderProps = {
  cartCount: number;
  currentPath: string;
  onNavigate: (path: string) => void;
  onCategorySelect: (category: CategorySlug | 'all') => void;
};

const navItems = [
  { path: '/boutique',                  label: 'Boutique' },
  { path: '/categorie/fleurs',          label: 'Fleurs' },
  { path: '/categorie/resines',         label: 'Résines' },
  { path: '/categorie/cosmetiques',     label: 'Cosmétiques' },
  { path: '/categorie/accessoires',     label: 'Accessoires' },
  { path: '/guide-cbd-legal',           label: 'Guide CBD' },
  { path: '/a-propos',                  label: 'À propos' },
];

const categoryPathMap: Partial<Record<string, CategorySlug>> = {
  '/categorie/fleurs':      'fleurs',
  '/categorie/resines':     'resines',
  '/categorie/huiles':      'huiles',
  '/categorie/eliquides':   'eliquides',
  '/categorie/cosmetiques': 'cosmetiques',
  '/categorie/accessoires': 'accessoires',
};

export function Header({ cartCount, currentPath, onNavigate, onCategorySelect }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goTo = (path: string) => {
    const category = categoryPathMap[path];
    if (category) onCategorySelect(category);
    if (path === '/boutique') onCategorySelect('all');
    onNavigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/boutique') return currentPath === path;
    return currentPath === path || currentPath.startsWith(path);
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <span>PRODUITS CONTRÔLÉS</span>
          <span className="topbar-sep" aria-hidden="true">•</span>
          <span>THC ≤ 0,30% CONFORME</span>
          <span className="topbar-sep" aria-hidden="true">•</span>
          <span>LIVRAISON SUIVIE</span>
          <span className="topbar-sep topbar-hide-sm" aria-hidden="true">•</span>
          <span className="topbar-hide-sm">ANALYSES LABORATOIRE</span>
        </div>
        <span className="topbar-service">Service client responsable</span>
      </div>

      <nav className="navbar container" aria-label="Navigation principale">
        <button type="button" className="brand" onClick={() => goTo('/')} aria-label="Accueil Culture Bio Diamant">
          <span className="brand-logo-frame" aria-hidden="true">
            <img src="/cbd-logo.jpeg" alt="" className="brand-logo-img" />
          </span>
          <span className="brand-copy">
            <strong>Culture Bio Diamant</strong>
            <small>CBD Premium Naturel</small>
          </span>
        </button>

        <div className="nav-links" aria-label="Liens principaux">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.path}
              className={isActive(item.path) ? 'active' : ''}
              onClick={() => goTo(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button type="button" className="nav-action-btn" onClick={() => goTo('/boutique')} aria-label="Rechercher">
            <Search size={17} />
          </button>
          <button type="button" className="nav-action-btn" onClick={() => goTo('/connexion')} aria-label="Compte">
            <UserRound size={17} />
          </button>
          <button type="button" className="cart-button nav-action-btn" onClick={() => goTo('/panier')} aria-label="Panier">
            <ShoppingBag size={17} />
            {cartCount > 0 ? <span>{cartCount}</span> : null}
          </button>
          <button type="button" className="cta-header" onClick={() => goTo('/boutique')}>
            Voir la boutique
          </button>
          <button
            type="button"
            className="mobile-menu"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="mobile-panel container">
          {navItems.map((item) => (
            <button type="button" key={item.path} onClick={() => goTo(item.path)}>
              {item.label}
            </button>
          ))}
          <button type="button" onClick={() => goTo('/categorie/huiles')}>Huiles CBD</button>
          <button type="button" onClick={() => goTo('/categorie/eliquides')}>E-Liquides CBD</button>
          <button type="button" onClick={() => goTo('/contact')}>Contact</button>
          <button type="button" onClick={() => goTo('/mentions-legales')}>Mentions légales</button>
        </div>
      ) : null}
    </header>
  );
}
