import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, Boxes, CheckCircle2, CreditCard, FileText, Gem, LockKeyhole, MessageCircle, PackageCheck, ShieldCheck, Truck, UserRound } from 'lucide-react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { SectionTitle } from './components/SectionTitle';
import { Footer } from './components/Footer';
import { categoryDescriptions, categoryLabels, categoryPreviewImages, products } from './data/products';
import { aboutBlocks, legalBlocks, liveForumPosts, premiumValues } from './data/siteContent';
import type { CartItem, CategorySlug, Product } from './types';

const ACCESS_KEY = 'culture-bio-diamant-majorite-ok';

const homeCategoryCards = [
  { slug: 'fleurs'      as CategorySlug, title: 'Fleurs CBD',       desc: 'Fleurs indoor sélectionnées, taux CBD vérifié par lot, certificats disponibles.' },
  { slug: 'resines'     as CategorySlug, title: 'Résines CBD',      desc: 'Résines CBD documentées, extraction mécanique, origine et lot traçables.' },
  { slug: 'cosmetiques' as CategorySlug, title: 'Cosmétiques CBD',  desc: 'Soins dermo-cosmétiques au CBD, formulés avec exigence et dossier fournisseur.' },
  { slug: 'accessoires' as CategorySlug, title: 'Accessoires',      desc: 'Accessoires sélectionnés pour une expérience optimale, sans substance active.' },
];

