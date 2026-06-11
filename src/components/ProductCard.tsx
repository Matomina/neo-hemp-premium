import { ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import { categoryLabels, categoryPreviewImages } from '../data/products';

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
  onView: (product: Product) => void;
};

export function ProductCard({ product, onAdd, onView }: ProductCardProps) {
  const previewSrc = categoryPreviewImages[product.category];
  const fallbackSrc = `/products/${product.category}/fallback.svg`;
  const tone = product.imageTone ?? 'emerald';
  const alt = product.imageAlt ?? product.name;
  const meta = product.label ?? product.cbdRate ?? product.badge ?? '';
  const badgeList = product.badges ?? product.highlights.slice(0, 3);

  return (
    <article className="product-card">
      <button
        type="button"
        className={`product-visual ${tone}`}
        onClick={() => onView(product)}
        aria-label={`Voir ${product.name}`}
      >
        <img
          src={product.image}
          alt={alt}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== previewSrc) {
              img.src = previewSrc;
              return;
            }

            if (img.src !== fallbackSrc) img.src = fallbackSrc;
          }}
        />
        <div className="product-img-overlay" aria-hidden="true" />
        <span className="product-orb" aria-hidden="true" />
        <span className="diamond-frame" aria-hidden="true" />
        {product.isBestSeller
          ? <span className="visual-badge"><Sparkles size={13} /> Best-seller</span>
          : null}
        {product.isNew
          ? <span className="visual-badge visual-badge--new">Nouveau</span>
          : null}
      </button>
      <div className="product-content">
        <div className="product-meta">
          <span>{categoryLabels[product.category]}</span>
          <span>{meta}</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className="badges">
          {badgeList.map((b) => (
            <span key={b}><ShieldCheck size={14} /> {b}</span>
          ))}
        </div>
        <div className="product-footer">
          <strong>{product.price.toFixed(2).replace('.', ',')} €</strong>
          <button type="button" onClick={() => onAdd(product)}>
            <ShoppingCart size={17} /> Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
