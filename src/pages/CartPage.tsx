import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award, CreditCard, Lock, Minus, Package,
  Plus, ShieldCheck, Trash2, Truck,
} from 'lucide-react';
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

  const shipping = total > 49 || total === 0 ? 0 : 4.90;
  const finalTotal = total + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      if (ENV.IS_MOCK) {
        await new Promise(r => setTimeout(r, 600));
        navigate('/confirmation', { state: { fromCheckout: true } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      await ordersApi.submit({
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        customerEmail: email,
        customerName: fullName,
        addressLine1: address,
        postalCode,
        city,
        country: 'FR',
        adultConfirmed,
        termsAccepted,
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
    <section className="page-section">

      {/* ── Hero visuel ── */}
      <div className="cart-hero">
        <div className="cart-hero-orb cart-hero-orb--green" />
        <div className="cart-hero-orb cart-hero-orb--violet" />
        <div className="cart-hero-inner container">
          <div className="cart-hero-badge">
            <Award size={13} />
            <span>Sélection Premium CBD</span>
          </div>
          <h1 className="cart-hero-title">
            Votre <span className="cart-hero-title-accent">commande</span>
          </h1>
          <p className="cart-hero-sub">
            Produits conformes · THC ≤ 0,3 % · Certificats laboratoire vérifiés
          </p>
          <div className="cart-hero-chips">
            <span className="cart-hero-chip"><Lock size={11} /> Paiement sécurisé</span>
            <span className="cart-hero-chip"><Truck size={11} /> Expédition 24–48 h</span>
            <span className="cart-hero-chip"><ShieldCheck size={11} /> Conformité garantie</span>
          </div>
        </div>
      </div>

      {/* ── Corps de page ── */}
      <div className="container cart-body">
        <div className="cart-layout">

          {/* ─── Colonne gauche ─── */}
          <div className="cart-col-left">

            {/* Récap articles */}
            <div className="cart-block">
              <div className="cart-block-header">
                <Package size={16} className="cart-block-icon" />
                <span className="cart-block-title">
                  {items.length === 0
                    ? 'Votre panier est vide'
                    : `${items.length} article${items.length > 1 ? 's' : ''} sélectionné${items.length > 1 ? 's' : ''}`}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="cart-empty-icon-wrap">
                    <Package size={36} />
                  </div>
                  <p className="cart-empty-text">Aucun article dans votre panier.</p>
                  <button type="button" className="ghost-button" onClick={() => navigate('/boutique')}>
                    Découvrir la boutique
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {items.map((item) => (
                    <div className="cart-product-row" key={item.id}>
                      <div className="cart-product-thumb">
                        <span className="cart-product-thumb-dot" />
                      </div>
                      <div className="cart-product-info">
                        <p className="cart-product-name">{item.name}</p>
                        <p className="cart-product-price">{item.price.toFixed(2).replace('.', ',')} € / unité</p>
                      </div>
                      <div className="cart-product-actions">
                        <div className="cart-qty-control">
                          <button
                            type="button"
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            aria-label="Diminuer"
                          >
                            <Minus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            aria-label="Augmenter"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <strong className="cart-product-subtotal">
                          {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                        </strong>
                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Retirer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Récapitulatif */}
            {items.length > 0 && (
              <div className="cart-block cart-summary-block">
                <div className="cart-summary-line">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="cart-summary-line">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'cart-free-label' : ''}>
                    {shipping === 0 ? (total === 0 ? '—' : 'Offerte') : `${shipping.toFixed(2).replace('.', ',')} €`}
                  </span>
                </div>
                {total > 0 && total < 49 && (
                  <p className="cart-free-hint">
                    Plus que {(49 - total).toFixed(2).replace('.', ',')} € pour la livraison offerte
                  </p>
                )}
                <div className="cart-summary-total">
                  <span>Total estimé</span>
                  <strong>{finalTotal.toFixed(2).replace('.', ',')} €</strong>
                </div>
              </div>
            )}

            {/* Badges confiance */}
            <div className="cart-trust-row">
              <div className="cart-trust-item">
                <CreditCard size={14} />
                <span>Paiement déclenché après validation admin</span>
              </div>
              <div className="cart-trust-item">
                <ShieldCheck size={14} />
                <span>THC ≤ 0,3 % · Conformité réglementaire</span>
              </div>
              <div className="cart-trust-item">
                <Truck size={14} />
                <span>Expédition suivie 24–48 h ouvrées</span>
              </div>
            </div>
          </div>

          {/* ─── Colonne droite : formulaire ─── */}
          <div className="cart-col-right">
            <div className="cart-block checkout-block">
              <div className="cart-block-header">
                <Truck size={16} className="cart-block-icon" />
                <span className="cart-block-title">Informations de livraison</span>
              </div>

              <p className="checkout-notice-box">
                <ShieldCheck size={14} />
                <span>
                  Votre commande sera validée par notre équipe avant tout paiement.
                  Vous recevrez la facture et le lien de règlement sécurisé par email.
                </span>
              </p>

              {error && <div className="checkout-alert">{error}</div>}

              <form className="checkout-form-v2" onSubmit={handleCheckout}>
                <div className="cf-field">
                  <label htmlFor="co-email">Adresse e-mail *</label>
                  <input
                    id="co-email"
                    type="email"
                    placeholder="votre@email.fr"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required={!ENV.IS_MOCK}
                    autoComplete="email"
                  />
                </div>
                <div className="cf-field">
                  <label htmlFor="co-name">Nom et prénom *</label>
                  <input
                    id="co-name"
                    placeholder="Marie Dupont"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required={!ENV.IS_MOCK}
                    autoComplete="name"
                  />
                </div>
                <div className="cf-field">
                  <label htmlFor="co-address">Adresse de livraison *</label>
                  <input
                    id="co-address"
                    placeholder="12 rue des Lilas"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required={!ENV.IS_MOCK}
                    autoComplete="street-address"
                  />
                </div>
                <div className="cf-row">
                  <div className="cf-field">
                    <label htmlFor="co-postal">Code postal *</label>
                    <input
                      id="co-postal"
                      placeholder="75001"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      required={!ENV.IS_MOCK}
                      autoComplete="postal-code"
                    />
                  </div>
                  <div className="cf-field">
                    <label htmlFor="co-city">Ville *</label>
                    <input
                      id="co-city"
                      placeholder="Paris"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      required={!ENV.IS_MOCK}
                      autoComplete="address-level2"
                    />
                  </div>
                </div>

                <div className="cf-checks">
                  <label className="cf-check">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={e => setTermsAccepted(e.target.checked)}
                      required={!ENV.IS_MOCK}
                    />
                    <span>
                      J'accepte les{' '}
                      <a href="/cgv" target="_blank" rel="noreferrer">CGV</a>{' '}
                      et les conditions d'utilisation
                    </span>
                  </label>
                  <label className="cf-check">
                    <input
                      type="checkbox"
                      checked={adultConfirmed}
                      onChange={e => setAdultConfirmed(e.target.checked)}
                      required={!ENV.IS_MOCK}
                    />
                    <span>Je confirme être majeur (18 ans et plus)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="primary-button cf-submit"
                  disabled={loading || items.length === 0}
                >
                  {loading
                    ? 'Envoi en cours…'
                    : ENV.IS_MOCK
                      ? 'Simuler la validation'
                      : 'Soumettre la commande'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
