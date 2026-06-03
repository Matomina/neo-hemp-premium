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
  { path: '/boutique', label: 'Produits' },
  { path: '/categorie/fleurs', label: 'Fleurs' },
  { path: '/categorie/resines', label: 'Résines' },
  { path: '/a-propos', label: 'À propos' },
  { path: '/guide-cbd-legal', label: 'Guide' },
  { path: '/forum-live', label: 'Forum live' },
  { path: '/contact', label: 'Contact' },
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

  return (
    <header className="site-header">
      <div className="topbar">
        <span>Culture Bio Diamant</span>
        <span>100% naturel premium</span>
        <span>Contrôlé & certifié</span>
        <span>Univers noir néon</span>
      </div>

      <nav className="navbar container" aria-label="Navigation principale">
        <button className="brand" onClick={() => goTo('/')} aria-label="Retour à l’accueil Culture Bio Diamant">
          <span className="brand-mark" aria-hidden="true">CBD</span>
          <span className="brand-copy">
            <strong>Culture Bio Diamant</strong>
            <small>Premium Naturel</small>
          </span>
        </button>

        <div className="nav-links" aria-label="Liens principaux">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={currentPath === item.path ? 'active' : ''}
              onClick={() => goTo(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button onClick={() => goTo('/boutique')} aria-label="Rechercher dans la boutique">
            <Search size={20} />
          </button>
          <button onClick={() => goTo('/connexion')} aria-label="Connexion client">
            <UserRound size={20} />
          </button>
          <button className="cart-button" onClick={() => goTo('/panier')} aria-label="Voir le panier">
            <ShoppingBag size={20} />
            <span>{cartCount}</span>
          </button>
          <button
            className="mobile-menu"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="mobile-panel container">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => goTo(item.path)}>
              {item.label}
            </button>
          ))}
          <button onClick={() => goTo('/categorie/cosmetiques')}>Cosmétiques</button>
          <button onClick={() => goTo('/categorie/accessoires')}>Accessoires</button>
          <button onClick={() => goTo('/certificats-tracabilite')}>Certificats</button>
          <button onClick={() => goTo('/mentions-legales')}>Mentions légales</button>
        </div>
      ) : null}
    </header>
  );
}
