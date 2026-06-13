import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Award, CheckCircle2, ChevronRight, ExternalLink,
  FlaskConical, Info, Leaf, Package, ShieldCheck, Star,
} from 'lucide-react';
import { categoryLabels, categoryPreviewImages, products } from '../data/products';
import { useCart } from '../context';
import NotFoundPage from './NotFoundPage';
import ReviewsSection from '../components/ReviewsSection';

type Tab = 'description' | 'specs' | 'analyses' | 'avis';

const TAB_LABELS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'description', label: 'Description',       icon: <Info size={14} /> },
  { key: 'specs',       label: 'Caractéristiques',  icon: <Leaf size={14} /> },
  { key: 'analyses',    label: 'Analyses',           icon: <FlaskConical size={14} /> },
  { key: 'avis',        label: 'Avis clients',       icon: <Star size={14} /> },
];

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [imgError, setImgError] = useState(false);

  const product = products.find((p) => p.slug === slug);
  if (!product) return <NotFoundPage />;

  const inStock = (product.stock ?? 1) > 0 && product.launchStatus !== 'coming-soon';

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    if (imgError || !product) return;
    setImgError(true);
    const img = e.currentTarget;
    const preview = categoryPreviewImages[product.category];
    if (img.src !== preview) { img.src = preview; }
  }

  return (
    <div className="product-page-wrap page-section">

      {/* ── Fiche produit ── */}
      <div className="container">
        <div className="pdp-grid">

          {/* Visuel */}
          <div className={`pdp-visual ${product.imageTone ?? 'emerald'}`}>
            <img
              src={product.image}
              alt={product.imageAlt ?? product.name}
              className="pdp-img"
              loading="lazy"
              onError={handleImgError}
            />
            <span className="pdp-orb" />
            {product.isNew && <span className="pdp-badge pdp-badge--new">Nouveau</span>}
            {product.isBestSeller && <span className="pdp-badge pdp-badge--bs">Best-seller</span>}
          </div>

          {/* Infos */}
          <div className="pdp-info">
            <span className="pdp-eyebrow">
              {categoryLabels[product.category]}
              {product.culture && <> · {product.culture}</>}
            </span>

            <h1 className="pdp-title">{product.name}</h1>

            {product.badge && (
              <span className="pdp-tag">{product.badge}</span>
            )}

            <p className="pdp-short-desc">{product.shortDescription ?? product.description}</p>

            {/* Taux */}
            <div className="pdp-rates">
              {product.cbdRate && (
                <div className="pdp-rate">
                  <span className="pdp-rate-label">CBD</span>
                  <span className="pdp-rate-val">{product.cbdRate}</span>
                </div>
              )}
              {(product.thcRate ?? product.thc) && (
                <div className="pdp-rate pdp-rate--thc">
                  <span className="pdp-rate-label">THC</span>
                  <span className="pdp-rate-val">{product.thcRate ?? product.thc}</span>
                </div>
              )}
              {product.cbgRate && (
                <div className="pdp-rate">
                  <span className="pdp-rate-label">CBG</span>
                  <span className="pdp-rate-val">{product.cbgRate}</span>
                </div>
              )}
            </div>

            {/* Prix */}
            <div className="pdp-price-row">
              <span className="pdp-price">
                {product.price.toFixed(2).replace('.', ',')} €
              </span>
              {product.oldPrice && (
                <span className="pdp-old-price">
                  {product.oldPrice.toFixed(2).replace('.', ',')} €
                </span>
              )}
              <span className={`pdp-stock ${inStock ? 'pdp-stock--in' : 'pdp-stock--out'}`}>
                {inStock ? '● EN STOCK' : '● INDISPONIBLE'}
              </span>
            </div>

            {/* CTA */}
            <div className="pdp-ctas">
              <button
                type="button"
                className="primary-button pdp-add-btn"
                disabled={!inStock}
                onClick={() => addToCart(product)}
              >
                + Ajouter au panier
              </button>
            </div>

            {/* Garanties */}
            <div className="pdp-guarantees">
              <span className="pdp-guarantee"><ShieldCheck size={12} /> Livraison 24/48h</span>
              <span className="pdp-guarantee"><Award size={12} /> Paiement sécurisé</span>
              <span className="pdp-guarantee"><Package size={12} /> Retours faciles</span>
            </div>
          </div>
        </div>

        {/* ── Onglets ── */}
        <div className="pdp-tabs">
          <div className="pdp-tabs-nav" role="tablist">
            {TAB_LABELS.map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key ? true : false}
                className={`pdp-tab${activeTab === key ? ' pdp-tab--active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="pdp-tab-body" role="tabpanel">

            {/* ── Description ── */}
            {activeTab === 'description' && (
              <div className="pdp-description">
                <p className="pdp-desc-text">{product.details ?? product.description}</p>

                {product.highlights && product.highlights.length > 0 && (
                  <div className="pdp-highlights">
                    <h4 className="pdp-section-label">Points clés</h4>
                    <ul className="pdp-highlights-list">
                      {product.highlights.map(h => (
                        <li key={h} className="pdp-highlight-item">
                          <CheckCircle2 size={14} className="pdp-check-icon" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.usageNote && (
                  <div className="pdp-info-box">
                    <h4>Mode d'utilisation</h4>
                    <p>{product.usageNote}</p>
                  </div>
                )}

                {product.complianceNote && (
                  <div className="pdp-info-box pdp-info-box--legal">
                    <h4>Note de conformité</h4>
                    <p>{product.complianceNote}</p>
                  </div>
                )}

                {product.precautions && (
                  <div className="pdp-info-box pdp-info-box--warn">
                    <h4>Précautions</h4>
                    <p>{product.precautions}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Caractéristiques ── */}
            {activeTab === 'specs' && (
              <div className="pdp-specs">
                <div className="pdp-specs-grid">
                  {[
                    { label: 'Catégorie',    val: categoryLabels[product.category] },
                    { label: 'CBD',          val: product.cbdRate ?? '—' },
                    { label: 'THC',          val: product.thcRate ?? product.thc ?? '< 0,3%' },
                    product.cbgRate ? { label: 'CBG', val: product.cbgRate } : null,
                    product.cbnRate ? { label: 'CBN', val: product.cbnRate } : null,
                    { label: 'Culture',      val: product.culture ?? '—' },
                    { label: 'Origine',      val: product.origin ?? 'Chanvre UE' },
                    { label: 'Format',       val: product.format ?? '—' },
                    { label: 'Lot',          val: product.lot ?? '—' },
                    product.brand ? { label: 'Marque', val: product.brand } : null,
                    { label: 'Stock',        val: (product.stock ?? '—').toString() },
                    { label: 'Certificat',   val: product.certificateAvailable ? 'Disponible' : 'Sur demande' },
                  ].filter(Boolean).map(row => (
                    <div className="pdp-spec-row" key={row!.label}>
                      <span className="pdp-spec-label">{row!.label}</span>
                      <span className="pdp-spec-val">{row!.val}</span>
                    </div>
                  ))}
                </div>

                {product.flavors && product.flavors.length > 0 && (
                  <div className="pdp-flavors">
                    <h4 className="pdp-section-label">Arômes & saveurs</h4>
                    <div className="pdp-flavor-tags">
                      {product.flavors.map(f => (
                        <span key={f} className="pdp-flavor-tag">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {product.composition && (
                  <div className="pdp-info-box">
                    <h4>Composition</h4>
                    <p>{product.composition}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Analyses / Certificat ── */}
            {activeTab === 'analyses' && (
              <div className="pdp-analyses">
                <div className="pdp-cert-banner">
                  <FlaskConical size={36} className="pdp-cert-icon" />
                  <div>
                    <h4>Certification laboratoire</h4>
                    <p>
                      {product.certificateAvailable
                        ? 'Un certificat d\'analyse (COA) est disponible pour ce produit. Analyses réalisées par un laboratoire accrédité ISO 17025.'
                        : 'Le certificat d\'analyse pour ce produit est en cours de finalisation. Disponible sur demande.'}
                    </p>
                  </div>
                </div>

                <div className="pdp-specs-grid">
                  <div className="pdp-spec-row">
                    <span className="pdp-spec-label">CBD mesuré</span>
                    <span className="pdp-spec-val">{product.cbdRate ?? '—'}</span>
                  </div>
                  <div className="pdp-spec-row">
                    <span className="pdp-spec-label">THC mesuré</span>
                    <span className="pdp-spec-val">{product.thcRate ?? product.thc ?? '< 0,3%'}</span>
                  </div>
                  {product.cbgRate && (
                    <div className="pdp-spec-row">
                      <span className="pdp-spec-label">CBG mesuré</span>
                      <span className="pdp-spec-val">{product.cbgRate}</span>
                    </div>
                  )}
                  <div className="pdp-spec-row">
                    <span className="pdp-spec-label">Numéro de lot</span>
                    <span className="pdp-spec-val">{product.lot ?? '—'}</span>
                  </div>
                  <div className="pdp-spec-row">
                    <span className="pdp-spec-label">Origine chanvre</span>
                    <span className="pdp-spec-val">{product.origin ?? 'UE'}</span>
                  </div>
                  <div className="pdp-spec-row">
                    <span className="pdp-spec-label">COA disponible</span>
                    <span className="pdp-spec-val">{product.certificateAvailable ? 'Oui' : 'Sur demande'}</span>
                  </div>
                </div>

                {product.complianceWarning && (
                  <div className="pdp-info-box pdp-info-box--warn">
                    <h4>Avertissement réglementaire</h4>
                    <p>{product.complianceWarning}</p>
                  </div>
                )}

                <div className="pdp-cert-legal">
                  <ShieldCheck size={14} />
                  <p>
                    Tous nos produits sont conformes à la réglementation française en vigueur.
                    THC ≤ 0,3 % conformément à la décision du Conseil d'État du 29 décembre 2022
                    et au règlement européen 2021/2115.
                  </p>
                </div>

                {product.certificateAvailable && (
                  <a href="/certificats-tracabilite" className="pdp-cert-link">
                    <ExternalLink size={14} />
                    Voir la page Certificats & traçabilité
                    <ChevronRight size={14} />
                  </a>
                )}
              </div>
            )}

            {/* ── Avis clients ── */}
            {activeTab === 'avis' && (
              <ReviewsSection productId={product.id} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
