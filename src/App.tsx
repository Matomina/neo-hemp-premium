import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, Award, BadgeCheck, Boxes,
  FileText, Gem, Leaf, LockKeyhole, MessageCircle,
  PackageCheck, Search, ShieldCheck, ShoppingBag,
  ShoppingCart, Sparkles, Star, Truck, UserRound,
} from 'lucide-react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { SectionTitle } from './components/SectionTitle';
import { Footer } from './components/Footer';
import { categoryDescriptions, categoryLabels, products } from './data/products';
import {
  aboutBlocks, homepageStory, legalBlocks, liveForumPosts,
  premiumValues, testimonials, whyUs,
} from './data/siteContent';
import { faqs } from './data/faqs';
import type { CartItem, CategorySlug, Product } from './types';
import visualMockup from './assets/maquette-boutique-cbd-visuelle.png';

const ACCESS_KEY = 'culture-bio-diamant-majorite-ok';
const CART_KEY   = 'cbd-cart-v1';

const categoryCards = [
  { slug: 'fleurs'      as CategorySlug, Icon: Leaf,    tone: 'tone-green',  desc: 'Indoor & greenhouse sélectionnés' },
  { slug: 'resines'     as CategorySlug, Icon: Gem,     tone: 'tone-violet', desc: 'Concentrations élevées, traçabilité' },
  { slug: 'cosmetiques' as CategorySlug, Icon: Sparkles, tone: 'tone-gold',  desc: 'Formulations certifiées UE' },
  { slug: 'accessoires' as CategorySlug, Icon: Boxes,   tone: 'tone-silver', desc: 'Kits et matériaux premium' },
];

const whyUsIcons: Record<string, typeof ShieldCheck> = {
  shield: ShieldCheck, cert: BadgeCheck, select: Award, ship: Truck,
};

