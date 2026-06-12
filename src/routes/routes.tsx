import { Routes, Route } from 'react-router-dom';
import { AdminRoute } from '../components/admin/AdminRoute';
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';
import AboutPage from '../pages/AboutPage';
import ForumPage from '../pages/ForumPage';
import LoginPage from '../pages/LoginPage';
import LegalPage from '../pages/LegalPage';
import GuidePage from '../pages/GuidePage';
import CertificatesPage from '../pages/CertificatesPage';
import FaqPage from '../pages/FaqPage';
import ContactPage from '../pages/ContactPage';
import ConfirmationPage from '../pages/ConfirmationPage';
import DeliveryPage from '../pages/DeliveryPage';
import NotFoundPage from '../pages/NotFoundPage';
// Admin pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminQuotesPage from '../pages/admin/AdminQuotesPage';
import AdminQuoteDetailPage from '../pages/admin/AdminQuoteDetailPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from '../pages/admin/AdminOrderDetailPage';
import AdminContactsPage from '../pages/admin/AdminContactsPage';
import AdminContactDetailPage from '../pages/admin/AdminContactDetailPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminInvoicesPage from '../pages/admin/AdminInvoicesPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* ── Public routes ──────────────────────────────────────────────────── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/boutique" element={<ShopPage />} />
      <Route path="/produits" element={<ShopPage />} />
      <Route path="/categorie/:category" element={<ShopPage />} />
      <Route path="/produit/:slug" element={<ProductPage />} />
      <Route path="/panier" element={<CartPage />} />
      <Route path="/checkout" element={<CartPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/a-propos" element={<AboutPage />} />
      <Route path="/forum-live" element={<ForumPage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/compte" element={<LoginPage />} />
      <Route path="/guide-cbd-legal" element={<GuidePage />} />
      <Route path="/certificats-tracabilite" element={<CertificatesPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/livraison-retours" element={<DeliveryPage />} />
      <Route path="/mentions-legales" element={<LegalPage />} />
      <Route path="/cgv" element={<LegalPage />} />
      <Route path="/confidentialite" element={<LegalPage />} />
      <Route path="/cookies" element={<LegalPage />} />
      <Route path="/retractation" element={<LegalPage />} />
      <Route path="/politique-confidentialite" element={<LegalPage />} />
      <Route path="/politique-cookies" element={<LegalPage />} />
      <Route path="/droit-de-retractation" element={<LegalPage />} />

      {/* ── Admin routes ───────────────────────────────────────────────────── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/devis" element={<AdminRoute><AdminQuotesPage /></AdminRoute>} />
      <Route path="/admin/devis/:id" element={<AdminRoute><AdminQuoteDetailPage /></AdminRoute>} />
      <Route path="/admin/commandes" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
      <Route path="/admin/commandes/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
      <Route path="/admin/contacts" element={<AdminRoute><AdminContactsPage /></AdminRoute>} />
      <Route path="/admin/contacts/:id" element={<AdminRoute><AdminContactDetailPage /></AdminRoute>} />
      <Route path="/admin/produits" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
      <Route path="/admin/factures" element={<AdminRoute><AdminInvoicesPage /></AdminRoute>} />
      <Route path="/admin/reglages" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
