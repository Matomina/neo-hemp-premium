import { useState } from 'react';
import { ArrowRight, BadgeCheck, CheckCircle2, FileText, Gem, LockKeyhole, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import type { CategorySlug, Product } from '../types';
import { categoryLabels, categoryPreviewImages, products } from '../data/products';
import { useCart } from '../context';
import { useScrollNavigate } from '../hooks/useScrollNavigate';
import { useScrollReveal } from '../hooks/useScrollReveal';

const homeCategoryCards = [
  { slug: 'fleurs'      as CategorySlug, title: 'Fleurs CBD',       desc: 'Fleurs indoor sélectionnées, taux CBD vérifié par lot, certificats disponibles.' },
  { slug: 'resines'     as CategorySlug, title: 'Résines CBD',      desc: 'Résines CBD documentées, extraction mécanique, origine et lot traçables.' },
  { slug: 'cosmetiques' as CategorySlug, title: 'Cosmétiques CBD',  desc: 'Soins dermo-cosmétiques au CBD, formulés avec exigence et dossier fournisseur.' },
  { slug: 'accessoires' as CategorySlug, title: 'Accessoires',      desc: 'Accessoires sélectionnés pour une expérience optimale, sans substance active.' },
];

const reassuranceItems = [
  { title: 'Sélection vérifiée',        text: 'Fournisseurs audités et produits rigoureusement sélectionnés.' },
  { title: 'Analyses par lot',          text: 'Chaque lot a été analysé en laboratoire pour garantir conformité et qualité.' },
  { title: 'Catalogue maîtrisé',        text: 'Une gamme courte et maîtrisée pour garantir traçabilité et fiabilité.' },
  { title: 'Communication responsable', text: 'Aucune promesse médicale. Informations claires et transparentes.' },
];

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const { addToCart } = useCart();
  const navigate = useScrollNavigate();

  useScrollReveal();

  return (
    <div className="home-split">

      {/* PANNEAU GAUCHE */}
      <div className="home-left">

        {/* ── HERO ── */}
        <section className="hero-main">
          <div className="hero-main-content">
            <span className="hero-eyebrow"><ShieldCheck size={13} /> CBD Premium • Sélection rigoureuse</span>
            <h1 className="hero-headline">
              CBD premium,<br />
              sélectionné avec<br />
              <span className="hero-accent">exigence.</span>
            </h1>
            <p className="hero-sub">
              Des produits à base de chanvre, contrôlés,<br />
              traçables et conformes à la réglementation.
            </p>
            <div className="hero-ctas">
              <button type="button" className="primary-button" onClick={() => navigate('/boutique')}>
                Découvrir la boutique <ArrowRight size={14} />
              </button>
              <button type="button" className="ghost-button" onClick={() => navigate('/guide-cbd-legal')}>
                Comprendre le CBD légal
              </button>
            </div>
          </div>

          <div className="hero-product-visual">
            <img
              src="/generated-sheets/hero-photoreal.png"
              alt="Sélection premium de produits CBD en photographie studio"
              className="hero-flyer-img"
            />
            <div className="hero-product-glow" aria-hidden="true" />
            <div className="hero-float-badge top">
              <BadgeCheck size={12} /> Premium — Lot traçable
            </div>
            <div className="hero-float-badge bottom">
              <PackageCheck size={12} /> THC &lt; 0,30%
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <div className="trust-badges-row">
          <span className="trust-badge"><ShieldCheck size={11} /> THC &lt; 0,30% conforme</span>
          <span className="trust-badge"><FileText size={11} /> Analyses disponibles</span>
          <span className="trust-badge"><Truck size={11} /> Livraison suivie</span>
          <span className="trust-badge"><LockKeyhole size={11} /> Paiement sécurisé</span>
        </div>

        {/* ── CATÉGORIES ── */}
        <section>
          <span className="home-section-label">Catalogue premium</span>
          <div className="cat-grid-4">
            {homeCategoryCards.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                className="cat-card-4"
                onClick={() => navigate(`/categorie/${cat.slug}`)}
              >
                <img
                  src={categoryPreviewImages[cat.slug]}
                  alt=""
                  aria-hidden="true"
                  className="cat-card-4-img"
                  onError={(e) => {
                    const img = e.currentTarget;
                    const preview = categoryPreviewImages[cat.slug];
                    const fb = `/products/${cat.slug}/fallback.svg`;
                    if (img.src !== preview) { img.src = preview; return; }
                    if (img.src !== fb) img.src = fb;
                  }}
                />
                <div className="cat-card-4-overlay" aria-hidden="true" />
                <div className="cat-card-4-body">
                  <div className="cat-card-4-title">{cat.title}</div>
                  <div className="cat-card-4-desc">{cat.desc}</div>
                  <span className="cat-card-4-cta">Explorer <ArrowRight size={10} /></span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── RÉASSURANCE ── */}
        <section>
          <div className="reassurance-grid">
            {reassuranceItems.map(({ title, text }) => (
              <div key={title} className="reassurance-item">
                <div className="reassurance-text">
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BEST-SELLERS TEASER ── */}
        <div className="bestsellers-teaser">
          <div>
            <span className="bestsellers-teaser-eyebrow">Best-sellers</span>
            <h3>Nos produits les plus appréciés</h3>
          </div>
          <button type="button" className="ghost-button" onClick={() => navigate('/boutique')}>
            Voir tout <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* PANNEAU DROIT - BOUTIQUE */}
      <div className="home-right">

        <h2 className="boutique-panel-title">Boutique CBD</h2>
        <p className="boutique-panel-sub">
          Sélection de produits à base de chanvre conformes, traçables et documentés.
        </p>

        {/* Filtres */}
        <div className="boutique-filters">
          {['Catégorie', 'Type', 'THC', 'Prix', 'Popularité'].map((label) => (
            <select key={label} className="boutique-filter-select" aria-label={label}>
              <option>{label}</option>
            </select>
          ))}
        </div>

        {/* Grille compacte */}
        <div className="boutique-product-grid">
          {products.slice(0, 5).map((product) => (
            <button
              key={product.id}
              type="button"
              className={`product-card-sm${selectedProduct.id === product.id ? ' product-card-sm--active' : ''}`}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="product-card-sm-img-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card-sm-img"
                  onError={(e) => {
                    const img = e.currentTarget;
                    const preview = categoryPreviewImages[product.category];
                    const fb = `/products/${product.category}/fallback.svg`;
                    if (img.src !== preview) { img.src = preview; return; }
                    if (img.src !== fb) img.src = fb;
                  }}
                />
              </div>
              <div className="product-card-sm-body">
                <div className="product-card-sm-cat">{categoryLabels[product.category]}</div>
                <div className="product-card-sm-name">{product.name}</div>
                <div className="product-card-sm-rates">
                  {product.cbdRate ? `CBD ${product.cbdRate} · ` : ''}THC {product.thcRate}
                </div>
                <div className="product-card-sm-footer">
                  <span className="product-card-sm-price">
                    {product.price != null ? `${product.price.toFixed(2).replace('.', ',')} €` : '—'}
                  </span>
                  <button
                    type="button"
                    className="product-card-sm-add"
                    aria-label={`Ajouter ${product.name}`}
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  >+</button>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Produit vedette */}
        <div className="boutique-featured">
          <div className="boutique-featured-top">
            <div className="boutique-featured-img-wrap">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="boutique-featured-img"
                onError={(e) => {
                  const img = e.currentTarget;
                  const preview = categoryPreviewImages[selectedProduct.category];
                  const fb = `/products/${selectedProduct.category}/fallback.svg`;
                  if (img.src !== preview) { img.src = preview; return; }
                  if (img.src !== fb) img.src = fb;
                }}
              />
              <div className="boutique-featured-img-glow" aria-hidden="true" />
            </div>
            <div className="boutique-featured-info">
              <span className="boutique-featured-eyebrow">{categoryLabels[selectedProduct.category]}</span>
              <div className="boutique-featured-name">{selectedProduct.name}</div>
              <div className="boutique-featured-desc">{selectedProduct.shortDescription}</div>
              <div className="boutique-featured-price">
                {selectedProduct.price != null ? `${selectedProduct.price.toFixed(2).replace('.', ',')} €` : '—'}
              </div>
              <div className="boutique-featured-stock">● En stock</div>
              <div className="boutique-featured-actions">
                <button type="button" className="boutique-featured-add" onClick={() => addToCart(selectedProduct)}>
                  + Ajouter au panier
                </button>
                <button type="button" className="boutique-featured-wish" aria-label="Favoris">♡</button>
              </div>
            </div>
          </div>

          <div className="boutique-featured-badges">
            <span className="boutique-featured-badge">Livraison 24/48h</span>
            <span className="boutique-featured-badge">Paiement sécurisé</span>
            <span className="boutique-featured-badge">Retours faciles</span>
          </div>

          <div className="boutique-featured-tabs">
            {['Description', 'Caractéristiques', 'Analyses', 'Avis (0)'].map((tab, i) => (
              <button key={tab} type="button" className={`boutique-featured-tab${i === 0 ? ' active' : ''}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="boutique-featured-cert">
            <div className="boutique-cert-specs">
              <div className="boutique-cert-spec"><CheckCircle2 size={10} /> CBD {selectedProduct.cbdRate ?? '—'}</div>
              <div className="boutique-cert-spec"><CheckCircle2 size={10} /> THC {selectedProduct.thcRate ?? selectedProduct.thc ?? '< 0,3%'}</div>
              <div className="boutique-cert-spec"><CheckCircle2 size={10} /> Lot : {selectedProduct.lot ?? '—'}</div>
              <div className="boutique-cert-spec"><CheckCircle2 size={10} /> {selectedProduct.origin ?? 'Chanvre UE'}</div>
            </div>
            {selectedProduct.certificateAvailable
              ? <button type="button" className="boutique-cert-btn">Voir le certificat</button>
              : null}
          </div>
        </div>

        {/* Barre stats confiance */}
        <div className="trust-stats-bar">
          <div className="trust-stats-title">Transparence. Confiance. Conformité.</div>
          <div className="trust-stats-grid">
            {[
              { icon: Gem,          value: '+120', label: 'Produits\nsélectionnés' },
              { icon: FileText,     value: '+100', label: 'Analyses\ndisponibles' },
              { icon: ShieldCheck,  value: '0%',   label: 'THC au-delà\nde la limite légale' },
              { icon: CheckCircle2, value: '100%', label: 'Engagement\nresponsable' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="trust-stat-item">
                <div className="trust-stat-icon"><Icon size={13} /></div>
                <span className="trust-stat-value">{value}</span>
                <span className="trust-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
