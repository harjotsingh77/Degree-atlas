import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articles } from '../articlesData.js';
import { programmes, universities, inr } from '../data.js';
import { UniversityLogo } from '../components/UniversityLogo.jsx';
import { useCompare } from '../context/CompareContext.jsx';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { ids, add, remove } = useCompare();

  const article = articles.find((a) => a.slug === slug);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <main className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Article Not Found</h1>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>The article you are looking for does not exist or has been moved.</p>
        <Link to="/articles" className="btn btn-primary">Browse All Articles</Link>
      </main>
    );
  }

  // Related programmes matching article
  const relatedProgs = (article.relatedProgrammeIds || [])
    .map((id) => programmes.find((p) => p.id === id))
    .filter(Boolean);

  // Other articles for "Next up" recommendations
  const otherArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <main className="article-detail-page">
      {/* 01 — BREADCRUMB STRIP */}
      <div className="article-breadcrumb-strip">
        <div className="container">
          <nav className="article-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/articles">Articles</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-curr">{article.category}</span>
          </nav>
        </div>
      </div>

      {/* 02 — ARTICLE HEADER */}
      <header className="article-header-section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="article-meta-badges">
            <span className="article-cat-badge">{article.category}</span>
            <span className="article-tag-badge">{article.tag}</span>
            <span className="article-dot">•</span>
            <span className="article-read-meta">{article.readTime}</span>
            <span className="article-dot">•</span>
            <span className="article-date-meta">Published {article.publishedDate}</span>
          </div>

          <h1 className="article-main-title">{article.title}</h1>
          <p className="article-lead-summary">{article.summary}</p>

          {/* Author Block */}
          <div className="article-author-card">
            <div
              className="author-large-avatar"
              style={{ background: article.author.color, color: article.author.textColor }}
            >
              {article.author.avatar}
            </div>
            <div className="author-card-info">
              <strong className="author-card-name">{article.author.name}</strong>
              <span className="author-card-role">{article.author.role}</span>
            </div>
            <div className="verified-editorial-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Verified Editorial</span>
            </div>
          </div>
        </div>
      </header>

      {/* 03 — ARTICLE BODY & SECTIONS */}
      <div className="article-content-container">
        <div className="container" style={{ maxWidth: 860 }}>
          {/* Key Takeaways Highlight Box */}
          <div className="article-takeaways-box">
            <div className="takeaways-header">
              <span className="takeaways-icon">📌</span>
              <h2 className="takeaways-title">Key Decision Takeaways</h2>
            </div>
            <ul className="takeaways-list">
              {article.takeaways.map((point, idx) => (
                <li key={idx}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content Sections */}
          <div className="article-body-text">
            {article.content.map((sec, idx) => (
              <section key={idx} className="article-content-block">
                <h2 className="article-section-heading">{sec.heading}</h2>
                {sec.text && <p className="article-section-para">{sec.text}</p>}
                {sec.bullets && (
                  <ul className="article-bullets-list">
                    {sec.bullets.map((b, i) => (
                      <li key={i}>
                        <div className="bullet-num">{i + 1}</div>
                        <div className="bullet-content">
                          {b.includes(':') ? (
                            <>
                              <strong>{b.split(':')[0]}:</strong>
                              <span>{b.substring(b.indexOf(':') + 1)}</span>
                            </>
                          ) : (
                            <span>{b}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Related Programmes Directory */}
          {relatedProgs.length > 0 && (
            <div className="article-related-progs">
              <div className="related-progs-head">
                <h3 className="related-progs-title">Related UGC-Entitled Programmes</h3>
                <span className="related-progs-sub">Accredited degrees matching this guide’s criteria</span>
              </div>

              <div className="related-progs-grid">
                {relatedProgs.map((p) => {
                  const uni = universities.find((u) => u.id === p.universityId);
                  const isCompared = ids.includes(p.id);

                  return (
                    <div key={p.id} className="article-prog-card">
                      <div className="article-prog-top">
                        <UniversityLogo id={p.universityId} name={uni?.name} short={uni?.short} size={42} />
                        <div>
                          <strong className="article-prog-uni">{uni?.short || uni?.name}</strong>
                          <span className="article-prog-mode">{p.mode} · {p.durationMo} Mo</span>
                        </div>
                      </div>

                      <h4 className="article-prog-name">{p.name}</h4>
                      <div className="article-prog-fee">
                        <span>Total Tuition Fee:</span>
                        <strong>{inr(p.feeTotal)}</strong>
                      </div>

                      <div className="article-prog-actions">
                        <Link to={`/programmes/${p.slug}`} className="btn btn-accent btn-sm" style={{ flex: 1, borderRadius: 9999 }}>
                          View Details →
                        </Link>
                        <button
                          type="button"
                          className={`btn btn-sm ${isCompared ? 'btn-primary' : 'btn-ghost'}`}
                          style={{ borderRadius: 9999 }}
                          onClick={() => (isCompared ? remove(p.id) : add(p.id))}
                        >
                          {isCompared ? '✓ Added' : '+ Compare'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Share & Feedback Bar */}
          <div className="article-share-strip">
            <div className="share-strip-left">
              <span>Was this guide helpful?</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={(e) => {
                  e.currentTarget.textContent = '✓ Thank you!';
                  e.currentTarget.style.color = '#16A34A';
                }}
              >
                👍 Yes, very clear
              </button>
            </div>
            <Link to="/articles" className="link-btn" style={{ fontWeight: 600 }}>
              ← Back to All Articles
            </Link>
          </div>
        </div>
      </div>

      {/* 04 — NEXT UP / MORE GUIDES */}
      <section className="article-more-section">
        <div className="container" style={{ maxWidth: 860 }}>
          <h3 className="more-guides-heading">More Recommended Guides</h3>
          <div className="more-guides-grid">
            {otherArticles.map((a) => (
              <Link key={a.id} to={`/articles/${a.slug}`} className="more-guide-card">
                <span className="more-guide-cat">{a.category}</span>
                <h4 className="more-guide-title">{a.title}</h4>
                <div className="more-guide-meta">
                  <span>{a.readTime}</span>
                  <span className="more-guide-arrow">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
