import { fetchNewsItems } from '../services/newsService';

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/MainPage.css';

const OurNews = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const highlightedArticleId = searchParams.get('article');
  const MAX_EXCERPT = 180;
  
  const [newsDataState, setNewsDataState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const items = await fetchNewsItems();
      setNewsDataState(items);
      setLoading(false);
    };
    loadNews();
  }, []);

  // Filter news based on category and search
  const filteredNews = newsDataState.filter(news => {
    const matchesCategory = activeFilter === 'all' || news.category === activeFilter;
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filterNews = (category) => {
    setActiveFilter(category);
  };

  const categories = ['all', 'health-updates', 'events', 'awards', 'innovation', 'community'];

  const categoryDisplayNames = {
    'all': 'All News',
    'health-updates': 'Health Updates',
    'events': 'Events',
    'awards': 'Awards',
    'innovation': 'Innovation',
    'community': 'Community'
  };

  // Get featured (important) news for hero section
  const regularNews = filteredNews;

  return (
    <div className="news-page">
      {/* Main News Section */}
      <section className="news-main">
        <div className="container">
          <div className="news-layout">
            {/* Sidebar */}
            <aside className="news-sidebar">
              <div className="sidebar-widget">
                <h3 className="widget-title">Search News</h3>
                <div className="search-widget">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <button className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>

              <div className="sidebar-widget">
                <h3 className="widget-title">Categories</h3>
                <div className="category-list">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`category-btn ${activeFilter === category ? 'active' : ''}`}
                      onClick={() => filterNews(category)}
                    >
                      {categoryDisplayNames[category] || category}
                      {category !== 'all' && (
                        <span className="category-count">
                          ({newsDataState.filter(news => news.category === category).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-widget">
                <h3 className="widget-title">News Stats</h3>
                <div className="stats-widget">
                  <div className="stat-item">
                    <span className="stat-number">{newsDataState.length}</span>
                    <span className="stat-label">Total Articles</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{filteredNews.length}</span>
                    <span className="stat-label">Showing Now</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="news-content">
              <div className="content-header">
                <h2 className="section-heading">
                  {activeFilter === 'all' ? 'All News' : categoryDisplayNames[activeFilter]}
                  <span className="result-count">({filteredNews.length} articles)</span>
                </h2>
              </div>

              {regularNews.length > 0 ? (
                <div className="news-grid">
                  {regularNews.map((news) => (
                  <article key={news.id} className={`news-article-card ${highlightedArticleId === news.id ? 'highlighted' : ''}`}>
                    <div className="article-image">
                      <img src={news.image} alt={news.title} />
                      {news.badge && <div className="article-badge">{news.badge}</div>}
                    </div>
                    <div className="article-content">
                      <div className="article-category">
                        <span className={`category-tag ${news.category}`}>
                          {categoryDisplayNames[news.category] || news.category}
                        </span>
                      </div>
                      <h3 className="article-title">
                        {news.title}
                      </h3>
                      <p className="article-excerpt">
                          {highlightedArticleId === news.id && news.fullDescription
                            ? news.fullDescription.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)
                            : (news.excerpt || '').slice(0, MAX_EXCERPT)}
                      </p>
                      <div className="article-meta">
                        <span className="meta-date">
                          <i className="fas fa-calendar"></i> {news.date}
                        </span>
                        <span className="meta-author">
                          <i className="fas fa-user"></i> {news.author}
                        </span>
                        <span className="meta-location">
                          <i className="fas fa-map-marker-alt"></i> {news.location}
                        </span>
                      </div>
                      <Link to={`/news/${news.id}`} className="read-more-btn">
                        Read More <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </article>
                  ))}
                </div>
              ) : (
                <div className="no-news">
                  <div className="no-news-icon">
                    <i className="fas fa-newspaper"></i>
                  </div>
                  <h3>No articles found</h3>
                  <p>Try adjusting your search terms or browse different categories.</p>
                  <button className="reset-btn" onClick={() => { setActiveFilter('all'); setSearchTerm(''); }}>
                    Show All News
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurNews;
