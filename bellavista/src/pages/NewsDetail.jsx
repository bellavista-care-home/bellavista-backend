import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchNewsItemById, fetchNewsItems } from '../services/newsService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import '../styles/MainPage.css';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const item = await fetchNewsItemById(id);
      setNews(item);
      
      // Load all news for related items
      const allNews = await fetchNewsItems();
      if (item) {
        const related = allNews
          .filter(n => n.category === item.category && n.id !== item.id)
          .slice(0, 3);
        setRelatedNews(related);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
     return <div className="news-page"><div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>Loading...</div></div>;
  }

  if (!news) {
    return (
      <div className="news-page">
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>News Article Not Found</h2>
          <p>The article you're looking for doesn't exist.</p>
          <Link to="/news" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const description = news.fullDescription || news.excerpt;
  const truncatedText = description.length > 500 ? description.substring(0, 500) + '...' : description;
  const displayText = expanded ? description : truncatedText;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const isYouTube = (url) => /youtube\.com|youtu\.be/.test(url || '');
  const toYouTubeEmbed = (url) => {
    if (!url) return '';
    const match = url.match(/(?:v=|\/)([A-Za-z0-9_-]{11})/);
    const id = match ? match[1] : '';
    return id ? `https://www.youtube.com/embed/${id}` : url;
  };

  return (
    <div className="news-page">
      {/* Hero Section */}
      <section className="news-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">{news.title}</h1>
              <p className="hero-subtitle">Published on {news.date} • {news.category.charAt(0).toUpperCase() + news.category.slice(1)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="news-detail">
        <div className="container">
          <div className="news-detail-layout">
            {/* Main Article */}
            <article className="news-detail-article">
              <div className="article-header">
                <div className="article-meta">
                  <span className="meta-item">
                    <i className="fas fa-calendar"></i> {news.date}
                  </span>
                  <span className="meta-item">
                    <i className="fas fa-map-marker-alt"></i> {news.location}
                  </span>
                  <span className="meta-item">
                    <i className="fas fa-user"></i> {news.author}
                  </span>
                </div>
                <div className="article-category">
                  <span className={`category-tag ${news.category}`}>
                    {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
                  </span>
                </div>
              </div>

              <div className="article-image-large">
                {news.image ? (
                  <img src={news.image} alt={news.title} />
                ) : null}
                {news.badge && <div className="article-badge-large">{news.badge}</div>}
              </div>
              {(Array.isArray(news.gallery) && news.gallery.length > 0) && (
                <div style={{marginTop:'20px'}}>
                  <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    autoplay={{ delay: 3000 }}
                    navigation
                    pagination={{ clickable: true }}
                    style={{width:'100%', borderRadius:'10px'}}
                  >
                    {news.gallery.filter(Boolean).map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <img src={img} alt={`Gallery ${idx+1}`} style={{width:'100%', display:'block'}} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
              {news.videoUrl && (
                <div style={{marginTop:'20px'}}>
                  {isYouTube(news.videoUrl) ? (
                    <div style={{position:'relative', paddingBottom:'56.25%', height:0}}>
                      <iframe
                        src={toYouTubeEmbed(news.videoUrl)}
                        title="Video"
                        style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', border:0}}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video controls style={{width:'100%', borderRadius:'10px'}}>
                      <source src={news.videoUrl} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              <div className="article-content">
                <div className="article-description">
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {displayText}
                  </div>
                  {!expanded && description.length > 500 && (
                    <button 
                      className="read-more-btn" 
                      onClick={() => setExpanded(true)}
                      style={{ marginTop: '15px' }}
                    >
                      Read More <i className="fas fa-chevron-down"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="article-navigation">
                <Link to="/news" className="btn btn-primary">
                  <i className="fas fa-arrow-left"></i> Back to News
                </Link>
                <button className="btn btn-primary share-btn" onClick={handleShare}>
                  <i className="fas fa-share"></i> Share Article
                </button>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="news-detail-sidebar">

              <div className="sidebar-widget">
                <h3 className="widget-title">Related Articles</h3>
                <div className="related-articles">
                  {relatedNews
                    .slice(0, 3)
                    .map(related => (
                      <Link key={related.id} to={`/news/${related.id}`} className="related-article">
                        <img src={related.image} alt={related.title} />
                        <div className="related-content">
                          <h4>{related.title}</h4>
                          <span>{related.date}</span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDetail;
