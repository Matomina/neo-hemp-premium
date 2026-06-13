import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context';

export default function MiniCart() {
  const [open, setOpen] = useState(false);
  const { items, count, total, removeFromCart, setQuantity } = useCart();
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open && items.length > 0 ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open, items.length]);

  const goToCart = () => {
    setOpen(false);
    navigate('/panier');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mc-wrapper" ref={wrapRef}>
      {/* Bouton flottant */}
      <button
        type="button"
        className={`mc-trigger${count > 0 ? ' mc-trigger--active' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label={`Panier — ${count} article${count > 1 ? 's' : ''}`}
      >
        <ShoppingBag size={22} />
        {count > 0 && <span className="mc-badge">{count > 9 ? '9+' : count}</span>}
      </button>

      {/* Panneau */}
      {open && (
        <div className="mc-panel">
          {/* Header */}
          <div className="mc-header">
            <div className="mc-header-left">
              <ShoppingBag size={16} className="mc-header-icon" />
              <span className="mc-header-title">Mon panier</span>
              {count > 0 && (
                <span className="mc-header-count">{count} article{count > 1 ? 's' : ''}</span>
              )}
            </div>
            <button
              type="button"
              className="mc-close"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Contenu */}
          {items.length === 0 ? (
            <div className="mc-empty">
              <ShoppingBag size={40} className="mc-empty-icon" />
              <p>Votre panier est vide.</p>
              <button
                type="button"
                className="ghost-button mc-shop-btn"
                onClick={() => { setOpen(false); navigate('/boutique'); }}
              >
                Découvrir la boutique
              </button>
            </div>
          ) : (
            <>
              <div className="mc-items">
                {items.map(item => (
                  <div className="mc-item" key={item.id}>
                    <div className="mc-item-thumb">
                      <span className="mc-item-dot" />
                    </div>
                    <div className="mc-item-info">
                      <p className="mc-item-name">{item.name}</p>
                      <p className="mc-item-price">{item.price.toFixed(2).replace('.', ',')} €</p>
                    </div>
                    <div className="mc-item-controls">
                      <button
                        type="button"
                        className="mc-qty-btn"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        aria-label="Diminuer"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="mc-qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        className="mc-qty-btn"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        aria-label="Augmenter"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <strong className="mc-item-total">
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                    </strong>
                    <button
                      type="button"
                      className="mc-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Retirer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mc-footer">
                <div className="mc-total-row">
                  <span>Total estimé</span>
                  <strong>{total.toFixed(2).replace('.', ',')} €</strong>
                </div>
                {total < 49 && (
                  <p className="mc-free-hint">
                    Plus que {(49 - total).toFixed(2).replace('.', ',')} € pour la livraison offerte
                  </p>
                )}
                <button
                  type="button"
                  className="primary-button mc-checkout-btn"
                  onClick={goToCart}
                >
                  Voir le panier & commander <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
