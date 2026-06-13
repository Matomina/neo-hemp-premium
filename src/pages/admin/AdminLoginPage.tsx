import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/admin/useAdminAuth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  if (isAuthenticated) { navigate('/admin', { replace: true }); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-logo-wrap">
            <img src="/cbd-logo.jpeg" alt="Culture Bio Diamant" className="admin-login-logo" />
          </div>
          <h1>Culture Bio Diamant</h1>
          <p className="admin-login-sub"><ShieldCheck size={13} /> Espace administration</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="admin-error">{error}</div>}
          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" autoComplete="email" required />
          </label>
          <label>
            Mot de passe
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required />
          </label>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="admin-login-notice">Accès restreint aux administrateurs autorisés.</p>
      </div>
    </div>
  );
}