const reassuranceItems = [
  { icon: BadgeCheck,     title: 'Sélection vérifiée',           text: 'Fournisseurs audités et produits rigoureusement sélectionnés.' },
  { icon: FileText,       title: 'Analyses par lot',             text: 'Chaque lot a été analysé en laboratoire pour garantir conformité et qualité.' },
  { icon: Boxes,          title: 'Catalogue maîtrisé',           text: 'Une gamme courte et maîtrisée pour garantir traçabilité et fiabilité.' },
  { icon: MessageCircle,  title: 'Communication responsable',    text: 'Aucune promesse médicale. Informations claires et transparentes.' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [accessConfirmed, setAccessConfirmed] = useState(() => localStorage.getItem(ACCESS_KEY) === 'true');

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const SELECTOR = '.product-card, .cat-card-4, .reassurance-item, .category-card, .section-title';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const siblings = Array.from(el.parentElement?.querySelectorAll(SELECTOR) ?? []);
          const idx = Math.min(siblings.indexOf(el), 8);
          el.style.transitionDelay = `${idx * 0.07}s`;
          el.classList.add('in-view');
          setTimeout(() => { el.style.transitionDelay = '0s'; }, 900 + idx * 70);
          observer.unobserve(el);
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -24px 0px' }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains('in-view')) observer.observe(el);
      });
    }, 16);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [currentPath, activeCategory]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const changeQuantity = (productId: string, direction: 'up' | 'down') => {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== productId) return [item];
      const nextQuantity = direction === 'up' ? item.quantity + 1 : item.quantity - 1;
      return nextQuantity <= 0 ? [] : [{ ...item, quantity: nextQuantity }];
    }));
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/produit/${product.slug}`);
  };

  const confirmAccess = () => {
    localStorage.setItem(ACCESS_KEY, 'true');
    setAccessConfirmed(true);
  };

  const categoryFromPath = currentPath.startsWith('/categorie/') ? currentPath.replace('/categorie/', '') as CategorySlug : null;
  const productFromPath = currentPath.startsWith('/produit/') ? products.find((product) => `/produit/${product.slug}` === currentPath) : null;
  const visibleProduct = productFromPath ?? selectedProduct;
  const legalPage = legalBlocks.find((page) => page.path === currentPath);

  const renderHome = () => (
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
                onClick={() => { setActiveCategory(cat.slug); navigate(`/categorie/${cat.slug}`); }}
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
                    if (img.src !== preview) {
                      img.src = preview;
                      return;
                    }
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
            {reassuranceItems.map(({ icon: Icon, title, text }) => (
              <div key={title} className="reassurance-item">
                <div className="reassurance-icon"><Icon size={17} /></div>
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
                    if (img.src !== preview) {
                      img.src = preview;
                      return;
                    }
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
                  if (img.src !== preview) {
                    img.src = preview;
                    return;
                  }
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

  const renderShop = () => (
    <section className="section boutique-section page-section">
      <div className="container">
        <SectionTitle
          eyebrow={categoryFromPath ? categoryLabels[categoryFromPath] : 'Produits'}
          title={categoryFromPath ? `Catégorie ${categoryLabels[categoryFromPath]}` : 'Tous les produits Culture Bio Diamant'}
          text={categoryFromPath ? categoryDescriptions[categoryFromPath] : 'Une page produits complète, avec des cartes premium, des filtres par catégorie et des fiches détaillées pour préparer la vraie boutique.'}
        />
        <div className="shop-layout">
          <aside className="filters-panel">
            <h3>Filtres</h3>
            <button className={activeCategory === 'all' ? 'active' : ''} onClick={() => { setActiveCategory('all'); navigate('/boutique'); }}>Tous les produits</button>
            {Object.entries(categoryLabels).map(([slug, label]) => (
              <button key={slug} className={activeCategory === slug ? 'active' : ''} onClick={() => { setActiveCategory(slug as CategorySlug); navigate(`/categorie/${slug}`); }}>{label}</button>
            ))}
            <div className="legal-note">
              <strong>Sélection responsable</strong>
              <p>La V1 garde une gamme claire : fleurs, résines, cosmétiques et accessoires. Les vrais produits devront être reliés à leurs documents fournisseur.</p>
            </div>
          </aside>
          <div className="product-grid">
            {(categoryFromPath ? products.filter((product) => product.category === categoryFromPath) : filteredProducts).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} onView={viewProduct} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderProduct = () => (
    <section className="section container product-detail-section page-section">
      <SectionTitle eyebrow={categoryLabels[visibleProduct.category]} title={visibleProduct.name} text={visibleProduct.description} />
      <div className="product-detail">
        <div className={`detail-visual ${visibleProduct.imageTone ?? 'emerald'}`}>
          <img
            src={visibleProduct.image}
            alt={visibleProduct.imageAlt ?? visibleProduct.name}
            className="detail-img"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              const preview = categoryPreviewImages[visibleProduct.category];
              const fb = `/products/${visibleProduct.category}/fallback.svg`;
              if (img.src !== preview) {
                img.src = preview;
                return;
              }
              if (img.src !== fb) img.src = fb;
            }}
          />
          <span className="product-orb" />
          <span className="diamond-frame" />
        </div>
        <div className="detail-content">
          <span className="eyebrow">Lot {visibleProduct.lot ?? '—'}</span>
          <h2>{visibleProduct.name}</h2>
          <p>{visibleProduct.details ?? visibleProduct.description}</p>
          <div className="detail-specs">
            <span>Catégorie : {categoryLabels[visibleProduct.category]}</span>
            <span>CBD : {visibleProduct.cbdRate ?? 'Selon fiche produit'}</span>
            <span>THC : {visibleProduct.thcRate ?? visibleProduct.thc ?? '< 0,3%'}</span>
            <span>Origine : {visibleProduct.origin ?? 'Chanvre UE'}</span>
            <span>Lot : {visibleProduct.lot ?? '—'}</span>
            <span>Certificat : {visibleProduct.certificateAvailable ? 'Disponible' : 'À compléter'}</span>
          </div>
          <div className="tabs-preview">
            <button>Description</button><button>Analyse / certificat</button><button>Composition</button><button>Précautions</button>
          </div>
          {(visibleProduct.composition ?? visibleProduct.complianceNote) ? <p className="compliance-box"><strong>Composition :</strong> {visibleProduct.composition ?? visibleProduct.complianceNote}</p> : null}
          {(visibleProduct.precautions ?? visibleProduct.usageNote) ? <p className="compliance-box"><strong>Précautions :</strong> {visibleProduct.precautions ?? visibleProduct.usageNote}</p> : null}
          <button className="primary-button" onClick={() => addToCart(visibleProduct)}>Ajouter au panier — {visibleProduct.price.toFixed(2).replace('.', ',')} €</button>
        </div>
      </div>
    </section>
  );

  const renderCart = () => (
    <section className="section container cart-checkout-grid page-section">
      <div className="cart-panel">
        <SectionTitle eyebrow="Panier" title="Résumé de commande premium" text="Le panier doit rassurer : produits clairs, quantités lisibles, total estimé, rappel de la conformité et tunnel simple." />
        {cart.length === 0 ? <p className="empty-cart">Ton panier est vide. Ajoute un produit pour tester le parcours d'achat de la maquette.</p> : cart.map((item) => (
          <div className="cart-row" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <strong>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
            <div className="cart-actions">
              <button onClick={() => changeQuantity(item.id, 'down')}>-</button>
              <button onClick={() => changeQuantity(item.id, 'up')}>+</button>
              <button onClick={() => removeFromCart(item.id)}>Retirer</button>
            </div>
          </div>
        ))}
        <div className="cart-total"><span>Total estimé</span><strong>{cartTotal.toFixed(2).replace('.', ',')} €</strong></div>
        <div className="cart-reassurance"><CreditCard size={18} /> Paiement compatible CBD à valider avant production</div>
        <div className="cart-reassurance"><ShieldCheck size={18} /> Produits réels à publier uniquement avec certificats et lots associés</div>
      </div>
      <div className="checkout-panel">
        <SectionTitle eyebrow="Checkout" title="Tunnel court et rassurant" text="Formulaire simulé pour préparer le futur tunnel de commande." />
        <form className="checkout-form">
          <input placeholder="Email" />
          <input placeholder="Nom et prénom" />
          <input placeholder="Adresse de livraison" />
          <label><input type="checkbox" /> J'accepte les conditions d'utilisation et les CGV</label>
          <label><input type="checkbox" /> Je confirme être majeur</label>
          <button type="button" className="primary-button" onClick={() => navigate('/confirmation')}>Simuler la validation</button>
        </form>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section className="section container page-section">
      <SectionTitle eyebrow="À propos" title="Une marque naturelle, moderne et premium" text="Culture Bio Diamant reprend l'énergie du flyer : un univers végétal lumineux, une exigence de contrôle et une présentation haut de gamme." />
      <div className="info-grid">
        {aboutBlocks.map((block) => (
          <article className="quality-card" key={block.title}>
            <h3>{block.title}</h3>
            <p>{block.text}</p>
          </article>
        ))}
      </div>
      <div className="section-title content-spacer">
        <span>Valeurs</span>
        <h2>Les piliers de la marque</h2>
      </div>
      <div className="category-grid">
        {premiumValues.map((value) => (
          <article className="category-card" key={value.title}>
            <Gem size={26} />
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </article>
        ))}
      </div>
    </section>
  );

  const renderForum = () => (
    <section className="section container page-section">
      <SectionTitle eyebrow="Forum live" title="Espace communauté simulé" text="La V1 prévoit un espace de discussion premium pour annonces, questions clients et réponses support. Aucun message n'est envoyé en production dans cette maquette." />
      <div className="guide-grid">
        <div className="contact-form">
          <h3>Lancer une discussion</h3>
          <input placeholder="Votre nom" />
          <input placeholder="Sujet" />
          <textarea placeholder="Votre message" rows={5} />
          <button type="button" className="primary-button">Publier en simulation</button>
        </div>
        <div className="guide-points">
          {liveForumPosts.map((post) => (
            <article className="quality-card" key={`${post.author}-${post.tag}`}>
              <p className="eyebrow"><MessageCircle size={16} /> {post.tag}</p>
              <h3>{post.author}</h3>
              <p>{post.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const renderLogin = () => (
    <section className="section container page-section">
      <SectionTitle eyebrow="Connexion" title="Espace client premium" text="Page de connexion simulée pour préparer le futur compte client : commandes, adresses, favoris, certificats consultés et suivi livraison." />
      <div className="cart-checkout-grid">
        <form className="checkout-panel checkout-form">
          <input placeholder="Email" />
          <input placeholder="Mot de passe" type="password" />
          <button type="button" className="primary-button">Se connecter en simulation</button>
          <button type="button" className="ghost-button">Créer un compte</button>
        </form>
        <div className="quality-card">
          <UserRound size={34} />
          <h3>Compte client à venir</h3>
          <p>La V1 prépare les écrans. Le backend devra ensuite gérer l'authentification, les commandes, les adresses et la sécurité des données.</p>
        </div>
      </div>
    </section>
  );

  const renderLegal = () => {
    if (!legalPage) return null;
    return (
      <section className="section container page-section">
        <SectionTitle eyebrow={legalPage.eyebrow} title={legalPage.title} text={legalPage.intro} />
        <div className="info-grid">
          {legalPage.points.map((point) => (
            <div className="quality-card" key={point}>
              <h3>{point}</h3>
              <p>Information à finaliser avec les données réelles de l'entreprise avant publication officielle.</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderInfoPage = () => {
    if (legalPage) return renderLegal();
    if (currentPath === '/a-propos') return renderAbout();
    if (currentPath === '/forum-live') return renderForum();
    if (currentPath === '/connexion' || currentPath === '/compte') return renderLogin();

    const content = {
      '/guide-cbd-legal': ['Guide CBD légal', 'CBD, THC et achat responsable', 'Le guide explique les notions essentielles avec un ton naturel, premium et prudent. Il doit aider le client à comprendre la sélection sans promesse médicale.'],
      '/certificats-tracabilite': ['Certificats & traçabilité', 'Lots suivis et analyses visibles', "Chaque produit réel devra être relié à un certificat d'analyse, une fiche fournisseur, un lot et des précautions clairement lisibles."],
      '/faq': ['FAQ', 'Questions fréquentes', 'Retrouve les informations essentielles sur la sélection, la livraison, le panier, les certificats et le futur compte client.'],
      '/contact': ['Contact', 'Support client', "Formulaire visuel pour la V1. Aucun message n'est envoyé tant que le backend n'est pas intégré."],
      '/livraison-retours': ['Livraison & retours', 'Service client', "Livraison suivie, retours et SAV devront être finalisés avec les vraies informations d'entreprise."],
      '/confirmation': ['Confirmation', 'Commande simulée reçue', "Numéro fictif : CBD-2606-001. Aucun paiement réel n'a été déclenché."],
    }[currentPath] ?? ['Page', 'Culture Bio Diamant', 'Contenu placeholder à compléter.'];

    return (
      <section className="section container page-section">
        <SectionTitle eyebrow={content[0]} title={content[1]} text={content[2]} />
        <div className="guide-grid">
          <div className="guide-points">
            <p><ShieldCheck /> <span><strong>Confiance :</strong> lots, origine et documents fournisseur.</span></p>
            <p><FileText /> <span><strong>Clarté :</strong> fiches produit propres et textes compréhensibles.</span></p>
            <p><Boxes /> <span><strong>Gamme maîtrisée :</strong> peu de produits, mais mieux présentés.</span></p>
          </div>
          <div className="quality-card">
            <h3>Charte premium</h3>
            <p>Noir profond, vert néon, glow diamant, cartes glassmorphism et communication responsable. Le contenu doit être aussi soigné que le visuel.</p>
            <button className="ghost-button" onClick={() => navigate('/boutique')}>Voir les produits</button>
          </div>
        </div>
      </section>
    );
  };

  const renderCurrentPage = () => {
    if (currentPath === '/') return renderHome();
    if (currentPath === '/boutique' || currentPath === '/produits' || currentPath.startsWith('/categorie/')) return renderShop();
    if (currentPath.startsWith('/produit/')) return renderProduct();
    if (currentPath === '/panier' || currentPath === '/checkout') return renderCart();
    return renderInfoPage();
  };

  return (
    <div className="app-shell">
      {!accessConfirmed ? (
        <div className="age-gate" role="dialog" aria-modal="true">
          <div className="age-gate-card">
            <div className="age-gate-mark"><Gem size={34} /><span>CBD</span></div>
            <p className="eyebrow"><ShieldCheck size={16} /> Accès responsable</p>
            <h2>Culture Bio Diamant</h2>
            <p>Confirme que tu es majeur pour consulter cette boutique à base de chanvre et d'accessoires premium.</p>
            <button className="primary-button" onClick={confirmAccess}>Entrer sur le site</button>
          </div>
        </div>
      ) : null}

      <Header cartCount={cartCount} currentPath={currentPath} onNavigate={navigate} onCategorySelect={setActiveCategory} />
      <main>{renderCurrentPage()}</main>
      <Footer onNavigate={navigate} />
      <div className="sticky-mobile-cta">
        <span>Voir les produits premium</span>
        <button onClick={() => navigate('/boutique')}>Boutique</button>
      </div>
    </div>
  );
}

export default App;
