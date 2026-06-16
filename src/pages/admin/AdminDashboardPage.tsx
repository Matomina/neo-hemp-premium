import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, FileText, MessageSquare, Receipt, TrendingUp, Clock } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getDashboardSummary, getDashboardActivity } from '../../services/adminApi';

interface Summary {
  orders: { total: number; pending: number; revenueCents: number };
  quotes: { total: number; pending: number };
  contacts: { total: number; unread: number };
  invoices: { total: number; paid: number };
}

interface Activity {
  recentOrders: Array<{ id: string; publicRef: string; customerName: string; totalCents: number; status: string; createdAt: string }>;
  recentQuotes: Array<{ id: string; publicRef: string; customerSnapshot: unknown; totalCents: number; status: string; createdAt: string }>;
  recentContacts: Array<{ id: string; name: string; email: string; subject: string | null; isRead: boolean; createdAt: string }>;
}

function formatEuros(cents: number) { return `${(cents / 100).toFixed(2).replace('.', ',')} €`; }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString('fr-FR'); }

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardSummary(), getDashboardActivity()])
      .then(([s, a]) => { setSummary(s as unknown as Summary); setActivity(a as unknown as Activity); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1 className="admin-page-title">Dashboard</h1>

        {loading ? <div className="admin-loading">Chargement...</div> : summary && (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <ShoppingCart size={20} />
                <div className="admin-stat-body">
                  <span className="admin-stat-value">{summary.orders.total}</span>
                  <span className="admin-stat-label">Commandes</span>
                  {summary.orders.pending > 0 && <span className="admin-stat-badge">{summary.orders.pending} en attente</span>}
                </div>
              </div>
              <div className="admin-stat-card">
                <TrendingUp size={20} />
                <div className="admin-stat-body">
                  <span className="admin-stat-value">{formatEuros(summary.orders.revenueCents)}</span>
                  <span className="admin-stat-label">Revenu total</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <FileText size={20} />
                <div className="admin-stat-body">
                  <span className="admin-stat-value">{summary.quotes.total}</span>
                  <span className="admin-stat-label">Devis</span>
                  {summary.quotes.pending > 0 && <span className="admin-stat-badge">{summary.quotes.pending} nouveaux</span>}
                </div>
              </div>
              <div className="admin-stat-card">
                <MessageSquare size={20} />
                <div className="admin-stat-body">
                  <span className="admin-stat-value">{summary.contacts.total}</span>
                  <span className="admin-stat-label">Contacts</span>
                  {summary.contacts.unread > 0 && <span className="admin-stat-badge">{summary.contacts.unread} non lus</span>}
                </div>
              </div>
              <div className="admin-stat-card">
                <Receipt size={20} />
                <div className="admin-stat-body">
                  <span className="admin-stat-value">{summary.invoices.paid}</span>
                  <span className="admin-stat-label">Factures payées</span>
                </div>
              </div>
            </div>

            {activity && (
              <div className="admin-activity-grid">
                <div className="admin-card">
                  <h3 className="admin-card-title"><Clock size={15} /> Dernières commandes</h3>
                  <table className="admin-table">
                    <thead><tr><th>Réf.</th><th>Client</th><th>Total</th><th>Statut</th><th>Date</th></tr></thead>
                    <tbody>
                      {activity.recentOrders.map(o => (
                        <tr key={o.id}>
                          <td><Link to={`/admin/commandes/${o.id}`} className="admin-link">{o.publicRef}</Link></td>
                          <td>{o.customerName}</td>
                          <td>{formatEuros(o.totalCents)}</td>
                          <td><span className="admin-status-badge">{o.status}</span></td>
                          <td>{formatDate(o.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-title"><Clock size={15} /> Derniers contacts</h3>
                  <table className="admin-table">
                    <thead><tr><th>Nom</th><th>Sujet</th><th>Statut</th><th>Date</th></tr></thead>
                    <tbody>
                      {activity.recentContacts.map(c => (
                        <tr key={c.id}>
                          <td><Link to={`/admin/contacts/${c.id}`} className="admin-link">{c.name}</Link></td>
                          <td>{c.subject ?? '—'}</td>
                          <td><span className={`admin-status-badge ${c.isRead ? '' : 'unread'}`}>{c.isRead ? 'Lu' : 'Non lu'}</span></td>
                          <td>{formatDate(c.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
