import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/CareHome.css';
import ReviewForm from '../components/ReviewForm';
import { fetchNewsItems } from '../services/newsService';

const BellavistaBarry = () => {
  const navigate = useNavigate();
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [barryNews, setBarryNews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const allNews = await fetchNewsItems();
      const filtered = allNews.filter(news => 
        news.location.toLowerCase().includes('barry') || 
        news.location === 'All Locations'
      );
      setBarryNews(filtered);
    };
    loadNews();
  }, []);

  const activitiesGalleryImages = [
    "Bingo-Activity-150x150.jpg",
    "IMG-20180716-WA0005-150x150.jpg",
    "IMG-20180716-WA0013-150x150.jpg",
    "IMG-20180716-WA0016-150x150.jpg",
    "IMG-20180716-WA0017-150x150.jpg",
    "IMG-20180809-WA0001-150x150.jpg",
    "IMG-20180809-WA0006-150x150.jpg",
    "IMG-20180809-WA0011-1-150x150.jpg",
    "IMG-20180809-WA0016-150x150.jpg",
    "IMG-20180809-WA0017-150x150.jpg",
    "IMG-20180809-WA0019-150x150.jpg",
    "IMG_8298-150x150.jpg",
    "IMG_8332-150x150.jpg",
    "IMG_8340-150x150.jpg"
  ];

  const facilitiesGalleryImages = [
    "98000815_933014320502979_5416674318329315328_n-150x150.jpg",
    "98005368_933014173836327_3282387137734901760_n-150x150.jpg",
    "98185714_933014203836324_2891158467958013952_n-150x150.jpg",
    "98204419_933014370502974_7682212452494213120_n-150x150.jpg",
    "98316881_933014347169643_7230616531313360896_n-150x150.jpg",
    "Copy-of-lounge-150x150.jpg",
    "IMG9-150x150.jpg",
    "IMG_0344-150x150.jpg",
    "IMG_0357-150x150.jpg",
    "IMG_4114-150x150.jpg",
    "IMG_4115-150x150.jpg",
    "IMG_4121-Copy-150x150.jpg",
    "IMG_4137-150x150.jpg",
    "IMG_4187-150x150.jpg",
    "IMG_4199-150x150.jpg",
    "IMG_4241-150x150.jpg",
    "IMG_4280-150x150.jpg",
    "IMG_4282-150x150.jpg",
    "IMG_4301R-150x150.jpg",
    "IMG_4325-150x150.jpg",
    "IMG_4363-150x150.jpg",
    "IMG_4379-150x150.jpg",
    "IMG_4385-150x150.jpg",
    "IMG_4414-150x150.jpg",
    "IMG_4441-150x150.jpg",
    "IMG_4446-150x150.jpg",
    "IMG_4455-150x150.jpg",
    "IMG_4473-150x150.jpg",
    "IMG_4528-150x150.jpg",
    "IMG_4587-150x150.jpg",
    "IMG_4600-150x150.jpg",
    "IMG_4610-150x150.jpg",
    "IMG_8313-150x150.jpg"
  ];

  const teamGalleryImages = [
    "Barry-Teamn-150x150.png",
    "IMG-20180816-WA0019-150x150.jpg",
    "IMG_0324-150x150.jpg",
    "IMG_0367-Copy-150x150.jpg",
    "IMG_0400-150x150.jpg",
    "IMG_0586-150x150.jpg",
    "IMG_46181-547x364-150x150.jpg",
    "IMG_8885-150x150.jpg",
    "b2-150x150.jpg"
  ];


  const activitiesList = [
    "Flower arranging",
    "Arts and Crafts",
    "Bingo",
    "Meals Out",
    "Sensory therapy",
    "Playing Cards",
    "Sing a long/ Karaoke",
    "Board Games",
    "Painting Competition",
    "Trips out",
    "Baking & cooking",
    "Massage",
    "Gardening",
    "Sewing",
    "Singers and Musicians Performing",
    "Local School’s Visiting",
    "Church Service",
    "Armchair Exercises",
    "Garden Activities",
    "Newspaper Reading",
    "Seasonal Activities",
    "Film Days",
    "1-2-1 Reminiscing"
  ];

  const facilitiesList = [
    { icon: "fas fa-bed", title: "26 Bedrooms" },
    { icon: "fas fa-wheelchair", title: "Dementia Care" },
    { icon: "fas fa-utensils", title: "Dementia Dining" },
    { icon: "fas fa-wifi", title: "Free Wifi" },
    { icon: "fas fa-tree", title: "Sensory Garden" },
    { icon: "fas fa-car", title: "On-site Parking" },
    { icon: "fas fa-user-nurse", title: "24/7 Nursing" },
    { icon: "fas fa-elevator", title: "Lift Access" }
  ];

  // Swiper settings
  const sliderSettings = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: true,
    pagination: { 
      clickable: true,
      dynamicBullets: true, // Reduces the number of visible dots
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    }
  };

  return (
    <div className="location-page theme-barry">
      {/* 1. HERO SECTION */}
      <div className="loc-hero">
        <div className="loc-hero__content">
          <h1 className="loc-hero__title">Welcome to Bellavista Barry</h1>
          <p className="loc-hero__subtitle">
            A long-established quality nursing home situated in the seaside of Barry with spectacular views over the Bristol channel.
          </p>
          
          <button className="loc-hero__btn" onClick={() => setHeroExpanded(!heroExpanded)}>
            {heroExpanded ? 'See Less' : 'See More'}
          </button>

          {/* Expanded Content */}
          <div className={`loc-hero__expanded ${heroExpanded ? 'loc-hero__expanded--open' : ''}`}>
            <div className="loc-hero__expanded-card">
              <p>
                Bellavista Barry is a long-established quality nursing home situated in the seaside of Barry with spectacular views over the Bristol channel and has been running since 2007 to enable elderly people to continue living as independently as possible by receiving care and support consistent with their needs.
              </p>
              <p>
                Bellavista Barry is a 39-bedded registered care home providing accommodation and nursing care for older people. Our main aim is to provide a continuum of care, which takes account of increasing needs and frailty. The privacy, dignity, independence, rights and choices of our clients are central throughout their stay in Bellavista. Individual care needs are carefully identified and a personalised care program created. We aim to nurture the social care needs of our clients and maintain the strong links with the local community. Above all, we work to ensure that the home has a relaxed and happy environment.
              </p>
              <p>
                We offer professional social care and nursing services for the elderly. The home is registered to provide high level of  dementia nursing , Dementia Residential,General Nursing,  Respite ,CHC Nursing and End of Life care . We offer you and your loved ones the perfect mix of peace and tranquillity, privacy and companionship, all within a safe, secure and High-Quality Nursing caring environment. All staff within are appropriately qualified to deliver good standards of care. A continuous staff-training programme has been to ensure that standards are maintained in line with the legislation and regulations and with the requirements of the Care Inspectorate for Wales (CIW).
              </p>
              <p>
                All residents are assured that they will be treated with respect and dignity according to their individual needs and wishes. Our cheerful and highly qualified staff are on hand 24-hours a day to enable the very best quality of life for our residents.We have a dedicated activity team who tailored person centred activity to our residents. We trying to improve our quality of care  and support our staff through various training and development programs .
              </p>
              <p>
                We are delighted to announce the opening of our brand new dining area in our Barry Bellavista ,which indeed reflects in each and every corner of the room to create a Dementia Friendly Dining Experience in a warm and welcoming environment for our beloved and well-deserved Residents. We are very proud of our new dining facilities and staff here at Bellavista Nursing Home Barry 
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row (Floating) */}
        <div className="loc-stats">
          <div className="loc-stats__item">
            <i className="fas fa-bed"></i>
            <span>26 Bedrooms</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Bellavista+Nursing+Home+Barry', '_blank')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-map-marker-alt"></i>
            <span style={{ textDecoration: 'underline', color: '#0066cc' }}>Barry Seaside</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => navigate('/our-care')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-star"></i>
            <span style={{ textDecoration: 'underline', color: '#0066cc' }}>Quality Care</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-users"></i>
            <span style={{ textDecoration: 'underline', color: '#0066cc' }}>Expert Team</span>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITIES SECTION */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Life at Bellavista</span>
                <h2 className="section-header__title">Activities Barry</h2>
              </div>
              <p className="loc-text">
                At Bellavista Nursing Home Barry, we believe encouraging our clients to be as active as possible is a key part of maintaining good physical and mental well being. We have a dedicated in house Activities coordinator who arranges varied activity program for all of our residents. We as an organisation, encourage residents to take part in stimulating activities and events in their day to day life. The activities are stimulating, fun and promote socialisation amongst those in our care.
              </p>
              <button className="btn btn--outline" onClick={() => setShowActivitiesModal(true)}>
                See More Activities
              </button>
            </div>
            <div className="loc-grid__media">
              <div className="loc-slider">
                <Swiper {...sliderSettings} className="custom-swiper">
                  {activitiesGalleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="loc-slider__item">
                        <img src={`/BarryActivitiesGallery/${img}`} alt={`Activity ${index + 1}`} loading="lazy" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Modal */}
      {showActivitiesModal && (
        <div className="modal-overlay" onClick={() => setShowActivitiesModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowActivitiesModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            <h2 className="modal-title">Activities at Bellavista Barry</h2>
            <div className="modal-body">
              <p>
                At Bellavista Nursing Home Barry, we believe encouraging our clients to be as active as possible is a key part of maintaining good physical and mental well being. We have a dedicated in house Activities coordinator who arranges varied activity program for all of our residents. We as an organisation, encourage residents to take part in stimulating activities and events in their day to day life. The activities are stimulating, fun and promote socialisation amongst those in our care.
              </p>
              
              <p>
                Bellavista Nursing Home Barry has inhouse musical performances from artists of varied genres as well as theatre productions and choice performances. We host coffee morning which we welcome families to join with us to share their views on life at Bellavista Barry. If the weather allows, we take maximum advantage of our lovely outdoor patio areas and adjoining gardens. We also encourage strong links with the local communities providing the occasional entertainment services such as sing-alongs and performances engaging with the nostalgia that residents enjoy reminiscing over.
              </p>
              <p>
                We look at each of the residents who are participating to see whether there are any adjustments we need to make to help them get the most out of today’s sessions. Although we want to encourage our residents to push themselves, it’s essential that they don’t feel uncomfortable at any time. The dignity of our residents and our respect for them is at the centre of everything we do at our homes and especially in the activities department. We often review and assess the activities designed by the coordinator whilst also providing on-going training and development.
              </p>
              <h3>Activities we offer at Bellavista Barry Nursing Home:</h3>
              <ul className="activities-list">
                {activitiesList.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. FACILITIES SECTION */}
      <section className="loc-section loc-section--light">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__media">
              <div className="loc-slider">
                <Swiper {...sliderSettings} className="custom-swiper">
                  {facilitiesGalleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="loc-slider__item">
                        <img src={`/BarryFacilitiesGalley/${img}`} alt={`Facility ${index + 1}`} loading="lazy" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Comfort & Care</span>
                <h2 className="section-header__title">Facilities & Services</h2>
              </div>
              <div className="facilities-content">
                <p className="loc-text">
                  Bellavista Barry is a 26-bedded registered care home providing accommodation and nursing care for older people. Our main aim is to provide a continuum of care, which takes account of increasing needs and frailty.
                </p>
                
                <div className={`facilities-content__more ${facilitiesExpanded ? 'facilities-content__more--expanded' : ''}`}>
                  <p className="loc-text">
                    All bedrooms are connected to a nurse call system. All bedrooms have privacy locks on doors and a lockable facility to secure valuables and personal items. All room sizes meet or exceed the national minimum standard.
                  </p>
                  <p className="loc-text">
                    We attach high importance to our residents meals and our cooks spend time with them to learn their tastes and preferences and in deciding how best to present their meals. We have varied menus to accommodate everyone’s taste and need. We take care to help people when they need it and to do so sensitively. We encourage relatives to join us for meals.
                  </p>
                  <p className="loc-text">
                    We are delighted to announce the opening of our brand new dining area in our Barry Bellavista, which indeed reflects in each and every corner of the room to create a Dementia Friendly Dining Experience in a warm and welcoming environment for our beloved and well-deserved Residents. We are very proud of our new dining facilities and staff here at Bellavista Nursing Home Barry.
                  </p>
                </div>

                <button 
                  className="btn btn--outline" 
                  onClick={() => setFacilitiesExpanded(!facilitiesExpanded)}
                  style={{ marginTop: '20px' }}
                >
                  {facilitiesExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Facilities Cards */}
          <div className="facilities-grid">
            {facilitiesList.map((item, index) => (
              <div className="facility-card" key={index}>
                <div className="facility-card__icon">
                  <i className={item.icon}></i>
                </div>
                <h4 className="facility-card__title">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TEAM & CARE */}
      {(teamMembers.length > 0 || teamGalleryImages.length > 0) && (
        <section className="loc-section loc-section--white" id="team-section">
          <div className="container">
            <div className="loc-grid">
              <div className="loc-grid__content">
                <div className="section-header">
                  <span className="section-header__subtitle">Dedicated Staff</span>
                  <h2 className="section-header__title">Meet Our Team</h2>
                </div>
                <p className="loc-text">
                  Our cheerful and highly qualified staff are on hand 24-hours a day to enable the very best quality of life for our residents. We have a dedicated activity team who tailored person centred activity to our residents.
                </p>
              </div>
              <div className="loc-grid__media">
                <div className="loc-slider">
                  <Swiper {...sliderSettings} className="custom-swiper">
                    {teamGalleryImages.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="loc-slider__item">
                          <img src={`/BarryTeam/${img}`} alt={`Team Member ${index + 1}`} loading="lazy" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>

            {/* Key Staff Members Scrollable List */}
            {teamMembers.length > 0 && (
              <div className="team-scroll-container" style={{ marginTop: '64px' }}>
                <h3 style={{ 
                  marginBottom: '32px', 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '2rem', 
                  color: 'var(--color-primary)',
                  textAlign: 'center'
                }}>
                  Key Staff Members
                </h3>
                <div className="team-horizontal-list" style={{ 
                  display: 'flex', 
                  overflowX: 'auto', 
                  gap: '24px', 
                  padding: '10px 4px 30px 4px', 
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'thin'
                }}>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="team-member-card" style={{ 
                      minWidth: '260px', 
                      scrollSnapAlign: 'start', 
                      background: 'var(--color-bg-light)', 
                      padding: '32px 24px', 
                      borderRadius: '16px', 
                      textAlign: 'center',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'transform 0.2s'
                    }}>
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        color: 'var(--color-primary)',
                        fontSize: '2.5rem',
                        overflow: 'hidden'
                      }}>
                        {member.image ? (
                          <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </div>
                      <h4 style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '8px', 
                        color: 'var(--color-text-dark)',
                        fontFamily: 'var(--font-heading)'
                      }}>
                        {member.name}
                      </h4>
                      <span style={{ 
                        color: 'var(--color-accent)', 
                        fontWeight: '600', 
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. NEWS SECTION */}
      {barryNews.length > 0 && (
        <section className="loc-section loc-section--light">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News from Barry</h2>
            </div>
            <div className="news-grid modern">
              {barryNews.map((news) => (
                <div key={news.id} className="news-card modern">
                  <div className="news-card__image">
                    {news.image ? (
                      <img src={news.image} alt={news.title} />
                    ) : (
                      <div className="news-placeholder-image"><i className="fas fa-newspaper"></i></div>
                    )}
                  </div>
                  <div className="news-card__content">
                    <h4 className="news-card__title">{news.title}</h4>
                    <Link to={`/news/${news.id}`} className="news-card__link">Read More</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. CONTACT & INFO GRID */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="section-header section-header--center">
            <span className="section-header__subtitle">Get in Touch</span>
            <h2 className="section-header__title">Contact & Information</h2>
          </div>

          <div className="bottom-grid">
            {/* Card 1: Contact Us */}
            <div className="bottom-card">
              <div className="bottom-card__header">
                <h3 className="bottom-card__title">Contact Us</h3>
              </div>
              <div className="bottom-card__content">
                <div className="contact-mini-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>106-108 Tynewydd Road,<br/>Barry, CF62 8BB</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:01446743893">01446 743893</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:admin@bellavistanursinghome.com">admin@bellavistanursinghome.com</a>
                </div>
                <button className="btn btn--primary" style={{width: '100%', marginTop: '24px'}} onClick={() => window.location.href='/schedule-tour'}>
                  Book a Visit
                </button>
              </div>
            </div>

            {/* Card 2: Quick Facts */}
            <div className="bottom-card">
              <div className="bottom-card__header">
                <h3 className="bottom-card__title">Quick Facts</h3>
              </div>
              <div className="bottom-card__content">
                <div className="fact-row">
                  <span className="fact-label">Registered Beds:</span>
                  <span className="fact-value">62</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Location:</span>
                  <span 
                    className="fact-value" 
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Bellavista+Nursing+Home+Barry', '_blank')}
                  >
                    Barry
                  </span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Our Care:</span>
                  <Link 
                    to="/our-care" 
                    className="fact-value" 
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Dementia Care
                  </Link>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Parking:</span>
                  <span className="fact-value">Available</span>
                </div>
              </div>
            </div>

            {/* Card 3: Reviews */}
            <div className="bottom-card">
              <div className="bottom-card__header">
                <h3 className="bottom-card__title">Reviews</h3>
              </div>
              <div className="bottom-card__content review-mini-form">
                <div style={{fontSize: '3rem', color: '#ffc107', marginBottom: '16px'}}>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="review-mini-text">
                  We value your feedback. Please let us know about your experience at Bellavista Barry.
                </p>
                <button className="btn btn--outline" style={{width: '100%'}} onClick={() => setShowReviewModal(true)}>
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowReviewModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            <h2 className="modal-title">Write a Review</h2>
            <ReviewForm locationName="Bellavista Barry" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BellavistaBarry;
