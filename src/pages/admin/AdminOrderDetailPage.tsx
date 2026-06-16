import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getOrder, approveOrder, sendOrderPayment, cancelOrder, updateOrder } from '../../services/adminApi';

interface OrderItem { name: string; quantity: number; unitCents: number; totalCents: number }
interface OrderDetail {
  id: string; publicRef: string; status: string; totalCents: number;
  customerName: string; customerEmail: string; customerPhone: string | null;
  customerSnapshot: unknown;
  orderItems: OrderItem[];
  adminNotes: string | null;
  createdAt: string; approvedAt: string | null; paidAt: string | null;
}

function formatEuros(c: number) { return `${(c / 100).toFixed(2).replace('.', ',')} €`; }

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [msg, setMsg] = useState('');

  const reload = () => {
    if (!id) return;
    getOrder(id).then(o => { setOrder(o as unknown as OrderDetail); setNotes((o as unknown as OrderDetail).adminNotes ?? ''); }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(reload, [id]);

  const action = async (fn: () => Promise<unknown>, successMsg: string) => {
    setWorking(true); setMsg('');
    try { await fn(); setMsg(successMsg); reload(); }
    catch (e) { setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`); }
    finally { setWorking(false); }
  };

  if (loading) return <AdminLayout><div className="admin-loading">Chargement...</div></AdminLayout>;
  if (!order) return <AdminLayout><div className="admin-error">Commande introuvable</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <button type="button" className="admin-back-btn" onClick={() => navigate('/admin/commandes')}>← Retour</button>
        <h1 className="admin-page-title">Commande <code>{order.publicRef}</code></h1>
        {msg && <div className="admin-msg">{msg}</div>}

        <div className="admin-detail-grid">
          <div className="admin-card">
            <h3>Client</h3>
            <p><strong>Nom :</strong> {order.customerName}</p>
            <p><strong>Email :</strong> {order.customerEmail}</p>
            {order.customerPhone && <p><strong>Tél :</strong> {order.customerPhone}</p>}
          </div>

          <div className="admin-card">
            <h3>Statut & montants</h3>
            <p><strong>Statut :</strong> <span className="admin-status-badge">{order.status}</span></p>
            <p><strong>Total :</strong> <span className="admin-highlight">{formatEuros(order.totalCents)}</span></p>
            {order.approvedAt && <p><strong>Approuvé le :</strong> {new Date(order.approvedAt).toLocaleDateString('fr-FR')}</p>}
            {order.paidAt && <p><strong>Payé le :</strong> {new Date(order.paidAt).toLocaleDateString('fr-FR')}</p>}
          </div>

          <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Articles commandés</h3>
            <table className="admin-table">
              <thead><tr><th>Désignation</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr></thead>
              <tbody>
                {(order.orderItems ?? []).map((item, i) => (
                  <tr key={i}><td>{item.name}</td><td>{item.quantity}</td><td>{formatEuros(item.unitCents)}</td><td>{formatEuros(item.totalCents)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Notes admin</h3>
            <textarea className="admin-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Notes internes..." />
            <button type="button" className="admin-btn" disabled={working} onClick={() => action(() => updateOrder(order.id, { adminNotes: notes }), 'Notes sauvegardées')}>Sauvegarder</button>
          </div>

          <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Actions</h3>
            <div className="admin-actions-row">
              {['CART_SUBMITTED', 'PENDING_ADMIN_REVIEW'].includes(order.status) && <button type="button" className="admin-btn green" disabled={working} onClick={() => action(() => approveOrder(order.id), 'Commande approuvée + facture générée')}>Approuver + Générer facture</button>}
              {order.status === 'APPROVED' && <button type="button" className="admin-btn violet" disabled={working} onClick={() => action(() => sendOrderPayment(order.id), 'Lien paiement envoyé au client')}>Envoyer le paiement</button>}
              {!['PAID', 'CANCELLED', 'REFUNDED'].includes(order.status) && <button type="button" className="admin-btn red" disabled={working} onClick={() => action(() => cancelOrder(order.id), 'Commande annulée')}>Annuler</button>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
