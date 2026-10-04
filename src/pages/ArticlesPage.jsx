import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { articles, articleCategories } from '../articlesData.js';
import { programmes, universities } from '../data.js';
import { useCompare } from '../context/CompareContext.jsx';

export default function ArticlesPage() {
  const { count, setModalOpen } = useCompare();
  const [selectedCat, setSelectedCat] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = selectedCat === 'All Articles' || a.category === selectedCat;
      const matchQuery =
        !searchQuery.trim() ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCat, searchQuery]);

  const featuredArticle = articles[0];

  return (
    <div className="articles-page-wrapper">
      {/* 01 — HERO HEADER (Matching AllProgrammesPage & AllUniversitiesPage) */}
      <section className="all-progs-hero">
        <div className="container">
          <nav className="all-progs-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Articles & Guides</span>
          </nav>

          <div className="all-progs-header-box">
            <h1 className="all-progs-title">Expert Articles & Decision Frameworks</h1>
            <p className="all-progs-subtitle">
              Empower your education choices with unbiased research, accreditation checklists, salary ROI analysis, and career insights.
            </p>

            {/* Search Input + Category Filter Pills in the SAME Row */}
            <div className="all-progs-search-tabs-row">
              <div className="all-progs-search-input-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles (e.g. MBA, Checklist, ROI, Placement...)"
                  aria-label="Search articles"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="all-progs-clear-btn"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Inline Filter Tabs Strip */}
              <div className="all-progs-tabs-inline" role="tablist" aria-label="Article categories">
                {articleCategories.map((cat) => {
                  const count = cat === 'All Articles' ? articles.length : articles.filter((a) => a.category === cat).length;
                  const isActive = selectedCat === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`all-progs-cat-pill ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat)}
                    >
                      <span>{cat}</span>
                      <span className="all-progs-cat-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Metrics Row - Plain Text Row matching other pages */}
            <div className="all-progs-metrics-text-row">
              <span className="all-progs-metric-text">
                <strong>{articles.length}</strong> In-Depth Guides
              </span>
              <span className="metric-sep">·</span>
              <span className="all-progs-metric-text">
                <strong>100%</strong> Free & Unbiased
              </span>
              <span className="metric-sep">·</span>
              <span className="all-progs-metric-text">
                <strong>Verified</strong> Academic Advisory
              </span>
              <span className="metric-sep">·</span>
              <span className="all-progs-metric-text">
                <strong>Updated</strong> for 2026 Admissions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — FEATURED HERO CARD (Shown when "All Articles" and no search) */}
      {selectedCat === 'All Articles' && !searchQuery && (
        <section className="articles-featured-section">
          <div className="container">
            <div className="articles-featured-card">
              <div className="featured-card-badge-row">
                <span className="featured-tag">Trending Guide</span>
                <span className="featured-cat">{featuredArticle.category}</span>
                <span className="featured-time">{featuredArticle.readTime}</span>
              </div>
              <h2 className="featured-card-title">
                <Link to={`/articles/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
              </h2>
              <p className="featured-card-summary">{featuredArticle.summary}</p>

              <div className="featured-card-footer">
                <div className="featured-author">
                  <div
                    className="author-avatar"
                    style={{ background: featuredArticle.author.color, color: featuredArticle.author.textColor }}
                  >
                    {featuredArticle.author.avatar}
                  </div>
                  <div>
                    <strong className="author-name">{featuredArticle.author.name}</strong>
                    <span className="author-role">{featuredArticle.author.role}</span>
                  </div>
                </div>

                <Link to={`/articles/${featuredArticle.slug}`} className="atlas-getstarted-btn" style={{ padding: '10px 24px', fontSize: '14.5px' }}>
                  Read Full Guide →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 03 — ARTICLES GRID */}
      <section className="articles-grid-section">
        <div className="container">
          <div className="articles-grid-head">
            <h2 className="articles-grid-heading">
              {selectedCat === 'All Articles' ? 'All Published Guides' : `${selectedCat}`}
              <span className="articles-count-pill">({filteredArticles.length})</span>
            </h2>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="articles-empty-state">
              <p>No articles matched your search query. Try searching for different keywords or select "All Articles".</p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => { setSelectedCat('All Articles'); setSearchQuery(''); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="articles-main-grid">
              {filteredArticles.map((article) => (
                <article key={article.id} className="article-card-item">
                  <div className="article-card-header">
                    <span className="article-icon-wrap" aria-hidden="true">{article.icon}</span>
                    <span className="article-cat-tag">{article.category}</span>
                    <span className="article-read-badge">{article.readTime}</span>
                  </div>

                  <h3 className="article-item-title">
                    <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="article-item-summary">{article.summary}</p>

                  <div className="article-takeaways-preview">
                    <strong>Key Takeaway:</strong> {article.takeaways[0]}
                  </div>

                  <div className="article-item-footer">
                    <div className="article-author-mini">
                      <div
                        className="author-avatar-mini"
                        style={{ background: article.author.color, color: article.author.textColor }}
                      >
                        {article.author.avatar}
                      </div>
                      <span className="author-name-mini">{article.author.name}</span>
                    </div>

                    <Link to={`/articles/${article.slug}`} className="article-read-link">
                      Read Guide <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 04 — FINAL CTA (Same to same as Home Page) */}
      <section className="final-cta-section">
        <div className="final-cta">
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="section-title">Ready to find your ideal online degree?</h2>
            <p className="section-sub">
              Explore {programmes.length}+ accredited programmes across {universities.length} top universities or compare your shortlist today.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/programmes" className="btn btn-accent">Explore All Programmes →</Link>
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(true)}>
                Compare Degrees{count > 0 ? ` (${count})` : ''}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
