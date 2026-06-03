import { ShieldCheck, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { categoryLabels } from '../data/products';

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
  onView: (product: Product) => void;
};

export function ProductCard({ product, onAdd, onView }: ProductCardProps) {
  return (
    <article className="product-card">
      <button className={`product-visual ${product.imageTone}`} onClick={() => onView(product)} aria-label={`Voir ${product.name}`}>
        <span className="product-orb" />
        <span className="product-pack">{product.name.slice(0, 2).toUpperCase()}</span>
      </button>
      <div className="product-content">
        <div className="product-meta">
          <span>{categoryLabels[product.category]}</span>
          <span>{product.cbdRate ?? product.label}</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="badges">
          {product.badges.map((badge) => <span key={badge}><ShieldCheck size={14} /> {badge}</span>)}
        </div>
        <div className="product-footer">
          <strong>{product.price.toFixed(2).replace('.', ',')} €</strong>
          <button onClick={() => onAdd(product)}><ShoppingCart size={17} /> Ajouter</button>
        </div>
      </div>
    </article>
  );
}
