import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, Boxes, CheckCircle2, CreditCard, FileText, Gem, Leaf, LockKeyhole, MessageCircle, PackageCheck, ShieldCheck, Sparkles, Truck, UserRound } from 'lucide-react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { SectionTitle } from './components/SectionTitle';
import { Footer } from './components/Footer';
import { categoryDescriptions, categoryLabels, products } from './data/products';
import { aboutBlocks, flyerInsights, homepageStory, legalBlocks, liveForumPosts, premiumValues } from './data/siteContent';
import type { CartItem, CategorySlug, Product } from './types';
import visualMockup from './assets/maquette-boutique-cbd-visuelle.png';

const ACCESS_KEY = 'culture-bio-diamant-majorite-ok';

const trustItems = [
  { icon: ShieldCheck, label: 'Contrôlé & certifié' },
  { icon: FileText, label: 'Lots et analyses visibles' },
  { icon: Truck, label: 'Livraison suivie' },
  { icon: LockKeyhole, label: 'Paiement sécurisé à valider' },
];

const categoryCards: Array<{ slug: CategorySlug; text: string }> = [
  { slug: 'fleurs', text: 'Fleurs premium mockées pour présenter taux, origine, lot et certificat.' },
  { slug: 'resines', text: 'Résines sélectionnées avec logique de preuve et fiches produit détaillées.' },
  { slug: 'cosmetiques', text: 'Cosmétiques au chanvre à publier uniquement avec dossier fournisseur complet.' },
  { slug: 'accessoires', text: 'Accessoires élégants pour enrichir le panier sans ajouter de risque produit.' },
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

  const changeQuantity = (productId: number, direction: 'up' | 'down') => {
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
    <>
      <section className="hero-section neon-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={16} /> Culture Bio Diamant • Premium Naturel</span>
            <h1>CBD premium, noir profond, éclat vert diamant.</h1>
            <p>
              Le flyer impose une identité forte : une feuille lumineuse, un diamant, un laboratoire, une promesse naturelle et un univers noir/vert fluo. Le site reprend cette direction pour raconter une marque élégante, rassurante et structurée autour de la qualité.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigate('/boutique')}>Découvrir les produits <ArrowRight size={18} /></button>
              <button className="ghost-button" onClick={() => navigate('/a-propos')}>Comprendre la marque</button>
            </div>
            <div className="hero-proof">
              <span><CheckCircle2 size={17} /> 100% naturel premium</span>
              <span><CheckCircle2 size={17} /> Qualité diamant</span>
              <span><CheckCircle2 size={17} /> Contrôle laboratoire</span>
            </div>
          </div>

          <div className="hero-visual-card">
            <img src={visualMockup} alt="Univers visuel Culture Bio Diamant noir premium et vert néon" />
            <div className="diamond-glow" aria-hidden="true"><Gem size={92} /></div>
            <div className="floating-card top"><BadgeCheck size={18} /> Contrôlé & certifié</div>
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
        <SectionTitle eyebrow="Analyse du flyer" title="Une identité naturelle, lumineuse et premium" text="Le site doit développer le message du flyer : pas seulement vendre des produits, mais expliquer une méthode, une exigence et une expérience de marque." />
        <div className="info-grid">
          {flyerInsights.map((item) => (
            <article className="quality-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section guide-section">
        <div className="container guide-grid">
          <div>
            <SectionTitle eyebrow="Notre promesse" title="Du contenu clair avant la vente" text="Une page d’accueil premium doit rassurer : expliquer la sélection, montrer les preuves, présenter les catégories et donner envie d’entrer dans l’univers Culture Bio Diamant." />
            <div className="guide-points">
              {homepageStory.map((item) => (
                <p key={item.title}><Gem /> <span><strong>{item.title}</strong><br />{item.text}</span></p>
              ))}
            </div>
          </div>
          <div className="quality-card">
            <h3>Pourquoi “Diamant” ?</h3>
            <p>Parce que le diamant évoque la sélection, la précision et la lumière. La boutique doit rester courte, propre, très lisible, avec des produits bien présentés plutôt qu’un catalogue dispersé.</p>
            <button className="ghost-button" onClick={() => navigate('/certificats-tracabilite')}>Voir la traçabilité</button>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionTitle eyebrow="Catalogue premium" title="Des catégories lisibles et mieux expliquées" text="Chaque catégorie garde le style flyer : noir intense, vert fluo, bordure diamant, texte naturel et présentation haut de gamme." />
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
          <SectionTitle eyebrow="Produits en avant" title="Cartes produits glow diamant" text="La V1 contient des produits mockés pour valider la structure : nom, catégorie, taux, lot, origine, précautions, certificat et panier." />
          <div className="product-grid">
            {products.map((product) => (
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
            <span>Catégorie : {categoryLabels[visibleProduct.category]}</span>
            <span>CBD : {visibleProduct.cbdRate ?? 'Selon fiche produit'}</span>
            <span>THC : {visibleProduct.thcRate}</span>
            <span>Origine : {visibleProduct.origin}</span>
            <span>Lot : {visibleProduct.lot}</span>
            <span>Certificat : {visibleProduct.certificateAvailable ? 'Disponible' : 'À compléter'}</span>
          </div>
          <div className="tabs-preview">
            <button>Description</button><button>Analyse / certificat</button><button>Composition</button><button>Précautions</button>
          </div>
          <p className="compliance-box"><strong>Composition :</strong> {visibleProduct.composition}</p>
          <p className="compliance-box"><strong>Précautions :</strong> {visibleProduct.precautions}</p>
          <button className="primary-button" onClick={() => addToCart(visibleProduct)}>Ajouter au panier — {visibleProduct.price.toFixed(2).replace('.', ',')} €</button>
        </div>
      </div>
    </section>
  );

  const renderCart = () => (
    <section className="section container cart-checkout-grid page-section">
      <div className="cart-panel">
        <SectionTitle eyebrow="Panier" title="Résumé de commande premium" text="Le panier doit rassurer : produits clairs, quantités lisibles, total estimé, rappel de la conformité et tunnel simple." />
        {cart.length === 0 ? <p className="empty-cart">Ton panier est vide. Ajoute un produit pour tester le parcours d’achat de la maquette.</p> : cart.map((item) => (
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
          <label><input type="checkbox" /> J’accepte les conditions d’utilisation et les CGV</label>
          <label><input type="checkbox" /> Je confirme être majeur</label>
          <button type="button" className="primary-button" onClick={() => navigate('/confirmation')}>Simuler la validation</button>
        </form>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section className="section container page-section">
      <SectionTitle eyebrow="À propos" title="Une marque naturelle, moderne et premium" text="Culture Bio Diamant reprend l’énergie du flyer : un univers végétal lumineux, une exigence de contrôle et une présentation haut de gamme." />
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
      <SectionTitle eyebrow="Forum live" title="Espace communauté simulé" text="La V1 prévoit un espace de discussion premium pour annonces, questions clients et réponses support. Aucun message n’est envoyé en production dans cette maquette." />
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
          <p>La V1 prépare les écrans. Le backend devra ensuite gérer l’authentification, les commandes, les adresses et la sécurité des données.</p>
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
              <p>Information à finaliser avec les données réelles de l’entreprise avant publication officielle.</p>
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
      '/certificats-tracabilite': ['Certificats & traçabilité', 'Lots suivis et analyses visibles', 'Chaque produit réel devra être relié à un certificat d’analyse, une fiche fournisseur, un lot et des précautions clairement lisibles.'],
      '/faq': ['FAQ', 'Questions fréquentes', 'Retrouve les informations essentielles sur la sélection, la livraison, le panier, les certificats et le futur compte client.'],
      '/contact': ['Contact', 'Support client', 'Formulaire visuel pour la V1. Aucun message n’est envoyé tant que le backend n’est pas intégré.'],
      '/livraison-retours': ['Livraison & retours', 'Service client', 'Livraison suivie, retours et SAV devront être finalisés avec les vraies informations d’entreprise.'],
      '/confirmation': ['Confirmation', 'Commande simulée reçue', 'Numéro fictif : CBD-2606-001. Aucun paiement réel n’a été déclenché.'],
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
