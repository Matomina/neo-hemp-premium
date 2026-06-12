import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/admin/useAdminAuth';
import { LayoutDashboard, FileText, ShoppingCart, MessageSquare, Package, Receipt, LogOut, Gem, Settings } from 'lucide-react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/devis', icon: FileText, label: 'Devis' },
  { path: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { path: '/admin/factures', icon: Receipt, label: 'Factures' },
  { path: '/admin/contacts', icon: MessageSquare, label: 'Contacts' },
  { path: '/admin/produits', icon: Package, label: 'Produits' },
  { path: '/admin/reglages', icon: Settings, label: 'Réglages' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Gem size={20} />
          <span>Admin CBD</span>
        </div>
        <nav className="admin-nav">
          {navItems.map(({ path, icon: Icon, label, exact }) => {
            const active = exact ? location.pathname === path : location.pathname.startsWith(path);
            return (
              <Link key={path} to={path} className={`admin-nav-item${active ? ' active' : ''}`}>
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <span className="admin-user-email">{user?.email}</span>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
