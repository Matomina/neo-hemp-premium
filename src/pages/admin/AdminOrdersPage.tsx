import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { listOrders } from '../../services/adminApi';

interface Order { id: string; publicRef: string; customerName: string; customerEmail: string; totalCents: number; status: string; createdAt: string }

function formatEuros(c: number) { return `${(c / 100).toFixed(2).replace('.', ',')} €`; }

const STATUS_LABELS: Record<string, string> = {
  CART_SUBMITTED: 'Soumis', PENDING_ADMIN_REVIEW: 'En attente validation',
  APPROVED: 'Approuvé', PAYMENT_SENT: 'Paiement envoyé',
  PAID: 'Payé', CANCELLED: 'Annulé', REFUNDED: 'Remboursé',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listOrders().then(r => { setOrders(r.items as Order[]); setTotal(r.total); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1 className="admin-page-title">Commandes <span className="admin-count">({total})</span></h1>
        {loading ? <div className="admin-loading">Chargement...</div> : (
          <div className="admin-card">
            <table className="admin-table">
              <thead><tr><th>Réf.</th><th>Client</th><th>Email</th><th>Total</th><th>Statut</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td><code className="admin-ref">{o.publicRef}</code></td>
                    <td>{o.customerName}</td>
                    <td>{o.customerEmail}</td>
                    <td>{formatEuros(o.totalCents)}</td>
                    <td><span className="admin-status-badge">{STATUS_LABELS[o.status] ?? o.status}</span></td>
                    <td>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td><Link to={`/admin/commandes/${o.id}`} className="admin-btn-sm">Voir</Link></td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={7} className="admin-empty">Aucune commande</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
