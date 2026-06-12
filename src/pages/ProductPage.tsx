import { useParams } from 'react-router-dom';
import { categoryLabels, categoryPreviewImages, products } from '../data/products';
import { SectionTitle } from '../components/SectionTitle';
import { useCart } from '../context';
import NotFoundPage from './NotFoundPage';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === slug);
  if (!product) return <NotFoundPage />;

  return (
    <section className="section container product-detail-section page-section">
      <SectionTitle
        eyebrow={categoryLabels[product.category]}
        title={product.name}
        text={product.description}
      />
      <div className="product-detail">
        <div className={`detail-visual ${product.imageTone ?? 'emerald'}`}>
          <img
            src={product.image}
            alt={product.imageAlt ?? product.name}
            className="detail-img"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              const preview = categoryPreviewImages[product.category];
              const fb = `/products/${product.category}/fallback.svg`;
              if (img.src !== preview) { img.src = preview; return; }
              if (img.src !== fb) img.src = fb;
            }}
          />
          <span className="product-orb" />
          <span className="diamond-frame" />
        </div>
        <div className="detail-content">
          <span className="eyebrow">Lot {product.lot ?? '—'}</span>
          <h2>{product.name}</h2>
          <p>{product.details ?? product.description}</p>
          <div className="detail-specs">
            <span>Catégorie : {categoryLabels[product.category]}</span>
            <span>CBD : {product.cbdRate ?? 'Selon fiche produit'}</span>
            <span>THC : {product.thcRate ?? product.thc ?? '< 0,3%'}</span>
            <span>Origine : {product.origin ?? 'Chanvre UE'}</span>
            <span>Lot : {product.lot ?? '—'}</span>
            <span>Certificat : {product.certificateAvailable ? 'Disponible' : 'À compléter'}</span>
          </div>
          <div className="tabs-preview">
            <button type="button">Description</button>
            <button type="button">Analyse / certificat</button>
            <button type="button">Composition</button>
            <button type="button">Précautions</button>
          </div>
          {(product.composition ?? product.complianceNote)
            ? <p className="compliance-box"><strong>Composition :</strong> {product.composition ?? product.complianceNote}</p>
            : null}
          {(product.precautions ?? product.usageNote)
            ? <p className="compliance-box"><strong>Précautions :</strong> {product.precautions ?? product.usageNote}</p>
            : null}
          <button
            type="button"
            className="primary-button"
            onClick={() => addToCart(product)}
          >
            Ajouter au panier — {product.price.toFixed(2).replace('.', ',')} €
          </button>
        </div>
      </div>
    </section>
  );
}
