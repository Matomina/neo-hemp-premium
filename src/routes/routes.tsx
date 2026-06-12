import { Routes, Route } from 'react-router-dom';
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

export function AppRoutes() {
  return (
    <Routes>
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
