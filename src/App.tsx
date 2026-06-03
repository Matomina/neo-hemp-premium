import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, Boxes, CheckCircle2, CreditCard, FileText, Gem, Leaf, LockKeyhole, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { SectionTitle } from './components/SectionTitle';
import { Footer } from './components/Footer';
import { categoryDescriptions, categoryLabels, products } from './data/products';
import type { CartItem, CategorySlug, Product } from './types';
import visualMockup from './assets/maquette-boutique-cbd-visuelle.png';

const ACCESS_KEY = 'culture-bio-diamant-majorite-ok';

const trustItems = [
  { icon: ShieldCheck, label: 'THC conforme' },
  { icon: FileText, label: 'Certificats disponibles' },
  { icon: Truck, label: 'Livraison suivie' },
  { icon: LockKeyhole, label: 'Paiement sécurisé compatible CBD' },
];

const categoryCards: Array<{ slug: CategorySlug; text: string }> = [
  { slug: 'fleurs', text: 'Sélection courte, traçable et analysée par lot.' },
  { slug: 'resines', text: 'Origine, taux et documents fournisseur vérifiés.' },
  { slug: 'cosmetiques', text: 'Uniquement avec dossier cosmétique complet.' },
  { slug: 'accessoires', text: 'Produits premium sans substance active.' },
];

