import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/CareHome.css';
import ReviewForm from '../components/ReviewForm';
import { fetchNewsItems } from '../services/newsService';

const BellavistaBaltimore = () => {
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [baltimoreNews, setBaltimoreNews] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const allNews = await fetchNewsItems();
      const filtered = allNews.filter(news => 
        news.location.toLowerCase().includes('baltimore') || 
        news.location === 'All Locations'
      );
      setBaltimoreNews(filtered);
    };
    loadNews();
  }, []);

  // Using Barry's images as placeholders
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



  const facilitiesList = [
    { icon: "fas fa-bed", title: "Total 26 Rooms" },
    { icon: "fas fa-bath", title: "7 Ensuite Rooms" },
    { icon: "fas fa-wheelchair", title: "Wheelchair Access" },
    { icon: "fas fa-arrow-up", title: "Lift Available" },
    { icon: "fas fa-bus", title: "Transport Access" },
    { icon: "fas fa-couch", title: "Own Furniture" },
    { icon: "fas fa-paw", title: "Pet Friendly" },
    { icon: "fas fa-wifi", title: "Internet Access" }
  ];

  // Swiper settings
  const sliderSettings = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: true,
    pagination: { 
      clickable: true,
      dynamicBullets: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    }
  };

  return (
    <div className="location-page theme-baltimore">
      {/* 1. HERO SECTION */}
      <div className="loc-hero">
        <div className="loc-hero__content">
          <h1 className="loc-hero__title">Baltimore House Care Home</h1>
          <p className="loc-hero__subtitle">
            Family-owned residential care steeped in tradition and rural splendour.
          </p>
          
          <button className="loc-hero__btn" onClick={() => setHeroExpanded(!heroExpanded)}>
            {heroExpanded ? 'See Less' : 'See More'}
          </button>

          {/* Expanded Content */}
          <div className={`loc-hero__expanded ${heroExpanded ? 'loc-hero__expanded--open' : ''}`}>
            <div className="loc-hero__expanded-card">
              <p>
                Baltimore House Care Home is situated in a pastoral area of Barry steeped in tradition and rural splendour Baltimore is a family-owned Residential Care Home, whose directors are fully involved in the management of the home and Situated opposite is All Saints Church which was founded at the turn of the 20th Century and is central to the Anglican and community worship in Barry. A short distance away is the Porthkerry Country Park which boasts 220 acres of woods and meadowland. Essentially a beautiful day out.
              </p>
              <p>
                Baltimore House is a well-established Residential Home for people with or without cognitive impairment. Home offering Bipolar/Manic Depression Alzheimer’s Care with a dedicated manager and staff for each speciality. It accommodates 26 residents and despite being a residential facility, has lift access to the upper floors. Baltimore boasts a wide-open conservatory with delightful garden views and hosts many social gatherings and visiting entertainment. The rooms are tastefully decorated and many of the lounge features remain in place as the original fittings. High ceilings and warm cosy areas that reflect a time gone but enhanced by the facilities needed for a care home.
              </p>
              <p>
                The staff are seasoned and have been in post for many years and describe Baltimore as a home from home. We are supported by community services such as dietetics, occupational therapy and community mental health teams. GP services are prompt and all residents receive the care and treatment they need. There is a visiting Chiropodist and families are more than welcome to arrange their own visiting therapist and hairdressers if they so wish.
              </p>
              <p>
                The atmosphere at Baltimore House is warm and friendly so you are more than welcome to arrange to have a look around if you or your loved one is looking for care. Baltimore overlooks the Barry seaside We are conveniently within walking distance of the facilities and shops of Barry and just a few miles from Barry Dock and 4 minutes from the Barry Island
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row (Floating) */}
        <div className="loc-stats">
          <div className="loc-stats__item">
            <i className="fas fa-bed"></i>
            <span>26 Residents</span>
          </div>
          <div className="loc-stats__item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Barry</span>
          </div>
          <div className="loc-stats__item">
            <i className="fas fa-paw"></i>
            <span>Pet Friendly</span>
          </div>
          <div className="loc-stats__item">
            <i className="fas fa-users"></i>
            <span>Family Owned</span>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITIES SECTION */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Life at Baltimore House</span>
                <h2 className="section-header__title">Activities Baltimore</h2>
              </div>
              <p className="loc-text">
                At Baltimore House, we believe encouraging our residents to be as active as possible is a key part of maintaining good physical and mental well being. We offer a varied activity program designed to be stimulating, fun, and promote socialisation.
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
            <h2 className="modal-title">Activities at Baltimore House</h2>
            <div className="modal-body">
              <p>
                We create a homely environment where residents can enjoy their hobbies and interests. Our activities are tailored to individual needs and preferences.
              </p>

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
                  We cater services primarily for general and dementia registered clients. This includes Old Age/Elderly Care and Dementia/Alzheimer’s Care for those assessed as needing residential care.
                </p>
                
                <div className={`facilities-content__more ${facilitiesExpanded ? 'facilities-content__more--expanded' : ''}`}>
                  <p className="loc-text">
                    There is provision for functional mental illness such as Bipolar Disorder/Depression also categorised as requiring residential rather than nursing care provision.
                  </p>
                  
                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '15px' }}>Key Features</h3>
                    <ul className="loc-text" style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Total 26 Rooms</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>7 Rooms have ensuite facilities</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Wheelchair Access to all areas</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Lift Available</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Good access to public transport</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Own furniture if required</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Pet Friendly</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Phone Point in own room/Mobile</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Television point in own room</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Residents Internet Access</li>
                    </ul>
                  </div>
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
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Dedicated Staff</span>
                <h2 className="section-header__title">Meet Our Team</h2>
              </div>
              <p className="loc-text">
                Our directors are fully involved in the management of the home, ensuring a personal touch. Our dedicated staff provide high-quality care tailored to the needs of each resident.
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
        </div>
      </section>

      {/* 5. NEWS SECTION */}
      {baltimoreNews.length > 0 && (
        <section className="loc-section loc-section--light">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News from Baltimore</h2>
            </div>
            <div className="news-grid modern">
              {baltimoreNews.map((news) => (
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
                  <span>1 & 2 Park Road,<br/>Barry, CF62 6NU</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:01446420714">01446 420 714</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:manager@baltimorecarehome.com">manager@baltimorecarehome.com</a>
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
                  <span className="fact-label">Capacity:</span>
                  <span className="fact-value">26 Residents</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Setting:</span>
                  <span className="fact-value">Pastoral</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Feature:</span>
                  <span className="fact-value">Conservatory</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Pets:</span>
                  <span className="fact-value">Allowed</span>
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
                  "A wonderful home with a true family feel. The staff are incredibly supportive and kind."
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
            <ReviewForm locationName="Baltimore Care Home" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BellavistaBaltimore;
