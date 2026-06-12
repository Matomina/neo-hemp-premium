import { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { contactApi } from '../services/contactApi';
import { CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setError('');
    try {
      await contactApi.send({ name, email, subject: subject || undefined, message });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Contact"
        title="Support client"
        text="Notre équipe vous répond sous 24–48h ouvrées. Aucune promesse médicale ou thérapeutique liée aux produits CBD."
      />
      <div className="guide-grid">
        {sent ? (
          <div className="quality-card quality-card--centered">
            <CheckCircle2 size={40} className="contact-success-icon" />
            <h3>Message envoyé</h3>
            <p>Merci ! Nous vous répondrons sous 24–48h ouvrées.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Envoyer un message</h3>
            {error && <p className="contact-error">{error}</p>}
            <input
              placeholder="Votre nom *"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              placeholder="Votre email *"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Sujet (optionnel)"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
            <textarea
              placeholder="Votre message *"
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        )}
        <div className="quality-card">
          <h3>Nous contacter</h3>
          <p>L'équipe Culture Bio Diamant reste disponible pour toute question sur les produits, la conformité ou la livraison.</p>
        </div>
      </div>
    </section>
  );
}