const legalPages: Record<string, { eyebrow: string; title: string; text: string; points: string[] }> = {
  '/mentions-legales': {
    eyebrow: 'Légal',
    title: 'Mentions légales',
    text: 'Page placeholder à compléter avant production avec les informations réelles de l’entreprise.',
    points: ['Raison sociale à compléter', 'SIRET / RCS à compléter', 'Adresse du siège à compléter', 'Responsable de publication à compléter', 'Hébergeur à compléter'],
  },
  '/cgv': {
    eyebrow: 'Légal',
    title: 'Conditions générales de vente',
    text: 'Conditions placeholders pour cadrer la future vente en ligne sans paiement réel dans cette V1.',
    points: ['Commande simulée pour la maquette', 'Prix indicatifs', 'Disponibilité à confirmer', 'Paiement compatible CBD à valider', 'Produits réservés à un public majeur'],
  },
  '/confidentialite': {
    eyebrow: 'Données',
    title: 'Politique de confidentialité',
    text: 'Aucune donnée n’est envoyée à un backend dans cette V1. Les formulaires sont uniquement visuels.',
    points: ['Pas de backend', 'Pas de paiement réel', 'Pas de compte réel', 'Cookies techniques à documenter', 'Politique finale à valider juridiquement'],
  },
  '/cookies': {
    eyebrow: 'Cookies',
    title: 'Gestion des cookies',
    text: 'La V1 prévoit uniquement une persistance locale de confirmation d’accès et pourra évoluer avec un bandeau cookies conforme.',
    points: ['Cookie wall interdit', 'Consentement à cadrer', 'Traceurs marketing absents en V1', 'Mesure analytics à valider plus tard'],
  },
  '/retractation': {
    eyebrow: 'Service client',
    title: 'Rétractation',
    text: 'Page placeholder à compléter selon la nature exacte des produits vendus et les obligations applicables.',
    points: ['Délai légal à confirmer', 'Exceptions produit à vérifier', 'Adresse retour à compléter', 'Procédure SAV à formaliser'],
  },
};

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

  const removeFromCart = (productId: number) => {
    setCart((current) => current.filter((item) => item.id !== productId));
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
  const legalPage = legalPages[currentPath];

  const renderHome = () => (
    <>
      <section className="hero-section neon-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={16} /> Culture Bio Diamant</span>
            <h1>CBD premium, noir profond, éclat vert diamant.</h1>
            <p>
              Une boutique à base de chanvre pensée comme un écrin premium : glow fluo, transparence, lots suivis et communication responsable sans promesse médicale.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigate('/boutique')}>Découvrir la boutique <ArrowRight size={18} /></button>
              <button className="ghost-button" onClick={() => navigate('/guide-cbd-legal')}>Comprendre le CBD légal</button>
            </div>
            <div className="hero-proof">
              <span><CheckCircle2 size={17} /> Charte flyer néon</span>
              <span><CheckCircle2 size={17} /> Produits conformes et traçables</span>
            </div>
          </div>

          <div className="hero-visual-card">
            <img src={visualMockup} alt="Univers visuel Culture Bio Diamant noir premium et vert néon" />
            <div className="diamond-glow" aria-hidden="true"><Gem size={92} /></div>
            <div className="floating-card top"><BadgeCheck size={18} /> Analyses par lot</div>
            <div className="floating-card bottom"><PackageCheck size={18} /> Premium Naturel</div>
          </div>
        </div>
      </section>

      <section className="trust-strip container">
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label}><Icon size={22} /><span>{label}</span></div>
        ))}
      </section>

      <section className="section container">
        <SectionTitle eyebrow="Catalogue premium" title="Une gamme courte, sombre et lumineuse" text="Chaque catégorie reprend la charte flyer : noir intense, vert fluo, bordure diamant et cartes glassmorphism." />
        <div className="category-grid">
          {categoryCards.map((category) => (
            <button key={category.slug} className="category-card" onClick={() => { setActiveCategory(category.slug); navigate(`/categorie/${category.slug}`); }}>
              <Leaf size={26} />
              <h3>{categoryLabels[category.slug]}</h3>
              <p>{category.text}</p>
              <span>Explorer <ArrowRight size={15} /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="section boutique-section">
        <div className="container">
          <SectionTitle eyebrow="Best-sellers" title="Cartes produits glow diamant" text="Produits temporaires pour valider le rendu premium avant intégration des vraies photos et certificats." />
          <div className="product-grid">
            {products.filter((product) => product.isBestSeller || product.isNew).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} onView={viewProduct} />
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderShop = () => (
    <section className="section boutique-section page-section">
      <div className="container">
        <SectionTitle
          eyebrow={categoryFromPath ? categoryLabels[categoryFromPath] : 'Boutique'}
          title={categoryFromPath ? `Catégorie ${categoryLabels[categoryFromPath]}` : 'Boutique Culture Bio Diamant'}
          text={categoryFromPath ? categoryDescriptions[categoryFromPath] : 'Navigation front sans paiement réel : filtres catégorie, produits mockés, badges conformité et rendu néon premium.'}
        />
        <div className="shop-layout">
          <aside className="filters-panel">
            <h3>Filtres</h3>
            <button className={activeCategory === 'all' ? 'active' : ''} onClick={() => { setActiveCategory('all'); navigate('/boutique'); }}>Tous les produits</button>
            {Object.entries(categoryLabels).map(([slug, label]) => (
              <button key={slug} className={activeCategory === slug ? 'active' : ''} onClick={() => { setActiveCategory(slug as CategorySlug); navigate(`/categorie/${slug}`); }}>{label}</button>
            ))}
            <div className="legal-note">
              <strong>Conformité V1</strong>
              <p>Huiles à ingérer, gummies, aliments CBD et cannabinoïdes de synthèse restent exclus.</p>
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
        <div className={`detail-visual ${visibleProduct.imageTone}`}>
          <span className="product-orb" />
          <span className="diamond-frame" />
          <span className="detail-pack">{visibleProduct.name}</span>
        </div>
        <div className="detail-content">
          <span className="eyebrow">Lot {visibleProduct.lot}</span>
          <h2>{visibleProduct.name}</h2>
          <p>{visibleProduct.details}</p>
          <div className="detail-specs">
            <span>CBD : {visibleProduct.cbdRate ?? 'Selon fiche produit'}</span>
            <span>THC : {visibleProduct.thcRate}</span>
            <span>Origine : {visibleProduct.origin}</span>
            <span>Certificat : {visibleProduct.certificateAvailable ? 'Disponible' : 'À compléter'}</span>
          </div>
          <div className="tabs-preview">
            <button>Description</button><button>Analyse / certificat</button><button>Composition</button><button>Précautions</button>
          </div>
          <p className="compliance-box">{visibleProduct.precautions}</p>
          <button className="primary-button" onClick={() => addToCart(visibleProduct)}>Ajouter au panier — {visibleProduct.price.toFixed(2).replace('.', ',')} €</button>
        </div>
      </div>
    </section>
  );

  const renderCart = () => (
    <section className="section container cart-checkout-grid page-section">
      <div className="cart-panel">
        <SectionTitle eyebrow="Panier" title="Résumé de commande" />
        {cart.length === 0 ? <p className="empty-cart">Ajoute un produit pour tester le panier de la maquette.</p> : cart.map((item) => (
          <div className="cart-row" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <strong>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
            <button onClick={() => removeFromCart(item.id)}>Retirer</button>
          </div>
        ))}
        <div className="cart-total"><span>Total estimé</span><strong>{cartTotal.toFixed(2).replace('.', ',')} €</strong></div>
        <div className="cart-reassurance"><CreditCard size={18} /> Paiement compatible CBD à valider avant production</div>
      </div>
      <div className="checkout-panel">
        <SectionTitle eyebrow="Checkout" title="Tunnel simulé" />
        <form className="checkout-form">
          <input placeholder="Email" />
          <input placeholder="Nom et prénom" />
          <input placeholder="Adresse de livraison" />
          <label><input type="checkbox" /> J’accepte les CGV</label>
          <label><input type="checkbox" /> Je confirme être majeur</label>
          <button type="button" className="primary-button" onClick={() => navigate('/confirmation')}>Simuler la validation</button>
        </form>
      </div>
    </section>
  );

  const renderInfoPage = () => {
    if (legalPage) {
      return (
        <section className="section container page-section">
          <SectionTitle eyebrow={legalPage.eyebrow} title={legalPage.title} text={legalPage.text} />
          <div className="info-grid">
            {legalPage.points.map((point) => <div className="quality-card" key={point}><h3>{point}</h3><p>Contenu à finaliser avant mise en production.</p></div>)}
          </div>
        </section>
      );
    }

    const content = {
      '/guide-cbd-legal': ['Guide CBD légal', 'CBD, THC et achat responsable', 'Le CBD est présenté ici comme un produit à base de chanvre. La boutique ne formule aucune promesse médicale et ne remplace pas un avis professionnel.'],
      '/certificats-tracabilite': ['Certificats & traçabilité', 'Lots suivis et analyses visibles', 'Chaque produit réel devra être relié à un certificat d’analyse, une fiche fournisseur et un lot clairement identifiable.'],
      '/faq': ['FAQ', 'Questions fréquentes', 'Retrouve les informations essentielles sur la conformité, la livraison, les certificats et la sélection fournisseur.'],
      '/contact': ['Contact', 'Support client', 'Formulaire visuel pour la V1. Aucun message n’est envoyé tant que le backend n’est pas intégré.'],
      '/a-propos': ['À propos', 'Culture Bio Diamant', 'Une boutique premium construite autour de la sélection, de la transparence et d’une esthétique flyer noir/vert fluo.'],
      '/livraison-retours': ['Livraison & retours', 'Service client', 'Livraison suivie, retours et SAV devront être finalisés avec les vraies informations d’entreprise.'],
      '/compte': ['Compte client', 'Espace client simulé', 'La connexion et les commandes seront intégrées après backend.'],
      '/connexion': ['Connexion', 'Accès client simulé', 'Formulaire placeholder sans création réelle de compte.'],
      '/confirmation': ['Confirmation', 'Commande simulée reçue', 'Numéro fictif : CBD-2606-001. Aucun paiement réel n’a été déclenché.'],
    }[currentPath] ?? ['Page', 'Culture Bio Diamant', 'Contenu placeholder à compléter.'];

    return (
      <section className="section container page-section">
        <SectionTitle eyebrow={content[0]} title={content[1]} text={content[2]} />
        <div className="guide-grid">
          <div className="guide-points">
            <p><ShieldCheck /> THC conforme à la réglementation.</p>
            <p><FileText /> Certificat d’analyse disponible avant vente réelle.</p>
            <p><Boxes /> Aucun produit alimentaire CBD au lancement.</p>
          </div>
          <div className="quality-card">
            <h3>Charte premium</h3>
            <p>Noir profond, vert néon, glow diamant, cartes glassmorphism et communication responsable.</p>
            <button className="ghost-button" onClick={() => navigate('/boutique')}>Voir la boutique</button>
          </div>
        </div>
      </section>
    );
  };

  const renderCurrentPage = () => {
    if (currentPath === '/') return renderHome();
    if (currentPath === '/boutique' || currentPath.startsWith('/categorie/')) return renderShop();
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
            <p>Confirme que tu es majeur pour consulter cette boutique à base de chanvre et d’accessoires premium.</p>
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
