import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { listInvoices, regeneratePdf, downloadInvoicePdf } from '../../services/adminApi';

interface Invoice { id: string; invoiceNumber: string; type: string; status: string; amountCents: number; issuedAt: string | null; paidAt: string | null; pdfPath: string | null }

function formatEuros(c: number) { return `${(c / 100).toFixed(2).replace('.', ',')} €`; }

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');
  const [msg, setMsg] = useState('');

  const reload = () => listInvoices().then(r => { setInvoices(r.items as Invoice[]); setTotal(r.total); }).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { void reload(); }, []);

  const regen = async (id: string) => {
    setWorking(id); setMsg('');
    try { await regeneratePdf(id); setMsg('PDF régénéré'); void reload(); }
    catch (e) { setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`); }
    finally { setWorking(''); }
  };

  const download = async (id: string) => {
    setWorking(id); setMsg('');
    try { await downloadInvoicePdf(id); }
    catch (e) { setMsg(`Erreur téléchargement : ${e instanceof Error ? e.message : String(e)}`); }
    finally { setWorking(''); }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1 className="admin-page-title">Factures <span className="admin-count">({total})</span></h1>
        {msg && <div className="admin-msg">{msg}</div>}
        {loading ? <div className="admin-loading">Chargement...</div> : (
          <div className="admin-card">
            <table className="admin-table">
              <thead><tr><th>N°</th><th>Type</th><th>Statut</th><th>Montant</th><th>Émise le</th><th>PDF</th><th></th></tr></thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td><code className="admin-ref">{inv.invoiceNumber}</code></td>
                    <td>{inv.type === 'QUOTE' ? 'Devis' : 'Commande'}</td>
                    <td><span className="admin-status-badge">{inv.status}</span></td>
                    <td>{formatEuros(inv.amountCents)}</td>
                    <td>{inv.issuedAt ? new Date(inv.issuedAt).toLocaleDateString('fr-FR') : '—'}</td>
                    <td>
                      {inv.pdfPath
                        ? (
                          <button
                            type="button"
                            className="admin-btn-sm"
                            disabled={working === inv.id}
                            onClick={() => download(inv.id)}
                          >
                            {working === inv.id ? '...' : 'Télécharger'}
                          </button>
                        )
                        : <span className="admin-muted">Aucun</span>}
                    </td>
                    <td><button type="button" className="admin-btn-sm" disabled={working === inv.id} onClick={() => regen(inv.id)}>Régénérer PDF</button></td>
                  </tr>
                ))}
                {invoices.length === 0 && <tr><td colSpan={7} className="admin-empty">Aucune facture</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
