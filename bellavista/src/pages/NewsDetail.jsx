import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchNewsItemById, fetchNewsItems } from '../services/newsService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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

  const isYouTube = (url) => {
    if (!url) return false;
    return /youtube\.com|youtu\.be/i.test(url);
  };
  
  const toYouTubeEmbed = (url) => {
    if (!url) return '';
    
    // Handle different YouTube URL formats
    let videoId = '';
    
    // Standard youtube.com/watch?v= format
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }
    
    // Handle youtu.be/ format
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }
    
    // Handle embed format
    const embedMatch = url.match(/embed\/([^?]+)/);
    if (embedMatch) {
      videoId = embedMatch[1];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
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

              {/* Gallery Section */}
              {(Array.isArray(news.gallery) && news.gallery.length > 0) && (
                <div className="gallery-section">
                  <h3 className="gallery-title">Gallery</h3>
                  {news.gallery.length === 1 ? (
                    // Single image - no swiper needed
                    <div className="gallery-single">
                      <img 
                        src={news.gallery[0]} 
                        alt="Gallery image" 
                        className="gallery-single-image"
                      />
                    </div>
                  ) : (
                    // Multiple images - use swiper with auto-scroll
                    <Swiper
                      className="gallery-swiper"
                      modules={[Autoplay, Navigation, Pagination]}
                      autoplay={{ delay: 3000 }}
                      navigation
                      pagination={{ clickable: true }}
                    >
                      {news.gallery.filter(Boolean).map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img src={img} alt={`Gallery ${idx+1}`} className="gallery-slide-image"/>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              )}

              {/* Video Section */}
              {news.videoUrl && (
                <div className="video-section">
                  <h3 className="video-title">Video</h3>
                  {isYouTube(news.videoUrl) ? (
                    <div className="video-container">
                      <iframe
                        src={toYouTubeEmbed(news.videoUrl)}
                        title="Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="video-container">
                      <video controls>
                        <source src={news.videoUrl} />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                  {news.videoDescription && (
                    <div className="video-description">
                      {news.videoDescription}
                    </div>
                  )}
                </div>
              )}

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
