import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OurHomes from './OurHomes';
import { fetchNewsItems } from '../services/newsService';
import '../styles/MainPage.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('living');
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [newsList, setNewsList] = useState([]);
  
  const featuredNews = newsList.find(news => news.important) || newsList[0] || {};

  const slides = [
    '/images/hero-care-staff.jpg',
    '/images/hero-family-visit.jpg',
    '/images/hero-resident-selfie.jpg',
    '/images/hero-wheelchair-assistance.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    const loadNews = async () => {
      const items = await fetchNewsItems();
      setNewsList(items);
    };
    loadNews();

    return () => clearInterval(interval);
  }, [slides.length]);

  const filterNews = (filter) => {
    setActiveFilter(filter);
    const newsCards = document.querySelectorAll('.news-card[data-category]');

    newsCards.forEach(card => {
      if (filter === 'all') {
        if (card.classList.contains('news-visible')) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      } else if (card.dataset.category === filter) {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.5s ease';
      } else {
        card.style.display = 'none';
      }
    });
  };


  const openModal = (serviceType) => {
    const serviceDetails = {
      comfort: {
        title: 'Home Comfort - A Warm, Welcoming Environment',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-home"></i> Creating a Home-Like Atmosphere</h4>
            <p>At Bellavista, we believe that comfort begins with creating an environment that truly feels like home.</p>
            <h4><i class="fas fa-couch"></i> Comfortable Living Spaces</h4>
            <ul>
              <li>Beautifully furnished communal lounges with comfortable seating</li>
              <li>Private en-suite bedrooms with personal touches encouraged</li>
              <li>Quiet reading areas and peaceful garden spaces</li>
              <li>Family-friendly visiting areas for quality time together</li>
            </ul>
          </div>
        `
      },
      safety: {
        title: 'Safety First - Advanced Protection & Emergency Response',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-shield-alt"></i> Comprehensive Safety Systems</h4>
            <p>The safety and security of our residents is our top priority.</p>
            <h4><i class="fas fa-bell"></i> Emergency Response</h4>
            <ul>
              <li>24/7 nurse call systems in every room</li>
              <li>Trained emergency response team on-site at all times</li>
              <li>Direct links to local emergency services</li>
              <li>Regular emergency drills and staff training</li>
            </ul>
          </div>
        `
      },
      community: {
        title: 'Community - Vibrant Social Life & Meaningful Connections',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-users"></i> Building Lasting Friendships</h4>
            <p>We foster a vibrant community where residents can form meaningful friendships.</p>
            <h4><i class="fas fa-calendar-alt"></i> Daily Activities & Events</h4>
            <ul>
              <li>Group exercise classes and gentle fitness programs</li>
              <li>Arts and crafts workshops with seasonal themes</li>
              <li>Music therapy sessions and sing-alongs</li>
              <li>Games nights, bingo, and quiz competitions</li>
            </ul>
          </div>
        `
      },
      wellness: {
        title: 'Wellness Focus - Holistic Health & Wellbeing',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-leaf"></i> Holistic Approach to Wellbeing</h4>
            <p>We believe in caring for the whole person - mind, body, and spirit.</p>
            <h4><i class="fas fa-dumbbell"></i> Physical Wellness</h4>
            <ul>
              <li>Physiotherapy and occupational therapy services</li>
              <li>Chair exercises and gentle movement programs</li>
              <li>Accessible garden areas for outdoor activities</li>
              <li>Nutritious, balanced meals tailored to dietary needs</li>
            </ul>
          </div>
        `
      },
      physical: {
        title: 'Physical Wellness - Movement & Vitality',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-running"></i> Active Living for All Abilities</h4>
            <p>Our dedicated activities team ensures every resident can participate in meaningful physical activity tailored to their capabilities.</p>
            <h4><i class="fas fa-heartbeat"></i> Activities Include:</h4>
            <ul>
              <li><strong>Wheelchair Zumba:</strong> Fun, rhythmic movement sessions accessible to everyone.</li>
              <li><strong>Armchair Exercises:</strong> Gentle fitness to maintain mobility and strength.</li>
              <li><strong>Garden Activities:</strong> Enjoying our accessible outdoor spaces and gardening clubs.</li>
              <li><strong>Physiotherapy Support:</strong> Personalized programs to aid recovery and mobility.</li>
            </ul>
          </div>
        `
      },
      creative: {
        title: 'Creative Arts - Expression & Joy',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-palette"></i> Unleashing Creativity</h4>
            <p>We encourage self-expression through various artistic mediums, providing a sense of accomplishment and joy.</p>
            <h4><i class="fas fa-paint-brush"></i> Creative Workshops:</h4>
            <ul>
              <li><strong>Arts & Crafts:</strong> Painting, pottery, and seasonal decoration making.</li>
              <li><strong>Textile Arts:</strong> Knitting, sewing, and embroidery groups.</li>
              <li><strong>Themed Projects:</strong> Creating calendars, cards, and decorations for holidays.</li>
              <li><strong>Flower Arranging:</strong> Engaging with nature's beauty indoors.</li>
            </ul>
          </div>
        `
      },
      social: {
        title: 'Social & Games - Fun & Friendship',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-users"></i> Building Community Connections</h4>
            <p>Social interaction is at the heart of Bellavista, with a vibrant calendar of events to foster friendships.</p>
            <h4><i class="fas fa-glass-cheers"></i> Social Highlights:</h4>
            <ul>
              <li><strong>Games & Entertainment:</strong> Bingo, quizzes, board games, and playing cards.</li>
              <li><strong>Music & Parties:</strong> Sing-alongs, karaoke, and fancy dress parties.</li>
              <li><strong>Community Outings:</strong> Trips to Cardiff Bay, Millennium Centre, and local cafes.</li>
              <li><strong>Intergenerational Events:</strong> Visits from local schools and community groups.</li>
            </ul>
          </div>
        `
      },
      therapeutic: {
        title: 'Therapeutic Care - Sensory & Soul',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-spa"></i> Specialized Therapeutic Support</h4>
            <p>Our therapeutic activities are designed to stimulate the senses, evoke memories, and provide comfort, especially for residents with dementia.</p>
            <h4><i class="fas fa-brain"></i> Therapeutic Programs:</h4>
            <ul>
              <li><strong>Animal Therapy:</strong> Visits from pets and exotic animals (Zoolab) for sensory stimulation.</li>
              <li><strong>Cinema Experience:</strong> Film days in our cinema room with popcorn and ice cream.</li>
              <li><strong>Reminiscing:</strong> 1-to-1 sessions and "memory lane" activities to connect with the past.</li>
              <li><strong>Sensory Activities:</strong> Themed areas like our "Beach" or "Victorian" corners for visual and tactile engagement.</li>
            </ul>
          </div>
        `
      }
    };

    const service = serviceDetails[serviceType];
    setModalContent(service);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };



  return (
    <div className="home">
      <section className="hero">
        <div className="hero-slideshow">
          {slides.map((slide, index) => (
            <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
              <img src={slide} alt={`Bellavista ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="container hero-content">
          <h1>Bellavista Care Homes</h1>
          <p className="hero-tagline">A Home From Home</p>
          <p className="hero-description">Premium residential & nursing care across South Wales. Experience personalized attention in our modern, home-like environments designed for dignity, comfort & wellbeing.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/schedule-tour">
              <i className="fas fa-calendar-check"></i> Book a Tour
            </Link>
            <Link className="btn btn-outline" to="/enquiry">
              <i className="fas fa-heart"></i> Care Enquiry
            </Link>
          </div>
        </div>
        <div className="container">
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">25+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Premium Locations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Professional Care</span>
            </div>
          </div>
        </div>

      </section>
      <OurHomes isStandalone={false} />
      <section className="news" id="news">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest News & Updates</h2>
            <p className="section-subtitle">Stay connected with our community through the latest developments, events & care innovations.</p>
          </div>
          <div className="news-showcase">
            <div className="news-featured">
              <div className="news-image-large">
                {featuredNews.image ? (
                  <img src={featuredNews.image} alt={featuredNews.title}/>
                ) : (
                  <div className="featured-placeholder-image"><i className="fas fa-newspaper"></i></div>
                )}
                {featuredNews.badge && <div className="news-badge-large">{featuredNews.badge}</div>}
              </div>
              <div className="news-info-large">
                <div className="news-meta">
                  <span className="news-category featured">Health & Safety</span>
                  <span className="news-date-large">{featuredNews.date}</span>
                </div>
                <h3>{featuredNews.title}</h3>
                <p>{featuredNews.excerpt}</p>
                <Link to={`/news/${featuredNews.id}`} className="btn btn-primary">Read Full Update</Link>
              </div>
            </div>
          </div>
          <div className="news-filters">
            <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => filterNews('all')}>All News</button>
            <button className={`filter-btn ${activeFilter === 'health' ? 'active' : ''}`} onClick={() => filterNews('health')}>Health Updates</button>
            <button className={`filter-btn ${activeFilter === 'awards' ? 'active' : ''}`} onClick={() => filterNews('awards')}>Awards</button>
            <button className={`filter-btn ${activeFilter === 'events' ? 'active' : ''}`} onClick={() => filterNews('events')}>Events</button>
            <button className={`filter-btn ${activeFilter === 'innovation' ? 'active' : ''}`} onClick={() => filterNews('innovation')}>Innovation</button>
            <button className={`filter-btn ${activeFilter === 'community' ? 'active' : ''}`} onClick={() => filterNews('community')}>Community</button>
          </div>
          <div className="news-grid modern">
            {newsList.map((news, index) => (
              <div key={index} className="news-card modern news-visible" data-category={news.category}>
                <div className="news-image">
                  {news.image ? (
                    <img alt={news.title} src={news.image}/>
                  ) : (
                    <div className="news-placeholder-image-small"><i className="fas fa-newspaper"></i></div>
                  )}
                  {news.badge && <div className="news-badge">{news.badge}</div>}
                </div>
                <div className="news-content">
                  <div className={`news-category ${news.category}`}>{news.category.charAt(0).toUpperCase() + news.category.slice(1)}</div>
                  <h4>{news.title}</h4>
                  <p>{news.excerpt}</p>
                  <div className="news-engagement">
                    <span><i className="fas fa-calendar"></i> {news.date}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {news.location}</span>
                  </div>
                  <Link to={`/news/${news.id}`} className="news-link modern">Read More</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="news-cta">
            <Link to="/news" className="btn btn-outline-large">
              <i className="fas fa-newspaper"></i> View All News
            </Link>
          </div>
        </div>
      </section>

      <section className="activities" id="activities">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Enriching Activities & Wellness</h2>
            <p className="section-subtitle">Engaging programs designed to promote physical, mental & social wellbeing for all residents.</p>
          </div>
          <div className="activities-showcase">
            <div className="activity-featured">
              <div className="activity-image">
                <img src="/images/music-therapy.jpeg" alt="Music Therapy"/>
                <div className="activity-play-btn">
                  <i className="fas fa-play"></i>
                </div>
              </div>
              <div className="activity-info">
                <div className="activity-badge">🎵 Popular</div>
                <h3>Music & Arts Therapy</h3>
                <p>Professional music therapy sessions, art classes, and creative workshops that stimulate memory and promote emotional wellbeing.</p>
                <div className="activity-schedule">
                  <span><i className="fas fa-calendar"></i> Daily Sessions</span>
                  <span><i className="fas fa-users"></i> All Abilities</span>
                  <span><i className="fas fa-clock"></i> 45 mins</span>
                </div>
              </div>
            </div>
          </div>
          <div className="activity-grid">
            <div className="activity-card" onClick={() => openModal('physical')}>
              <div className="activity-icon physical">
                <i className="fas fa-dumbbell" style={{fontSize: '30px'}}></i>
              </div>
              <h4>Physical Wellness</h4>
              <p>Chair exercises, physiotherapy, gentle yoga</p>
            </div>
            <div className="activity-card" onClick={() => openModal('creative')}>
              <div className="activity-icon creative">
                <i className="fas fa-brush" style={{fontSize: '30px'}}></i>
              </div>
              <h4>Creative Arts</h4>
              <p>Painting, crafts, pottery, creative writing</p>
            </div>
            <div className="activity-card" onClick={() => openModal('social')}>
              <div className="activity-icon social">
                <i className="fas fa-gamepad" style={{fontSize: '30px'}}></i>
              </div>
              <h4>Social & Games</h4>
              <p>Bingo, quiz nights, social hours, outings</p>
            </div>
            <div className="activity-card" onClick={() => openModal('therapeutic')}>
              <div className="activity-icon therapeutic">
                <i className="fas fa-spa" style={{fontSize: '30px'}}></i>
              </div>
              <h4>Therapeutic Care</h4>
              <p>Pet therapy, aromatherapy, meditation</p>
            </div>
          </div>
          <div className="activities-cta">
            <Link to="/activities" className="btn btn-primary">
              <i className="fas fa-calendar-alt"></i> View All Activities
            </Link>
          </div>
        </div>
      </section>

      <section className="care-promise" id="care-promise">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Our Care Promise</h2>
            <p className="section-subtitle">Committed to excellence in every aspect of care, comfort & community.</p>
          </div>
          <div className="promise-showcase">
            <div className="promise-main">
              <div className="promise-image">
                <img src="/images/careplans.jpeg" alt="Compassionate Care"/>
                <div className="promise-badge">💝 Our Commitment</div>
              </div>
              <div className="promise-details">
                <h3>Personalized Care Plans</h3>
                <p>Every resident receives an individually tailored care plan developed by our multidisciplinary team, ensuring their unique needs, preferences, and dignity are always respected.</p>
                <div className="promise-features">
                  <div className="feature-item">
                    <i className="fas fa-user-md"></i>
                    <span>Qualified Nursing Staff</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-clock"></i>
                    <span>24/7 Care Available</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-heart"></i>
                    <span>Family-Centered Approach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="promise-scroll-container">
            <div className="promise-grid">
              <div className="promise-card" onClick={() => openModal('comfort')}>
                <div className="promise-icon comfort"><i className="fas fa-home"></i></div>
                <h4>Home Comfort</h4>
                <p>A Warm, Welcoming Environment</p>
              </div>
              <div className="promise-card" onClick={() => openModal('safety')}>
                <div className="promise-icon safety"><i className="fas fa-shield-alt"></i></div>
                <h4>Safety First</h4>
                <p>Advanced Protection & Emergency Response</p>
              </div>
              <div className="promise-card" onClick={() => openModal('community')}>
                <div className="promise-icon community"><i className="fas fa-users"></i></div>
                <h4>Community</h4>
                <p>Vibrant Social Life & Connections</p>
              </div>
              <div className="promise-card" onClick={() => openModal('wellness')}>
                <div className="promise-icon wellness"><i className="fas fa-leaf"></i></div>
                <h4>Wellness Focus</h4>
                <p>Holistic Health & Wellbeing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="facilities" id="facilities">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Modern Facilities & Amenities</h2>
            <p className="section-subtitle">State-of-the-art facilities designed for comfort, safety & enriching experiences.</p>
          </div>
          <div className="facilities-showcase">
            <div className="facility-tabs">
              <button className={`tab-btn ${activeTab === 'living' ? 'active' : ''}`} onClick={() => setActiveTab('living')}>Living Spaces</button>
              <button className={`tab-btn ${activeTab === 'wellness' ? 'active' : ''}`} onClick={() => setActiveTab('wellness')}>Wellness & Care</button>
              <button className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>Activities & Social</button>
              <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services</button>
            </div>
            <div className={`tab-content ${activeTab === 'living' ? 'active' : ''}`}>
              <div className="facilities-grid compact">
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Private Rooms" src="/images/private-room.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-bed"></i> Private Rooms</h4>
                    <p>Comfortable en-suite rooms with personal touches</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Communal Lounges" src="/images/lounge-area.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-couch"></i> Communal Lounges</h4>
                    <p>Spacious social areas for relaxation & activities</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Gardens" src="/images/garden-facility.jpeg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-leaf"></i> Landscaped Gardens</h4>
                    <p>Accessible outdoor spaces for fresh air & nature</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-content ${activeTab === 'wellness' ? 'active' : ''}`}>
              <div className="facilities-grid compact">
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Medical Suite" src="/images/medical-suite.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-stethoscope"></i> Medical Suite</h4>
                    <p>On-site medical care & health monitoring</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Physiotherapy" src="/images/physiotherapy-room.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-dumbbell"></i> Therapy Rooms</h4>
                    <p>Physiotherapy & occupational therapy spaces</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Spa" src="/images/wellness-spa.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-spa"></i> Wellness Spa</h4>
                    <p>Hair salon, beauty treatments & relaxation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-content ${activeTab === 'activities' ? 'active' : ''}`}>
              <div className="facilities-grid compact">
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Cinema" src="/images/cinema-facility.jpeg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-film"></i> Cinema Room</h4>
                    <p>Movie nights & entertainment screenings</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Arts Studio" src="/images/arts-facility.jpeg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-palette"></i> Arts Studio</h4>
                    <p>Creative workshops & artistic expression</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Library" src="/images/library-facility.jpeg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-book"></i> Library Corner</h4>
                    <p>Quiet reading & reminiscence activities</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-content ${activeTab === 'services' ? 'active' : ''}`}>
              <div className="facilities-grid compact">
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Dining" src="/images/dining-room.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-utensils"></i> Restaurant Dining</h4>
                    <p>Nutritious meals in elegant dining rooms</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Laundry" src="/images/laundry-service.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-tshirt"></i> Laundry Service</h4>
                    <p>Professional cleaning & garment care</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Reception" src="/images/reception-facility.jpeg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-concierge-bell"></i> 24/7 Reception</h4>
                    <p>Round-the-clock support & assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && modalContent && (
        <div className="service-modal-overlay" onClick={closeModal}>
          <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="service-modal-close" onClick={closeModal}>&times;</button>
            <div className="service-modal-header">
              <h3>{modalContent.title}</h3>
            </div>
            <div className="service-modal-body" dangerouslySetInnerHTML={{ __html: modalContent.content }}>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;