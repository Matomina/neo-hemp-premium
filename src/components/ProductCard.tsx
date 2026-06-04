import { ArrowRight, FileText, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
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
      <button
        type="button"
        className={`product-visual ${product.imageTone}`}
        onClick={() => onView(product)}
        aria-label={`Voir la fiche ${product.name}`}
      >
        <span className="product-ring" />
        <div className={`product-pack-art ${product.imageTone}`}>
          <span className="pack-cat">{product.category}</span>
          <span className="pack-name">{product.name.slice(0, 10)}</span>
          <span className="pack-line" />
          {product.cbdRate ? <span className="pack-cbd">CBD {product.cbdRate}</span> : null}
        </div>
        {product.isBestSeller ? <span className="badge-bestseller"><Sparkles size={11} /> Best-seller</span> : null}
        {product.isNew && !product.isBestSeller ? <span className="badge-new">Nouveau</span> : null}
        {product.certificateAvailable ? <span className="badge-cert"><ShieldCheck size={11} /> Certifié</span> : null}
      </button>

      <div className="product-info">
        <div className="product-cat-label">{categoryLabels[product.category]}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-meta-tags">
          {product.cbdRate ? <span className="meta-tag cbd">CBD {product.cbdRate}</span> : null}
          <span className="meta-tag">THC {product.thcRate}</span>
          {product.certificateAvailable ? (
            <span className="meta-tag"><FileText size={10} /> Certificat dispo</span>
          ) : null}
        </div>
        <div className="product-footer-row">
          <span className="product-price-label">{product.price.toFixed(2).replace('.', ',')} €</span>
          <div className="product-actions">
            <button type="button" className="btn-view" onClick={() => onView(product)}>
              Voir <ArrowRight size={13} />
            </button>
            <button
              type="button"
              className="btn-add-cart"
              onClick={() => onAdd(product)}
              aria-label={`Ajouter ${product.name} au panier`}
              title="Ajouter au panier"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
