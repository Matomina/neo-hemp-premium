import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { listContacts } from '../../services/adminApi';

interface Contact { id: string; name: string; email: string; subject: string | null; isRead: boolean; status: string; createdAt: string }

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listContacts().then(r => { setContacts(r.items as Contact[]); setTotal(r.total); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1 className="admin-page-title">Messages contact <span className="admin-count">({total})</span></h1>
        {loading ? <div className="admin-loading">Chargement...</div> : (
          <div className="admin-card">
            <table className="admin-table">
              <thead><tr><th>Nom</th><th>Email</th><th>Sujet</th><th>Statut</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id} className={!c.isRead ? 'admin-row-unread' : ''}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.subject ?? '—'}</td>
                    <td><span className={`admin-status-badge ${!c.isRead ? 'unread' : ''}`}>{c.isRead ? 'Lu' : 'Non lu'}</span></td>
                    <td>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td><Link to={`/admin/contacts/${c.id}`} className="admin-btn-sm">Voir</Link></td>
                  </tr>
                ))}
                {contacts.length === 0 && <tr><td colSpan={6} className="admin-empty">Aucun message</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
