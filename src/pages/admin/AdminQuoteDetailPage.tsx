import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getQuote, approveQuote, sendQuotePayment, cancelQuote, updateQuote } from '../../services/adminApi';

interface QuoteDetail {
  id: string; publicRef: string; status: string; totalCents: number;
  customerSnapshot: { name: string; email: string; phone?: string };
  items: Array<{ name: string; quantity: number; unitCents: number; totalCents: number }>;
  adminNotes: string | null; clientMessage: string | null;
  createdAt: string; approvedAt: string | null; paidAt: string | null;
}

function formatEuros(c: number) { return `${(c / 100).toFixed(2).replace('.', ',')} €`; }

export default function AdminQuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [msg, setMsg] = useState('');

  const reload = () => {
    if (!id) return;
    getQuote(id).then(q => { setQuote(q as unknown as QuoteDetail); setNotes((q as unknown as QuoteDetail).adminNotes ?? ''); }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(reload, [id]);

  const action = async (fn: () => Promise<unknown>, successMsg: string) => {
    setWorking(true); setMsg('');
    try { await fn(); setMsg(successMsg); reload(); }
    catch (e) { setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`); }
    finally { setWorking(false); }
  };

  if (loading) return <AdminLayout><div className="admin-loading">Chargement...</div></AdminLayout>;
  if (!quote) return <AdminLayout><div className="admin-error">Devis introuvable</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <button type="button" className="admin-back-btn" onClick={() => navigate('/admin/devis')}>← Retour</button>
        <h1 className="admin-page-title">Devis <code>{quote.publicRef}</code></h1>
        {msg && <div className="admin-msg">{msg}</div>}

        <div className="admin-detail-grid">
          <div className="admin-card">
            <h3>Client</h3>
            <p><strong>Nom :</strong> {quote.customerSnapshot.name}</p>
            <p><strong>Email :</strong> {quote.customerSnapshot.email}</p>
            {quote.customerSnapshot.phone && <p><strong>Tél :</strong> {quote.customerSnapshot.phone}</p>}
            {quote.clientMessage && <p><strong>Message :</strong> {quote.clientMessage}</p>}
          </div>

          <div className="admin-card">
            <h3>Statut & montants</h3>
            <p><strong>Statut :</strong> <span className="admin-status-badge">{quote.status}</span></p>
            <p><strong>Total :</strong> <span className="admin-highlight">{formatEuros(quote.totalCents)}</span></p>
            {quote.approvedAt && <p><strong>Approuvé le :</strong> {new Date(quote.approvedAt).toLocaleDateString('fr-FR')}</p>}
            {quote.paidAt && <p><strong>Payé le :</strong> {new Date(quote.paidAt).toLocaleDateString('fr-FR')}</p>}
          </div>

          <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Articles</h3>
            <table className="admin-table">
              <thead><tr><th>Désignation</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr></thead>
              <tbody>
                {(quote.items ?? []).map((item, i) => (
                  <tr key={i}><td>{item.name}</td><td>{item.quantity}</td><td>{formatEuros(item.unitCents)}</td><td>{formatEuros(item.totalCents)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Notes admin</h3>
            <textarea className="admin-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Notes internes..." />
            <button type="button" className="admin-btn" disabled={working} onClick={() => action(() => updateQuote(quote.id, { adminNotes: notes }), 'Notes sauvegardées')}>Sauvegarder les notes</button>
          </div>

          <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Actions</h3>
            <div className="admin-actions-row">
              {quote.status === 'NEW' && <button type="button" className="admin-btn green" disabled={working} onClick={() => action(() => approveQuote(quote.id), 'Devis approuvé + facture générée')}>Approuver + Générer facture</button>}
              {quote.status === 'APPROVED' && <button type="button" className="admin-btn violet" disabled={working} onClick={() => action(() => sendQuotePayment(quote.id), 'Lien paiement envoyé au client')}>Envoyer le paiement</button>}
              {!['PAID', 'CANCELLED'].includes(quote.status) && <button type="button" className="admin-btn red" disabled={working} onClick={() => action(() => cancelQuote(quote.id), 'Devis annulé')}>Annuler</button>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
