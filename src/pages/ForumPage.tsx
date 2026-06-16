import { MessageCircle } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { liveForumPosts } from '../data/siteContent';

export default function ForumPage() {
  return (
    <section className="section container page-section">
      <SectionTitle
        eyebrow="Forum live"
        title="Espace communauté simulé"
        text="La V1 prévoit un espace de discussion premium pour annonces, questions clients et réponses support. Aucun message n'est envoyé en production dans cette maquette."
      />
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
}
