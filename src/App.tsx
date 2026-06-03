import { useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, Boxes, CheckCircle2, CreditCard, FileText, Leaf, LockKeyhole, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { SectionTitle } from './components/SectionTitle';
import { Footer } from './components/Footer';
import { categoryLabels, products } from './data/products';
import { faqs } from './data/faqs';
import type { CartItem, CategorySlug, Product } from './types';
import visualMockup from './assets/maquette-boutique-cbd-visuelle.png';

const trustItems = [
  { icon: ShieldCheck, label: 'THC conforme' },
  { icon: FileText, label: 'Certificats disponibles' },
  { icon: Truck, label: 'Livraison suivie' },
  { icon: LockKeyhole, label: 'Paiement sécurisé' },
];

const categoryCards: Array<{ slug: CategorySlug; text: string }> = [
  { slug: 'fleurs', text: 'Sélection courte, traçable et analysée par lot.' },
  { slug: 'resines', text: 'Origine, taux et documents fournisseur vérifiés.' },
  { slug: 'cosmetiques', text: 'Uniquement avec dossier cosmétique complet.' },
  { slug: 'accessoires', text: 'Produits simples pour compléter le panier moyen.' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    scrollTo('fiche-produit');
  };

  return (
    <div className="app-shell">
      <Header cartCount={cartCount} onNavigate={scrollTo} />

      <main>
        <section id="home" className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><Sparkles size={16} /> Neo Hemp Premium</span>
              <h1>CBD premium, sélectionné avec exigence.</h1>
              <p>
                Une boutique moderne à base de chanvre, pensée pour la transparence, la traçabilité et une expérience d’achat rassurante.
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => scrollTo('boutique')}>Découvrir la boutique <ArrowRight size={18} /></button>
                <button className="ghost-button" onClick={() => scrollTo('guide')}>Comprendre le CBD légal</button>
              </div>
              <div className="hero-proof">
                <span><CheckCircle2 size={17} /> Sans allégation médicale</span>
                <span><CheckCircle2 size={17} /> Gamme V1 maîtrisée</span>
              </div>
            </div>

            <div className="hero-visual-card">
              <img src={visualMockup} alt="Maquette visuelle futuriste de la boutique CBD" />
              <div className="floating-card top"><BadgeCheck size={18} /> Analyses par lot</div>
              <div className="floating-card bottom"><PackageCheck size={18} /> Livraison suivie</div>
            </div>
          </div>
        </section>

        <section className="trust-strip container">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label}><Icon size={22} /><span>{label}</span></div>
          ))}
        </section>

        <section id="categories" className="section container">
          <SectionTitle eyebrow="Catalogue V1" title="Une gamme courte, lisible et contrôlée" text="La maquette évite les catégories à risque au lancement et met en avant les produits documentés." />
          <div className="category-grid">
            {categoryCards.map((category) => (
              <button key={category.slug} className="category-card" onClick={() => { setActiveCategory(category.slug); scrollTo('boutique'); }}>
                <Leaf size={26} />
                <h3>{categoryLabels[category.slug]}</h3>
                <p>{category.text}</p>
                <span>Explorer <ArrowRight size={15} /></span>
              </button>
            ))}
          </div>
        </section>

        <section id="boutique" className="section boutique-section">
          <div className="container">
            <SectionTitle eyebrow="Boutique" title="Produits mockés pour valider l’expérience d’achat" text="Les vrais prix, certificats et lots fournisseur seront intégrés après validation de la matrice produit." />
            <div className="shop-layout">
              <aside className="filters-panel">
                <h3>Filtres</h3>
                <button className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>Tous les produits</button>
                {Object.entries(categoryLabels).map(([slug, label]) => (
                  <button key={slug} className={activeCategory === slug ? 'active' : ''} onClick={() => setActiveCategory(slug as CategorySlug)}>{label}</button>
                ))}
                <div className="legal-note">
                  <strong>Note V1</strong>
                  <p>Alimentaire CBD, gummies, huiles à ingérer et cannabinoïdes interdits sont exclus de cette maquette de lancement.</p>
                </div>
              </aside>
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} onView={viewProduct} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="fiche-produit" className="section container product-detail-section">
          <SectionTitle eyebrow="Fiche produit" title="Conversion + transparence + conformité" />
          <div className="product-detail">
            <div className={`detail-visual ${selectedProduct.imageTone}`}>
              <span className="detail-pack">{selectedProduct.name}</span>
            </div>
            <div className="detail-content">
              <span className="eyebrow">{categoryLabels[selectedProduct.category]}</span>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <div className="detail-specs">
                <span>CBD : {selectedProduct.cbdRate ?? 'Selon fiche produit'}</span>
                <span>THC : {selectedProduct.thcRate}</span>
                <span>Origine : {selectedProduct.origin}</span>
                <span>Lot : {selectedProduct.lot}</span>
              </div>
              <div className="tabs-preview">
                <button>Description</button><button>Analyse / certificat</button><button>Composition</button><button>Précautions</button>
              </div>
              <p className="compliance-box">Ce produit est présenté comme exemple de maquette. En production, la publication dépendra des certificats, fiches techniques et documents fournisseur disponibles.</p>
              <button className="primary-button" onClick={() => addToCart(selectedProduct)}>Ajouter au panier — {selectedProduct.price.toFixed(2).replace('.', ',')} €</button>
            </div>
          </div>
        </section>

        <section id="guide" className="section guide-section">
          <div className="container guide-grid">
            <div>
              <SectionTitle eyebrow="Guide CBD légal" title="Informer sans promettre d’effet thérapeutique" text="La page guide sert à rassurer, éduquer et travailler le SEO sans basculer dans les allégations santé." />
              <div className="guide-points">
                <p><ShieldCheck /> Différence CBD / THC expliquée clairement.</p>
                <p><FileText /> Certificats et analyses rendus visibles.</p>
                <p><Boxes /> Produits volontairement exclus au lancement.</p>
              </div>
            </div>
            <div className="quality-card">
              <h3>Certificats & traçabilité</h3>
              <p>Une page dédiée permet d’expliquer les lots, les analyses et les documents exigés avant la mise en ligne d’un produit.</p>
              <button className="ghost-button" onClick={() => scrollTo('faq')}>Voir les questions fréquentes</button>
            </div>
          </div>
        </section>

        <section id="panier" className="section container cart-checkout-grid">
          <div className="cart-panel">
            <SectionTitle eyebrow="Panier" title="Résumé de commande" />
            {cart.length === 0 ? <p className="empty-cart">Ajoute un produit pour tester le panier de la maquette.</p> : cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <strong>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
              </div>
            ))}
            <div className="cart-total"><span>Total estimé</span><strong>{cartTotal.toFixed(2).replace('.', ',')} €</strong></div>
            <div className="cart-reassurance"><CreditCard size={18} /> Paiement compatible CBD à valider avant production</div>
          </div>
          <div className="checkout-panel">
            <SectionTitle eyebrow="Checkout" title="Tunnel court et rassurant" />
            <form className="checkout-form">
              <input placeholder="Email" />
              <input placeholder="Nom et prénom" />
              <input placeholder="Adresse de livraison" />
              <label><input type="checkbox" /> J’accepte les CGV</label>
              <label><input type="checkbox" /> Je confirme avoir plus de 18 ans</label>
              <button type="button" className="primary-button">Simuler la validation</button>
            </form>
          </div>
        </section>

        <section id="faq" className="section container">
          <SectionTitle eyebrow="FAQ" title="Questions essentielles avant lancement" />
          <div className="faq-grid">
            {faqs.map((faq) => (
              <details key={faq.question} open>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="section container contact-section">
          <div>
            <SectionTitle eyebrow="Contact" title="Support client clair et professionnel" text="La production devra ajouter l’adresse de l’entreprise, le SIRET, l’hébergeur et les informations légales réelles." />
          </div>
          <form className="contact-form">
            <input placeholder="Nom" />
            <input placeholder="Email" />
            <textarea placeholder="Message" rows={5} />
            <button type="button" className="primary-button">Envoyer</button>
          </form>
        </section>
      </main>

      <Footer />
      <div className="sticky-mobile-cta">
        <span>Voir les produits conformes</span>
        <button onClick={() => scrollTo('boutique')}>Boutique</button>
      </div>
    </div>
  );
}

export default App;
