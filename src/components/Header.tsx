import { Menu, Search, ShoppingBag, UserRound } from 'lucide-react';

type HeaderProps = {
  cartCount: number;
  onNavigate: (section: string) => void;
};

const navItems = [
  ['boutique', 'Boutique'],
  ['fleurs', 'Fleurs'],
  ['resines', 'Résines'],
  ['cosmetiques', 'Cosmétiques'],
  ['accessoires', 'Accessoires'],
  ['guide', 'Guide CBD'],
  ['faq', 'FAQ'],
];

export function Header({ cartCount, onNavigate }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="topbar">Produits contrôlés • THC conforme • Livraison suivie • Démarche responsable</div>
      <nav className="navbar container" aria-label="Navigation principale">
        <button className="mobile-menu" aria-label="Ouvrir le menu">
          <Menu size={22} />
        </button>
        <button className="brand" onClick={() => onNavigate('home')}>
          <span className="brand-mark">NH</span>
          <span>
            <strong>Neo Hemp</strong>
            <small>Premium CBD</small>
          </span>
        </button>
        <div className="nav-links">
          {navItems.map(([target, label]) => (
            <button key={target} onClick={() => onNavigate(target)}>{label}</button>
          ))}
        </div>
        <div className="nav-actions">
          <button aria-label="Rechercher"><Search size={20} /></button>
          <button aria-label="Compte client"><UserRound size={20} /></button>
          <button className="cart-button" onClick={() => onNavigate('panier')} aria-label="Voir le panier">
            <ShoppingBag size={20} />
            <span>{cartCount}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
