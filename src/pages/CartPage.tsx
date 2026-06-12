import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useCart } from '../context';
import { ordersApi } from '../services/ordersApi';
import { ENV } from '../config/env';

export default function CartPage() {
  const { items, total, removeFromCart, setQuantity } = useCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    try {
      if (ENV.IS_MOCK) {
        // No backend configured — navigate to confirmation directly
        navigate('/confirmation', { state: { fromCheckout: true } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      await ordersApi.draft({
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        customerEmail: email,
        customerName: fullName,
        addressLine1: address,
        postalCode,
        city,
        country: 'FR',
        adultConfirmed: true,
        termsAccepted: true,
      });

      navigate('/confirmation', { state: { fromCheckout: true } });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section container cart-checkout-grid page-section">
      <div className="cart-panel">
        <SectionTitle
          eyebrow="Panier"
          title="Résumé de commande premium"
          text="Produits clairs, quantités lisibles, total estimé, rappel de conformité CBD."
        />
        {items.length === 0
          ? <p className="empty-cart">Ton panier est vide. Ajoute un produit pour tester le parcours d'achat.</p>
          : items.map((item) => (
            <div className="cart-row" key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <strong>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
              <div className="cart-actions">
                <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)}>-</button>
                <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
                <button type="button" onClick={() => removeFromCart(item.id)}>Retirer</button>
              </div>
            </div>
          ))}
        <div className="cart-total">
          <span>Total estimé</span>
          <strong>{total.toFixed(2).replace('.', ',')} €</strong>
        </div>
        <div className="cart-reassurance"><CreditCard size={18} /> Paiement CBD compatible — validation admin requise avant débit</div>
        <div className="cart-reassurance"><ShieldCheck size={18} /> Produits soumis à conformité réglementaire (THC &lt; 0,3%)</div>
      </div>

      <div className="checkout-panel">
        <SectionTitle
          eyebrow="Informations de livraison"
          title="Finaliser la commande"
          text="Votre commande sera soumise à validation par notre équipe avant génération de la facture et du lien de paiement."
        />
        {error && <p className="contact-error">{error}</p>}
        <form className="checkout-form" onSubmit={handleCheckout}>
          <input
            placeholder="Email *"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required={!ENV.IS_MOCK}
          />
          <input
            placeholder="Nom et prénom *"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required={!ENV.IS_MOCK}
          />
          <input
            placeholder="Adresse de livraison *"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required={!ENV.IS_MOCK}
          />
          <input
            placeholder="Code postal *"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
            required={!ENV.IS_MOCK}
          />
          <input
            placeholder="Ville *"
            value={city}
            onChange={e => setCity(e.target.value)}
            required={!ENV.IS_MOCK}
          />
          <label>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              required={!ENV.IS_MOCK}
            />
            {' '}J'accepte les conditions d'utilisation et les CGV
          </label>
          <label>
            <input
              type="checkbox"
              checked={adultConfirmed}
              onChange={e => setAdultConfirmed(e.target.checked)}
              required={!ENV.IS_MOCK}
            />
            {' '}Je confirme être majeur (18 ans et plus)
          </label>
          <button
            type="submit"
            className="primary-button"
            disabled={loading || items.length === 0}
          >
            {loading ? 'Envoi en cours...' : ENV.IS_MOCK ? 'Simuler la validation' : 'Soumettre la commande'}
          </button>
        </form>
      </div>
    </section>
  );
}
