import { CreditCard, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useCart } from '../context';
import { useScrollNavigate } from '../hooks/useScrollNavigate';

export default function CartPage() {
  const { items, total, removeFromCart, setQuantity } = useCart();
  const navigate = useScrollNavigate();

  return (
    <section className="section container cart-checkout-grid page-section">
      <div className="cart-panel">
        <SectionTitle
          eyebrow="Panier"
          title="Résumé de commande premium"
          text="Le panier doit rassurer : produits clairs, quantités lisibles, total estimé, rappel de la conformité et tunnel simple."
        />
        {items.length === 0
          ? <p className="empty-cart">Ton panier est vide. Ajoute un produit pour tester le parcours d'achat de la maquette.</p>
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
        <div className="cart-reassurance"><CreditCard size={18} /> Paiement compatible CBD à valider avant production</div>
        <div className="cart-reassurance"><ShieldCheck size={18} /> Produits réels à publier uniquement avec certificats et lots associés</div>
      </div>
      <div className="checkout-panel">
        <SectionTitle
          eyebrow="Checkout"
          title="Tunnel court et rassurant"
          text="Formulaire simulé pour préparer le futur tunnel de commande."
        />
        <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Email" />
          <input placeholder="Nom et prénom" />
          <input placeholder="Adresse de livraison" />
          <label><input type="checkbox" /> J'accepte les conditions d'utilisation et les CGV</label>
          <label><input type="checkbox" /> Je confirme être majeur</label>
          <button type="button" className="primary-button" onClick={() => navigate('/confirmation')}>
            Simuler la validation
          </button>
        </form>
      </div>
    </section>
  );
}
