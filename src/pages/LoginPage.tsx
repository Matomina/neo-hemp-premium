import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Star, User } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { ENV } from '../config/env';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const { login, register, user, logout } = useCustomerAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (user) {
    return (
      <section className="section container page-section">
        <div className="login-wrapper">
          <div className="login-card login-card--active">
            <div className="login-card-icon">
              <User size={32} />
            </div>
            <h2 className="login-card-title">Bonjour, {user.firstName ?? user.email}</h2>
            <p className="login-card-sub">Vous êtes connecté à votre espace client Culture Bio Diamant.</p>
            <div className="login-user-info">
              <span className="login-user-email">{user.email}</span>
            </div>
            <div className="login-actions">
              <button type="button" className="primary-button" onClick={() => navigate('/boutique')}>
                Accéder à la boutique
              </button>
              <button type="button" className="ghost-button" onClick={logout}>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (ENV.IS_MOCK) {
        await new Promise(r => setTimeout(r, 800));
        setSuccess(mode === 'login' ? 'Connexion simulée avec succès.' : 'Compte créé en simulation.');
        setLoading(false);
        return;
      }

      if (mode === 'login') {
        await login(email, password);
        navigate('/boutique');
      } else {
        await register(email, password, firstName || undefined, lastName || undefined);
        navigate('/boutique');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section container page-section">
      <div className="login-wrapper">

        {/* ── Panel gauche : formulaire ── */}
        <div className="login-card">
          {/* Toggle tabs */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab${mode === 'login' ? ' login-tab--active' : ''}`}
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            >
              Se connecter
            </button>
            <button
              type="button"
              className={`login-tab${mode === 'register' ? ' login-tab--active' : ''}`}
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            >
              Créer un compte
            </button>
          </div>

          <h2 className="login-card-title">
            {mode === 'login' ? 'Connexion à votre espace' : 'Rejoindre Culture Bio Diamant'}
          </h2>
          <p className="login-card-sub">
            {mode === 'login'
              ? 'Accédez à vos commandes, certificats et suivi de livraison.'
              : 'Créez votre compte pour profiter de toute l\'expérience premium.'}
          </p>

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="login-fields-row">
                <div className="login-field">
                  <User size={16} className="login-field-icon" />
                  <input
                    placeholder="Prénom"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div className="login-field">
                  <User size={16} className="login-field-icon" />
                  <input
                    placeholder="Nom"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            )}

            <div className="login-field">
              <Mail size={16} className="login-field-icon" />
              <input
                type="email"
                placeholder="Adresse e-mail *"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <Lock size={16} className="login-field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe *"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={mode === 'register' ? 8 : 1}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-field-toggle"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {mode === 'register' && (
              <p className="login-hint">Le mot de passe doit contenir au minimum 8 caractères.</p>
            )}

            <button
              type="submit"
              className="primary-button login-submit"
              disabled={loading}
            >
              {loading
                ? 'Chargement...'
                : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <p className="login-switch">
            {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
            <button
              type="button"
              className="login-switch-link"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
            >
              {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
            </button>
          </p>
        </div>

        {/* ── Panel droit : avantages ── */}
        <div className="login-benefits">
          <div className="login-benefit-card">
            <ShieldCheck size={22} className="login-benefit-icon" />
            <div>
              <h4>Commandes sécurisées</h4>
              <p>Suivez l'état de chaque commande depuis votre espace personnel, avec historique complet.</p>
            </div>
          </div>
          <div className="login-benefit-card">
            <Star size={22} className="login-benefit-icon" />
            <div>
              <h4>Certificats & traçabilité</h4>
              <p>Accédez directement aux certificats d'analyse associés à vos produits commandés.</p>
            </div>
          </div>
          <div className="login-benefit-card">
            <Mail size={22} className="login-benefit-icon" />
            <div>
              <h4>Suivi de livraison</h4>
              <p>Recevez vos notifications d'expédition et suivez vos colis en temps réel.</p>
            </div>
          </div>
          <div className="login-benefit-card">
            <Lock size={22} className="login-benefit-icon" />
            <div>
              <h4>Données protégées</h4>
              <p>Vos données sont chiffrées et protégées conformément au RGPD. Aucun partage à des tiers.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
