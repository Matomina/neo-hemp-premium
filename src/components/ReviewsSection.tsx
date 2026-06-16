import { useEffect, useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { reviewsApi, type Review, type ReviewStats } from '../services/reviewsApi';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { ENV } from '../config/env';

const MOCK_REVIEWS: Review[] = [
  { id: '1', authorName: 'Sophie M.', rating: 5, comment: 'Qualité exceptionnelle, certificats disponibles et livraison rapide. Je recommande.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '2', authorName: 'Thomas R.', rating: 4, comment: 'Très bon produit, emballage soigné. La traçabilité est un vrai plus.', createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: '3', authorName: 'Claire B.', rating: 5, comment: 'Service client réactif et produits conformes aux descriptions. Parfait.', createdAt: new Date(Date.now() - 86400000 * 14).toISOString() },
];
const MOCK_STATS: ReviewStats = { average: 4.7, count: 3 };

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="review-stars" aria-label={`${value} sur ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(value) ? 'review-star--filled' : 'review-star--empty'}
        />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="review-star-picker">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`review-star-pick${n <= (hover || value) ? ' review-star-pick--on' : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
        >
          <Star size={22} />
        </button>
      ))}
    </span>
  );
}

interface Props {
  productId: string;
}

export default function ReviewsSection({ productId }: Props) {
  const { token, user } = useCustomerAuth();
  const [reviews, setReviews] = useState<Review[]>(() => ENV.IS_MOCK ? MOCK_REVIEWS : []);
  const [stats, setStats] = useState<ReviewStats | null>(() => ENV.IS_MOCK ? MOCK_STATS : null);
  const [loadingReviews, setLoadingReviews] = useState(!ENV.IS_MOCK);

  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState(user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email : '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (ENV.IS_MOCK) return;
    reviewsApi.getByProduct(productId)
      .then(({ reviews: r, stats: s }) => { setReviews(r); setStats(s); })
      .catch(() => { setReviews([]); setStats({ average: 0, count: 0 }); })
      .finally(() => setLoadingReviews(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setFormError('Veuillez attribuer une note.'); return; }
    setFormError('');
    setSubmitting(true);
    try {
      if (ENV.IS_MOCK) {
        const fake: Review = { id: Date.now().toString(), authorName, rating, comment, createdAt: new Date().toISOString() };
        setReviews(prev => [fake, ...prev]);
        setStats(prev => prev ? { average: ((prev.average * prev.count) + rating) / (prev.count + 1), count: prev.count + 1 } : { average: rating, count: 1 });
        setFormSuccess('Merci pour votre avis !');
        setComment(''); setRating(5); setShowForm(false);
        return;
      }
      const created = await reviewsApi.create({ productId, authorName, rating, comment }, token ?? undefined);
      setReviews(prev => [created, ...prev]);
      setStats(prev => prev ? { average: ((prev.average * prev.count) + rating) / (prev.count + 1), count: prev.count + 1 } : { average: rating, count: 1 });
      setFormSuccess('Merci pour votre avis !');
      setComment(''); setRating(5); setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingReviews) return null;

  return (
    <div className="reviews-section">
      {/* En-tête */}
      <div className="reviews-header">
        <div className="reviews-header-left">
          <MessageSquare size={20} className="reviews-icon" />
          <h3 className="reviews-title">Avis clients</h3>
          {stats && stats.count > 0 && (
            <div className="reviews-summary">
              <StarRating value={stats.average} />
              <span className="reviews-avg">{stats.average.toFixed(1)}</span>
              <span className="reviews-count">({stats.count} avis)</span>
            </div>
          )}
        </div>
        <button
          type="button"
          className="ghost-button reviews-cta"
          onClick={() => { setShowForm(v => !v); setFormError(''); setFormSuccess(''); }}
        >
          {showForm ? 'Annuler' : 'Laisser un avis'}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form className="review-form quality-card" onSubmit={handleSubmit}>
          <h4 className="review-form-title">Votre avis</h4>
          {formError && <p className="login-error">{formError}</p>}
          <div className="review-form-rating">
            <label>Note *</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div className="checkout-field">
            <label>Votre nom *</label>
            <input
              placeholder="Prénom N."
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div className="checkout-field">
            <label>Commentaire *</label>
            <textarea
              className="review-textarea"
              placeholder="Partagez votre expérience avec ce produit..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              minLength={5}
              maxLength={1000}
              rows={4}
            />
          </div>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? 'Envoi...' : 'Publier mon avis'}
          </button>
        </form>
      )}

      {formSuccess && <p className="login-success">{formSuccess}</p>}

      {/* Liste des avis */}
      {reviews.length === 0 ? (
        <p className="reviews-empty">Soyez le premier à laisser un avis sur ce produit.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <div className="review-card quality-card" key={review.id}>
              <div className="review-card-header">
                <StarRating value={review.rating} />
                <strong className="review-author">{review.authorName}</strong>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
