import { useParams } from 'react-router-dom';
import type { CategorySlug } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SectionTitle } from '../components/SectionTitle';
import { categoryDescriptions, categoryLabels, products } from '../data/products';
import { useCart } from '../context';
import { useScrollNavigate } from '../hooks/useScrollNavigate';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ShopPage() {
  const { category } = useParams<{ category?: string }>();
  const categorySlug = category as CategorySlug | undefined;
  const { addToCart } = useCart();
  const navigate = useScrollNavigate();

  useScrollReveal(categorySlug);

  const displayedProducts = categorySlug
    ? products.filter((p) => p.category === categorySlug)
    : products;

  const eyebrow = categorySlug ? categoryLabels[categorySlug] : 'Produits';
  const title = categorySlug
    ? `Catégorie ${categoryLabels[categorySlug]}`
    : 'Tous les produits Culture Bio Diamant';
  const text = categorySlug
    ? categoryDescriptions[categorySlug]
    : 'Une page produits complète, avec des cartes premium, des filtres par catégorie et des fiches détaillées pour préparer la vraie boutique.';

  return (
    <section className="section boutique-section page-section">
      <div className="container">
        <SectionTitle eyebrow={eyebrow} title={title} text={text} />
        <div className="shop-layout">
          <aside className="filters-panel">
            <h3>Filtres</h3>
            <button
              type="button"
              className={!categorySlug ? 'active' : ''}
              onClick={() => navigate('/boutique')}
            >
              Tous les produits
            </button>
            {Object.entries(categoryLabels).map(([slug, label]) => (
              <button
                key={slug}
                type="button"
                className={categorySlug === slug ? 'active' : ''}
                onClick={() => navigate(`/categorie/${slug}`)}
              >
                {label}
              </button>
            ))}
            <div className="legal-note">
              <strong>Sélection responsable</strong>
              <p>La V1 garde une gamme claire : fleurs, résines, cosmétiques et accessoires. Les vrais produits devront être reliés à leurs documents fournisseur.</p>
            </div>
          </aside>
          <div className="product-grid">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
                onView={(p) => navigate(`/produit/${p.slug}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
