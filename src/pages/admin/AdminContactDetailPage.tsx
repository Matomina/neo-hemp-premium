import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getContact, updateContact } from '../../services/adminApi';

interface ContactMsg { id: string; name: string; email: string; phone: string | null; subject: string | null; message: string; isRead: boolean; adminNotes: string | null; status: string; createdAt: string }

export default function AdminContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactMsg | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [msg, setMsg] = useState('');

  const reload = () => {
    if (!id) return;
    getContact(id).then(c => { setContact(c as unknown as ContactMsg); setNotes((c as unknown as ContactMsg).adminNotes ?? ''); }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => {
    reload();
    if (id) updateContact(id, { isRead: true, status: 'READ' }).catch(() => undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = async () => {
    if (!contact) return;
    setWorking(true);
    try { await updateContact(contact.id, { adminNotes: notes }); setMsg('Notes sauvegardées'); }
    catch { setMsg('Erreur'); }
    finally { setWorking(false); }
  };

  const archive = async () => {
    if (!contact) return;
    setWorking(true);
    try { await updateContact(contact.id, { status: 'ARCHIVED' }); setMsg('Archivé'); reload(); }
    catch { setMsg('Erreur'); }
    finally { setWorking(false); }
  };

  if (loading) return <AdminLayout><div className="admin-loading">Chargement...</div></AdminLayout>;
  if (!contact) return <AdminLayout><div className="admin-error">Message introuvable</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <button type="button" className="admin-back-btn" onClick={() => navigate('/admin/contacts')}>← Retour</button>
        <h1 className="admin-page-title">Message de {contact.name}</h1>
        {msg && <div className="admin-msg">{msg}</div>}

        <div className="admin-detail-grid">
          <div className="admin-card">
            <h3>Expéditeur</h3>
            <p><strong>Nom :</strong> {contact.name}</p>
            <p><strong>Email :</strong> {contact.email}</p>
            {contact.phone && <p><strong>Tél :</strong> {contact.phone}</p>}
            <p><strong>Date :</strong> {new Date(contact.createdAt).toLocaleString('fr-FR')}</p>
          </div>

          <div className="admin-card">
            <h3>Message</h3>
            {contact.subject && <p><strong>Sujet :</strong> {contact.subject}</p>}
            <p style={{ whiteSpace: 'pre-wrap', color: '#ccc' }}>{contact.message}</p>
          </div>

          <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Notes admin</h3>
            <textarea className="admin-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Notes internes..." />
            <div className="admin-actions-row">
              <button type="button" className="admin-btn" disabled={working} onClick={save}>Sauvegarder</button>
              {contact.status !== 'ARCHIVED' && <button type="button" className="admin-btn" disabled={working} onClick={archive}>Archiver</button>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