function App() {
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch { return []; }
  });
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [accessConfirmed, setAccessConfirmed] = useState(
    () => localStorage.getItem(ACCESS_KEY) === 'true'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'popularity'|'newest'|'price-asc'|'price-desc'>('popularity');
  const [activeDetailTab, setActiveDetailTab] = useState<'description'|'specs'|'analysis'|'precautions'>('description');
  const [detailQty, setDetailQty] = useState(1);
  const [checkoutForm, setCheckoutForm] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', postalCode: '', phone: '',
  });

  /* ── CART PERSISTENCE ── */
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  /* ── ROUTING ── */
  useEffect(() => {
    const onPop = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── CART ── */
  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  const addToCart = (product: Product) => {
    setCart((cur) => {
      const exists = cur.find((i) => i.id === product.id);
      if (exists) return cur.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...cur, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart((c) => c.filter((i) => i.id !== id));

  const changeQty = (id: number, dir: 'up'|'down') => {
    setCart((cur) => cur.flatMap((i) => {
      if (i.id !== id) return [i];
      const next = dir === 'up' ? i.quantity + 1 : i.quantity - 1;
      return next <= 0 ? [] : [{ ...i, quantity: next }];
    }));
  };

  /* ── PRODUCT SELECTION ── */
  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setDetailQty(1);
    setActiveDetailTab('description');
    navigate(`/produit/${product.slug}`);
  };

  const confirmAccess = () => {
    localStorage.setItem(ACCESS_KEY, 'true');
    setAccessConfirmed(true);
  };

  /* ── ROUTING HELPERS ── */
  const categoryFromPath = currentPath.startsWith('/categorie/')
    ? currentPath.replace('/categorie/', '') as CategorySlug : null;
  const productFromPath  = currentPath.startsWith('/produit/')
    ? products.find((p) => `/produit/${p.slug}` === currentPath) : null;
  const visibleProduct   = productFromPath ?? selectedProduct;
  const legalPage        = legalBlocks.find((p) => p.path === currentPath);

  /* ── FILTERED PRODUCTS ── */
  const filteredProducts = useMemo(() => {
    let res = activeCategory !== 'all'
      ? products.filter((p) => p.category === activeCategory)
      : [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        categoryLabels[p.category].toLowerCase().includes(q)
      );
    }
    if (sortOrder === 'price-asc')   return [...res].sort((a, b) => a.price - b.price);
    if (sortOrder === 'price-desc')  return [...res].sort((a, b) => b.price - a.price);
    if (sortOrder === 'newest')      return [...res].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return [...res].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }, [activeCategory, searchQuery, sortOrder]);

  /* ══════════════════════════════════════════════
     HOME
  ══════════════════════════════════════════════ */
  const renderHome = () => (
    <>
      {/* HERO */}
      <section className="hero-full">
        <div className="hero-bg">
          <div className="hero-halo hero-halo--green" />
          <div className="hero-halo hero-halo--violet" />
          <div className="hero-halo hero-halo--green-bottom" />
        </div>

        <div className="container hero-grid">
          {/* LEFT — texte */}
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              Culture Bio Diamant — CBD Premium
            </div>

            <h1 className="hero-title">
              Le <span className="hero-title-accent">CBD</span> à&nbsp;l&apos;état<br />
              <span className="hero-title-outline">pur & premium</span>
            </h1>

            <p className="hero-subtitle">
              Des produits à base de chanvre rigoureusement sélectionnés, analysés en laboratoire
              et conformes à la réglementation française. Catalogue informatif — 18+.
            </p>

            <div className="hero-ctas">
              <button type="button" className="btn-primary" onClick={() => navigate('/boutique')}>
                Voir la boutique <ArrowRight size={16} />
              </button>
              <button type="button" className="btn-ghost" onClick={() => navigate('/a-propos')}>
                Découvrir la marque
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat"><strong>12</strong><span>Produits sélectionnés</span></div>
              <div className="hero-stat-sep" aria-hidden="true" />
              <div className="hero-stat"><strong>100%</strong><span>THC conforme</span></div>
              <div className="hero-stat-sep" aria-hidden="true" />
              <div className="hero-stat"><strong>18+</strong><span>Accès contrôlé</span></div>
            </div>
          </div>

          {/* RIGHT — visuel */}
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-ring-outer" />
            <div className="hero-ring-inner" />
            <div className="hero-diamond" />
            <img src={visualMockup} alt="" className="hero-product-img" />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="trust-strip">
        <div className="trust-strip-item"><ShieldCheck size={18} /><span>THC ≤ 0,30% conforme</span></div>
        <div className="trust-strip-item"><FileText size={18} /><span>Analyses laboratoire</span></div>
        <div className="trust-strip-item"><Truck size={18} /><span>Livraison suivie</span></div>
        <div className="trust-strip-item"><LockKeyhole size={18} /><span>Catalogue responsable</span></div>
      </div>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="sec-label">Nos catégories</span>
            <h2 className="sec-title">Une sélection <strong>courte et maîtrisée</strong></h2>
            <p className="sec-desc">Fleurs, résines, cosmétiques et accessoires — chaque produit présenté avec lot, taux et certificat.</p>
          </div>
          <div className="cat-grid">
            {categoryCards.map(({ slug, Icon, tone, desc }) => (
              <button
                type="button"
                key={slug}
                className="cat-card"
                onClick={() => { setActiveCategory(slug); navigate(`/categorie/${slug}`); }}
              >
                <div className={`cat-card-visual ${tone}`}>
                  <Icon size={38} />
                </div>
                <div className="cat-card-body">
                  <div className="cat-card-name">{categoryLabels[slug]}</div>
                  <div className="cat-card-desc">{desc}</div>
                  <span className="cat-card-cta">Explorer <ArrowRight size={13} /></span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BEST-SELLERS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="sec-label">Best-sellers</span>
            <h2 className="sec-title">Nos produits les plus <strong>appréciés</strong></h2>
            <p className="sec-desc">Taux CBD vérifiés, numéro de lot traçable, certificat d'analyse consultable.</p>
          </div>
          <div className="product-grid">
            {products.filter((p) => p.isBestSeller || p.isNew).map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} onView={viewProduct} />
            ))}
          </div>
          <div className="home-catalogue-cta">
            <button type="button" className="btn-ghost" onClick={() => navigate('/boutique')}>
              Voir tout le catalogue <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section" style={{ background: 'rgba(6,17,13,.4)' }}>
        <div className="container">
          <div className="section-header">
            <span className="sec-label">Pourquoi nous choisir</span>
            <h2 className="sec-title">La qualité, <strong>la transparence</strong></h2>
          </div>
          <div className="why-us-grid">
            {whyUs.map((item) => {
              const Icon = whyUsIcons[item.icon] ?? ShieldCheck;
              return (
                <div className="why-card" key={item.title}>
                  <div className="why-icon"><Icon size={22} /></div>
                  <div className="why-title">{item.title}</div>
                  <p className="why-desc">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="sec-label">Avis clients</span>
            <h2 className="sec-title">Ce que disent <strong>nos clients</strong></h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="testi-stars">{'★'.repeat(t.rating)}</div>
                <p className="testi-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testi-footer">
                  <div className="testi-avatar">{t.name.slice(0, 1)}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-tag">{t.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERT SECTION */}
      <section className="section">
        <div className="container">
          <div className="cert-section">
            <div>
              <span className="cert-label"><BadgeCheck size={14} /> Traçabilité & certificats</span>
              <h2 className="sec-title">Analyses laboratoire<br /><strong>disponibles</strong></h2>
              <p className="sec-desc">
                Chaque produit référencé dispose d'un numéro de lot, d'une fiche origine et,
                dans la majorité des cas, d'un certificat d'analyse tiers vérifiable.
              </p>
              <div className="cert-stats">
                <div className="cert-stat"><strong>100%</strong><span>THC conforme</span></div>
                <div className="cert-stat"><strong>12</strong><span>Lots documentés</span></div>
                <div className="cert-stat"><strong>0</strong><span>Cannabinoïdes synthétiques</span></div>
                <div className="cert-stat"><strong>UE</strong><span>Origines vérifiées</span></div>
              </div>
              <button type="button" className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/certificats-tracabilite')}>
                Voir les certificats <ArrowRight size={15} />
              </button>
            </div>
            <div className="cert-visual" aria-hidden="true">
              <div className="cert-ring" />
              <div className="cert-diamond" />
              <div className="cert-icon"><ShieldCheck size={34} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <div className="newsletter-band">
        <div className="container newsletter-inner">
          <div>
            <h3 className="newsletter-title">Restez informé</h3>
            <p className="newsletter-desc">
              Nouveautés et informations responsables. Aucun spam, aucun discours médical.
            </p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" className="newsletter-input" placeholder="Votre adresse email" />
            <button type="submit" className="btn-primary">{"S'inscrire"}</button>
          </form>
        </div>
      </div>
    </>
  );

  /* ══════════════════════════════════════════════
     BOUTIQUE
  ══════════════════════════════════════════════ */
  const renderShop = () => {
    const displayed = categoryFromPath
      ? filteredProducts.filter((p) => p.category === categoryFromPath)
      : filteredProducts;

    return (
      <div className="page-section">
        {/* HEADER */}
        <div className="shop-page-header">
          <div className="container">
            <span className="sec-label">
              {categoryFromPath ? categoryLabels[categoryFromPath] : 'Boutique CBD'}
            </span>
            <h1 className="sec-title">
              {categoryFromPath
                ? categoryLabels[categoryFromPath]
                : <><span>Tous</span> les produits</>}
            </h1>
            <p className="sec-desc">
              {categoryFromPath
                ? categoryDescriptions[categoryFromPath]
                : 'Catalogue de produits à base de chanvre conformes, traçables et documentés.'}
            </p>

            {/* SEARCH */}
            <div className="shop-search-bar">
              <Search size={18} />
              <input
                type="search"
                className="shop-search-input"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="container">
          <div className="shop-layout">
            {/* FILTRES */}
            <aside className="shop-filters">
              <div className="filter-section-title">Catégories</div>
              <button
                type="button"
                className={`filter-btn${activeCategory === 'all' && !categoryFromPath ? ' active' : ''}`}
                onClick={() => { setActiveCategory('all'); navigate('/boutique'); }}
              >
                <Boxes size={15} /> Tous les produits
              </button>
              {Object.entries(categoryLabels).map(([slug, label]) => (
                <button
                  type="button"
                  key={slug}
                  className={`filter-btn${(activeCategory === slug || categoryFromPath === slug) ? ' active' : ''}`}
                  onClick={() => { setActiveCategory(slug as CategorySlug); navigate(`/categorie/${slug}`); }}
                >
                  {label}
                </button>
              ))}

              <div className="filter-divider" />
              <div className="filter-section-title">Trier par</div>
              <div className="sort-group">
                {(['popularity','newest','price-asc','price-desc'] as const).map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`sort-btn${sortOrder === s ? ' active' : ''}`}
                    onClick={() => setSortOrder(s)}
                  >
                    {s === 'popularity' ? 'Popularité' : s === 'newest' ? 'Nouveautés' : s === 'price-asc' ? 'Prix croissant' : 'Prix décroissant'}
                  </button>
                ))}
              </div>

              <div className="filter-divider" />
              <div className="filter-section-title">Badges</div>
              <button type="button" className="filter-btn" onClick={() => setSearchQuery('certificat')}>
                <BadgeCheck size={14} /> Certificat dispo
              </button>
              <button type="button" className="filter-btn" onClick={() => setSearchQuery('best')}>
                <Star size={14} /> Best-seller
              </button>
            </aside>

            {/* PRODUITS */}
            <div>
              <div className="shop-results-bar">
                <span className="results-count">{displayed.length} produit{displayed.length > 1 ? 's' : ''}</span>
              </div>
              {displayed.length === 0 ? (
                <div className="shop-empty">
                  <Search size={32} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
                  <p>Aucun produit ne correspond à votre recherche.</p>
                </div>
              ) : (
                <div className="product-grid">
                  {displayed.map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} onView={viewProduct} />
                  ))}
                </div>
              )}
              <p className="shop-legal">
                Produits réservés aux adultes. Les informations présentes ne constituent pas un avis médical.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════════
     PRODUCT DETAIL
  ══════════════════════════════════════════════ */
  const renderProduct = () => {
    const tabContent = {
      description: visibleProduct.description + ' ' + visibleProduct.details,
      specs: `Catégorie : ${categoryLabels[visibleProduct.category]} — Origine : ${visibleProduct.origin} — Lot : ${visibleProduct.lot} — CBD : ${visibleProduct.cbdRate ?? '—'} — THC : ${visibleProduct.thcRate}`,
      analysis: visibleProduct.certificateAvailable
        ? `Certificat d'analyse disponible. Lot : ${visibleProduct.lot}. Les documents peuvent être consultés sur demande.`
        : "Certificat en cours de finalisation. Produit uniquement disponible à la visualisation dans cette V1.",
      precautions: visibleProduct.precautions,
    };

    return (
      <section className="section container page-section">
        <div className="detail-grid">
          {/* VISUAL */}
          <div className="detail-visual-panel">
            <div className={`detail-visual-inner ${visibleProduct.imageTone}`}>
              <div className="detail-ring" aria-hidden="true" />
              <div className="detail-diamond-frame" aria-hidden="true" />
              <div className={`detail-pack-art ${visibleProduct.imageTone}`}>
                <span className="detail-pack-cat">{visibleProduct.category}</span>
                <span className="detail-pack-name">{visibleProduct.name}</span>
                <span className="detail-pack-sep" />
                {visibleProduct.cbdRate ? <span className="detail-pack-cbd">CBD {visibleProduct.cbdRate}</span> : null}
              </div>
              <div className="detail-badges-row">
                {visibleProduct.certificateAvailable
                  ? <span className="badge-cert"><BadgeCheck size={11} /> Certificat dispo</span>
                  : null}
                <span className="badge-cert"><ShieldCheck size={11} /> THC conforme</span>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="detail-content-panel">
            <div className="detail-category-label">{categoryLabels[visibleProduct.category]}</div>
            <h1 className="detail-title">{visibleProduct.name}</h1>

            <div className="detail-rate-row">
              {visibleProduct.cbdRate ? <span className="rate-badge">CBD {visibleProduct.cbdRate}</span> : null}
              <span className="rate-badge">THC {visibleProduct.thcRate}</span>
              <span className="rate-badge">{visibleProduct.origin}</span>
            </div>

            <p className="detail-desc">{visibleProduct.description}</p>

            <div className="detail-specs-grid">
              <div className="spec-item">
                <div className="spec-key">Origine</div>
                <div className="spec-val">{visibleProduct.origin}</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Lot</div>
                <div className="spec-val">{visibleProduct.lot}</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">CBD</div>
                <div className="spec-val">{visibleProduct.cbdRate ?? '—'}</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Certificat</div>
                <div className="spec-val">{visibleProduct.certificateAvailable ? 'Disponible' : 'En attente'}</div>
              </div>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">{visibleProduct.price.toFixed(2).replace('.', ',')} €</span>
              <span className="detail-stock-badge">En stock</span>
            </div>

            <div className="detail-qty-row">
              <span className="qty-label">Quantité</span>
              <div className="qty-ctrl">
                <button type="button" className="qty-btn" onClick={() => setDetailQty(Math.max(1, detailQty - 1))}>−</button>
                <span className="qty-val">{detailQty}</span>
                <button type="button" className="qty-btn" onClick={() => setDetailQty(detailQty + 1)}>+</button>
              </div>
            </div>

            <div className="detail-ctas">
              <button
                type="button"
                className="btn-primary"
                onClick={() => { for (let i = 0; i < detailQty; i++) addToCart(visibleProduct); }}
              >
                <ShoppingCart size={16} /> Ajouter au panier
              </button>
              <button type="button" className="btn-ghost" onClick={() => navigate('/certificats-tracabilite')}>
                Voir la traçabilité
              </button>
            </div>

            <div className="detail-guarantees">
              <span className="detail-guarantee"><Truck size={14} /> Livraison 24/48h</span>
              <span className="detail-guarantee"><LockKeyhole size={14} /> Paiement sécurisé</span>
              <span className="detail-guarantee"><PackageCheck size={14} /> Retours faciles</span>
            </div>

            {/* TABS */}
            <div className="detail-tabs">
              {(['description','specs','analysis','precautions'] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={`detail-tab${activeDetailTab === tab ? ' active' : ''}`}
                  onClick={() => setActiveDetailTab(tab)}
                >
                  {tab === 'description' ? 'Description'
                    : tab === 'specs' ? 'Caractéristiques'
                    : tab === 'analysis' ? 'Analyse'
                    : 'Précautions'}
                </button>
              ))}
            </div>
            <p className="detail-compliance">{tabContent[activeDetailTab]}</p>

            <p className="detail-warning">
              <UserRound size={14} /> Produit réservé aux adultes. Ne se substitue pas à un avis médical.
            </p>
          </div>
        </div>
      </section>
    );
  };

  /* ══════════════════════════════════════════════
     PANIER
  ══════════════════════════════════════════════ */
  const renderCart = () => (
    <section className="section container page-section">
      <span className="sec-label">Panier</span>
      <h1 className="sec-title">Votre sélection</h1>

      <div className="cart-layout">
        {/* ARTICLES */}
        <div className="cart-panel">
          <div className="cart-header">
            <span className="cart-title">Articles</span>
            <span className="cart-count-badge">{cartCount} article{cartCount > 1 ? 's' : ''}</span>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={36} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
              <p>Votre panier est vide.</p>
              <button type="button" className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/boutique')}>
                Voir la boutique <ArrowRight size={14} />
              </button>
            </div>
          ) : cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className={`cart-item-visual ${item.imageTone}`}>
                <span className="cart-item-art">{item.name.slice(0, 4)}</span>
              </div>
              <div>
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-meta">
                  {item.cbdRate ? `CBD ${item.cbdRate} · ` : ''}{categoryLabels[item.category]}
                </div>
              </div>
              <div className="cart-item-right">
                <span className="cart-item-price">
                  {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                </span>
                <div className="cart-qty-row">
                  <button type="button" className="cart-qty-btn" onClick={() => changeQty(item.id, 'down')}>−</button>
                  <span className="cart-qty-val">{item.quantity}</span>
                  <button type="button" className="cart-qty-btn" onClick={() => changeQty(item.id, 'up')}>+</button>
                </div>
                <button type="button" className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>Retirer</button>
              </div>
            </div>
          ))}
        </div>

        {/* RÉSUMÉ */}
        <div className="cart-summary">
          <div className="summary-title">Récapitulatif</div>
          <div className="summary-line">
            <span>Sous-total ({cartCount} article{cartCount > 1 ? 's' : ''})</span>
            <span>{cartTotal.toFixed(2).replace('.', ',')} €</span>
          </div>
          <div className="summary-line"><span>Livraison</span><span>Gratuite</span></div>
          <div className="summary-total">
            <span className="summary-total-label">Total</span>
            <span className="summary-total-val">{cartTotal.toFixed(2).replace('.', ',')} €</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', marginBottom: '0.75rem' }}
            onClick={() => navigate('/checkout')}
            disabled={cart.length === 0}
          >
            Passer à l'étape suivante <ArrowRight size={15} />
          </button>
          <button type="button" className="btn-ghost" style={{ width: '100%' }} onClick={() => navigate('/boutique')}>
            Continuer mes achats
          </button>
          <div className="cart-reassurance"><ShieldCheck size={14} /> Catalogue informatif — paiement à connecter</div>
          <div className="cart-reassurance"><Truck size={14} /> Livraison suivie dans toute la France</div>
        </div>
      </div>
    </section>
  );

  /* ══════════════════════════════════════════════
     CHECKOUT
  ══════════════════════════════════════════════ */
  const renderCheckout = () => (
    <section className="section container page-section">
      <span className="sec-label">Commande</span>
      <h1 className="sec-title">Finaliser la commande</h1>

      <div className="checkout-layout">
        {/* FORMULAIRE */}
        <div className="checkout-form-panel">
          <div className="checkout-section-title">Vos coordonnées</div>
          <div className="form-field">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="votre@email.fr"
              value={checkoutForm.email}
              onChange={(e) => setCheckoutForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="firstName">Prénom</label>
              <input id="firstName" className="form-input" placeholder="Jean" value={checkoutForm.firstName} onChange={(e) => setCheckoutForm((f) => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="lastName">Nom</label>
              <input id="lastName" className="form-input" placeholder="Dupont" value={checkoutForm.lastName} onChange={(e) => setCheckoutForm((f) => ({ ...f, lastName: e.target.value }))} />
            </div>
          </div>

          <div className="checkout-section-title" style={{ marginTop: '1.5rem' }}>Adresse de livraison</div>
          <div className="form-field">
            <label className="form-label" htmlFor="address">Adresse</label>
            <input id="address" className="form-input" placeholder="12 rue de la Paix" value={checkoutForm.address} onChange={(e) => setCheckoutForm((f) => ({ ...f, address: e.target.value }))} />
          </div>
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="city">Ville</label>
              <input id="city" className="form-input" placeholder="Paris" value={checkoutForm.city} onChange={(e) => setCheckoutForm((f) => ({ ...f, city: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="postalCode">Code postal</label>
              <input id="postalCode" className="form-input" placeholder="75001" value={checkoutForm.postalCode} onChange={(e) => setCheckoutForm((f) => ({ ...f, postalCode: e.target.value }))} />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="phone">Téléphone</label>
            <input id="phone" type="tel" className="form-input" placeholder="06 12 34 56 78" value={checkoutForm.phone} onChange={(e) => setCheckoutForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>

          <div className="checkout-cta-box">
            <p className="checkout-cta-info">
              <LockKeyhole size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--violet2)', verticalAlign: 'middle' }} />
              <strong>Paiement à connecter.</strong> Le paiement réel sera activé après intégration d'un prestataire compatible CBD. Aucune transaction n'est effectuée dans cette V1.
            </p>
            <button
              type="button"
              className="btn-violet"
              style={{ width: '100%' }}
              onClick={() => navigate('/confirmation')}
            >
              Paiement à connecter <LockKeyhole size={14} />
            </button>
          </div>
        </div>

        {/* RÉSUMÉ COMMANDE */}
        <div className="cart-summary">
          <div className="summary-title">Résumé</div>
          {cart.map((item) => (
            <div className="summary-line" key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
            </div>
          ))}
          <div className="summary-line"><span>Livraison</span><span>Gratuite</span></div>
          <div className="summary-total">
            <span className="summary-total-label">Total</span>
            <span className="summary-total-val">{cartTotal.toFixed(2).replace('.', ',')} €</span>
          </div>
          <div className="cart-reassurance"><ShieldCheck size={14} /> THC ≤ 0,30% conforme</div>
          <div className="cart-reassurance"><FileText size={14} /> Analyses laboratoire disponibles</div>
        </div>
      </div>
    </section>
  );

  /* ══════════════════════════════════════════════
     ABOUT
  ══════════════════════════════════════════════ */
  const renderAbout = () => (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="À propos"
        title="Une marque naturelle et premium"
        text="Culture Bio Diamant propose un univers élégant et rassurant, structuré autour de la qualité, de la traçabilité et de la conformité."
      />
      <div className="info-grid">
        {aboutBlocks.map((b) => (
          <div className="quality-card" key={b.title}><h3>{b.title}</h3><p>{b.text}</p></div>
        ))}
      </div>
      <div className="section-header" style={{ marginTop: '4rem' }}>
        <span className="sec-label">Valeurs</span>
        <h2 className="sec-title">Les piliers de <strong>la marque</strong></h2>
      </div>
      <div className="why-us-grid">
        {premiumValues.map((v) => (
          <div className="why-card" key={v.title}>
            <div className="why-icon"><Gem size={20} /></div>
            <div className="why-title">{v.title}</div>
            <p className="why-desc">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );

  /* ══════════════════════════════════════════════
     FORUM
  ══════════════════════════════════════════════ */
  const renderForum = () => (
    <section className="section container page-section">
      <SectionTitle eyebrow="Espace information" title="Annonces et questions" text="Espace informatif simulé." />
      <div className="guide-grid">
        <div className="quality-card">
          <h3>Poser une question</h3>
          <form style={{ display: 'grid', gap: '0.75rem' }} onSubmit={(e) => e.preventDefault()}>
            <input className="form-input" placeholder="Votre nom" />
            <input className="form-input" placeholder="Sujet" />
            <textarea className="form-input" placeholder="Votre message" rows={5} />
            <button type="button" className="btn-primary">Envoyer en simulation</button>
          </form>
        </div>
        <div>
          {liveForumPosts.map((p) => (
            <div className="quality-card" key={p.author} style={{ marginBottom: '1rem' }}>
              <p className="eyebrow"><MessageCircle size={13} /> {p.tag}</p>
              <h3 style={{ fontSize: '1rem', margin: '0.35rem 0' }}>{p.author}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ══════════════════════════════════════════════
     LOGIN
  ══════════════════════════════════════════════ */
  const renderLogin = () => (
    <section className="section container page-section">
      <SectionTitle eyebrow="Connexion" title="Espace client" text="Page simulée — compte client à brancher." />
      <div className="guide-grid">
        <div className="quality-card">
          <h3>Connexion</h3>
          <form style={{ display: 'grid', gap: '0.75rem' }} onSubmit={(e) => e.preventDefault()}>
            <input className="form-input" type="email" placeholder="Email" />
            <input className="form-input" type="password" placeholder="Mot de passe" />
            <button type="button" className="btn-primary">Se connecter en simulation</button>
            <button type="button" className="btn-ghost">Créer un compte</button>
          </form>
        </div>
        <div className="quality-card">
          <UserRound size={30} style={{ color: 'var(--green)' }} />
          <h3>Compte client à venir</h3>
          <p>Le backend devra gérer l'authentification, les commandes, les adresses et la sécurité des données.</p>
        </div>
      </div>
    </section>
  );

  /* ══════════════════════════════════════════════
     LEGAL
  ══════════════════════════════════════════════ */
  const renderLegal = () => {
    if (!legalPage) return null;
    return (
      <section className="section container page-section">
        <SectionTitle eyebrow={legalPage.eyebrow} title={legalPage.title} text={legalPage.intro} />
        <div className="info-grid">
          {(legalPage.points ?? []).map((point) => (
            <div className="quality-card" key={point}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{point}</h3>
              <p>Information à finaliser avant publication officielle.</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /* ══════════════════════════════════════════════
     FAQ PAGE
  ══════════════════════════════════════════════ */
  const renderFaq = () => (
    <section className="section container page-section">
      <SectionTitle eyebrow="FAQ" title="Questions fréquentes" text="Informations sur la sélection, les certificats, la livraison et la conformité." />
      <div className="faq-grid">
        {faqs.map((f) => (
          <details key={f.question}>
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );

  /* ══════════════════════════════════════════════
     CONTACT PAGE
  ══════════════════════════════════════════════ */
  const renderContact = () => (
    <section className="section container page-section">
      <SectionTitle eyebrow="Contact" title="Demande d'information" text="Formulaire simulé — aucun message n'est envoyé." />
      <div className="guide-grid">
        <div className="quality-card">
          <h3>Formulaire de contact</h3>
          <form style={{ display: 'grid', gap: '0.75rem' }} onSubmit={(e) => e.preventDefault()}>
            <input className="form-input" placeholder="Votre nom" />
            <input className="form-input" type="email" placeholder="Email" />
            <input className="form-input" placeholder="Sujet" />
            <textarea className="form-input" placeholder="Votre message" rows={5} />
            <button type="button" className="btn-primary">Envoyer en simulation</button>
          </form>
        </div>
        <div className="quality-card">
          <h3>Informations</h3>
          <p>Toute demande reçoit une réponse informative. Aucune promesse médicale ne sera formulée.</p>
          <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.85rem' }}>
            <div className="guide-point"><ShieldCheck /><span><strong>Conformité :</strong> lots, origine et documents.</span></div>
            <div className="guide-point"><FileText /><span><strong>Clarté :</strong> fiches produit vérifiables.</span></div>
            <div className="guide-point"><Gem /><span><strong>Premium :</strong> sélection courte et rigoureuse.</span></div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ══════════════════════════════════════════════
     INFO PAGES GENERIC
  ══════════════════════════════════════════════ */
  const renderInfoPage = () => {
    if (legalPage)                                    return renderLegal();
    if (currentPath === '/a-propos')                  return renderAbout();
    if (currentPath === '/forum-live')                return renderForum();
    if (currentPath === '/connexion' || currentPath === '/compte') return renderLogin();
    if (currentPath === '/faq')                       return renderFaq();
    if (currentPath === '/contact')                   return renderContact();

    const pageMap: Record<string, [string, string, string]> = {
      '/guide-cbd-legal':       ['Guide CBD légal', 'CBD, THC et réglementation', 'Un guide clair pour comprendre la sélection sans promesse médicale.'],
      '/certificats-tracabilite': ['Certificats & traçabilité', 'Lots suivis et analyses visibles', "Chaque produit est relié à un certificat d'analyse, un numéro de lot et des informations fournisseur."],
      '/livraison-retours':     ['Livraison & retours', 'Service client', "Livraison suivie partout en France. Retours et SAV à finaliser avant production."],
      '/confirmation':          ['Confirmation', 'Demande envoyée', "Référence fictive : CBD-2606-001. Aucun paiement n'a été déclenché. La boutique vous recontactera."],
    };

    const content = pageMap[currentPath] ?? ['Page', 'Culture Bio Diamant', 'Contenu à compléter.'];

    return (
      <section className="section container page-section">
        <SectionTitle eyebrow={content[0]} title={content[1]} text={content[2]} />
        <div className="guide-grid">
          <div>
            {homepageStory.map((item) => (
              <div className="guide-point" key={item.title}>
                <Gem size={16} />
                <span><strong>{item.title}</strong><br />{item.text}</span>
              </div>
            ))}
          </div>
          <div className="quality-card">
            <h3>Charte premium</h3>
            <p>Noir profond, vert fluo, violet néon, glow diamant — et une communication responsable sans promesse médicale.</p>
            <button type="button" className="btn-ghost" style={{ marginTop: '1rem', width: '100%' }} onClick={() => navigate('/boutique')}>
              Voir la boutique <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    );
  };

  /* ══════════════════════════════════════════════
     ROUTING
  ══════════════════════════════════════════════ */
  const renderCurrentPage = () => {
    if (currentPath === '/')                                                          return renderHome();
    if (currentPath === '/boutique' || currentPath === '/produits' || currentPath.startsWith('/categorie/'))
      return renderShop();
    if (currentPath.startsWith('/produit/'))                                          return renderProduct();
    if (currentPath === '/panier')                                                    return renderCart();
    if (currentPath === '/checkout')                                                  return renderCheckout();
    return renderInfoPage();
  };

  /* ══════════════════════════════════════════════
     APP SHELL
  ══════════════════════════════════════════════ */
  return (
    <div className="app-shell">
      {/* AGE GATE */}
      {!accessConfirmed ? (
        <div className="age-gate" role="dialog" aria-modal="true" aria-label="Vérification majorité">
          <div className="age-gate-card">
            <div className="age-gate-mark"><Gem size={32} /></div>
            <p className="age-gate-eyebrow"><ShieldCheck size={13} /> Accès responsable</p>
            <h2>Culture Bio Diamant</h2>
            <p>Confirme que tu es majeur(e) pour consulter cette boutique à base de chanvre et accessoires premium.</p>
            <p className="age-legal">Produits réservés aux adultes. Ne constitue pas un avis médical.</p>
            <button type="button" className="btn-primary" onClick={confirmAccess} style={{ width: '100%', marginTop: '0.75rem' }}>
              Confirmer — J'ai 18 ans ou plus
            </button>
          </div>
        </div>
      ) : null}

      <Header
        cartCount={cartCount}
        currentPath={currentPath}
        onNavigate={navigate}
        onCategorySelect={setActiveCategory}
      />
      <main>{renderCurrentPage()}</main>
      <Footer onNavigate={navigate} />

      {/* STICKY MOBILE CTA */}
      <div className="sticky-mobile-cta">
        <span className="sticky-label">Catalogue CBD Premium</span>
        <button type="button" className="sticky-btn" onClick={() => navigate('/boutique')}>
          Boutique
        </button>
      </div>
    </div>
  );
}

export default App;
