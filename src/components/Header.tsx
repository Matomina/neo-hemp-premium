import { Gem, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import type { CategorySlug } from '../types';

type HeaderProps = {
  cartCount: number;
  currentPath: string;
  onNavigate: (path: string) => void;
  onCategorySelect: (category: CategorySlug | 'all') => void;
};

const navItems = [
  { path: '/boutique', label: 'Boutique' },
  { path: '/categorie/fleurs', label: 'Fleurs' },
  { path: '/categorie/resines', label: 'Résines' },
  { path: '/categorie/cosmetiques', label: 'Cosmétiques' },
  { path: '/categorie/accessoires', label: 'Accessoires' },
  { path: '/guide-cbd-legal', label: 'Guide CBD' },
  { path: '/a-propos', label: 'À propos' },
];

const categoryPathMap: Partial<Record<string, CategorySlug>> = {
  '/categorie/fleurs': 'fleurs',
  '/categorie/resines': 'resines',
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
        <div className="container topbar-inner">
          <div className="topbar-left">
            <span>THC ≤ 0,30% conforme</span>
            <span className="topbar-sep" aria-hidden="true">·</span>
            <span>Analyses laboratoire</span>
            <span className="topbar-sep" aria-hidden="true">·</span>
            <span className="topbar-hide-sm">Qualité certifiée</span>
          </div>
          <span className="topbar-service">CBD Premium — Catalogue responsable</span>
        </div>
      </div>

      <nav className="navbar container" aria-label="Navigation principale">
        <button type="button" className="brand" onClick={() => goTo('/')} aria-label="Accueil Culture Bio Diamant">
          <span className="brand-mark" aria-hidden="true"><Gem size={18} /></span>
          <span className="brand-copy">
            <strong>Culture Bio Diamant</strong>
            <small>CBD Premium</small>
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
            <Search size={18} />
          </button>
          <button type="button" className="nav-action-btn" onClick={() => goTo('/connexion')} aria-label="Compte">
            <UserRound size={18} />
          </button>
          <button type="button" className="cart-btn" onClick={() => goTo('/panier')} aria-label="Panier">
            <ShoppingBag size={18} />
            {cartCount > 0 ? <span className="cart-count">{cartCount}</span> : null}
          </button>
          <button type="button" className="cta-header" onClick={() => goTo('/boutique')}>Voir la boutique</button>
          <button
            type="button"
            className="mobile-menu nav-action-btn"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="mobile-panel container">
          {navItems.map((item) => (
            <button type="button" key={item.path} onClick={() => goTo(item.path)}>{item.label}</button>
          ))}
          <button type="button" onClick={() => goTo('/certificats-tracabilite')}>Certificats</button>
          <button type="button" onClick={() => goTo('/contact')}>Contact</button>
          <button type="button" onClick={() => goTo('/faq')}>FAQ</button>
          <button type="button" onClick={() => goTo('/mentions-legales')}>Mentions légales</button>
        </div>
      ) : null}
    </header>
  );
}
