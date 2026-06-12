import { AdminLayout } from '../../components/admin/AdminLayout';
import { ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="admin-page">
        <h1 className="admin-page-title">Réglages</h1>
        <div className="admin-detail-grid">
          <div className="admin-card">
            <h3>Stripe</h3>
            <p className="admin-notice"><ShieldCheck size={14} /> Le paiement Stripe reste en mode test. Ne pas activer <code>STRIPE_ENABLED=true</code> en production avant validation conformité CBD et compte Stripe autorisé.</p>
            <ul className="admin-list">
              <li>Variable : <code>STRIPE_ENABLED</code> (actuellement <code>false</code>)</li>
              <li>Tester en local avec Stripe CLI : <code>stripe listen --forward-to localhost:4000/api/stripe/webhook</code></li>
              <li>Clé de test : commencer par <code>sk_test_</code></li>
            </ul>
          </div>
          <div className="admin-card">
            <h3>Emails</h3>
            <p className="admin-notice">En l'absence de SMTP configuré, les emails sont loggés en console (mode SKIPPED_DEV).</p>
            <ul className="admin-list">
              <li>Variables : <code>SMTP_HOST</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code></li>
              <li>L'historique des emails est visible dans la table <code>EmailLog</code></li>
            </ul>
          </div>
          <div className="admin-card">
            <h3>Conformité CBD</h3>
            <p className="admin-notice">Aucune promesse médicale ou thérapeutique. Produits soumis à contrôle de conformité. Taux THC &lt; 0,3%.</p>
            <ul className="admin-list">
              <li>Chaque produit doit avoir un certificat d'analyse et un lot renseigné avant publication.</li>
              <li>Le champ <code>requiresComplianceReview</code> doit être <code>false</code> avant activation.</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
