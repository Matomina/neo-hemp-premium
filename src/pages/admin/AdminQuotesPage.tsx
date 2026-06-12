import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { listQuotes } from '../../services/adminApi';

interface Quote { id: string; publicRef: string; customerSnapshot: { name: string; email: string }; totalCents: number; status: string; createdAt: string }

function formatEuros(c: number) { return `${(c / 100).toFixed(2).replace('.', ',')} €`; }

const STATUS_LABELS: Record<string, string> = { NEW: 'Nouveau', REVIEWED: 'En cours', APPROVED: 'Approuvé', PAYMENT_SENT: 'Paiement envoyé', PAID: 'Payé', CANCELLED: 'Annulé', EXPIRED: 'Expiré' };

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listQuotes().then(r => { setQuotes(r.items as Quote[]); setTotal(r.total); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1 className="admin-page-title">Demandes de devis <span className="admin-count">({total})</span></h1>
        {loading ? <div className="admin-loading">Chargement...</div> : (
          <div className="admin-card">
            <table className="admin-table">
              <thead><tr><th>Réf.</th><th>Client</th><th>Email</th><th>Total</th><th>Statut</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {quotes.map(q => (
                  <tr key={q.id}>
                    <td><code className="admin-ref">{q.publicRef}</code></td>
                    <td>{q.customerSnapshot?.name}</td>
                    <td>{q.customerSnapshot?.email}</td>
                    <td>{formatEuros(q.totalCents)}</td>
                    <td><span className="admin-status-badge">{STATUS_LABELS[q.status] ?? q.status}</span></td>
                    <td>{new Date(q.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td><Link to={`/admin/devis/${q.id}`} className="admin-btn-sm">Voir</Link></td>
                  </tr>
                ))}
                {quotes.length === 0 && <tr><td colSpan={7} className="admin-empty">Aucune demande de devis</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
