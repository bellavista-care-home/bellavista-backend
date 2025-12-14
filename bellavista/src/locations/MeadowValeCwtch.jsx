import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/CareHome.css';
import ReviewForm from '../components/ReviewForm';
import { newsData } from '../data/newsData';

const MeadowValeCwtch = () => {
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);

  // Filter news for Meadow Vale location
  const locationNews = newsData.filter(news => 
    news.location.toLowerCase().includes('meadow') || 
    news.location === 'All Locations'
  );

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
    { icon: "fas fa-users", title: "Small Group Living" },
    { icon: "fas fa-home", title: "Home Environment" },
    { icon: "fas fa-binoculars", title: "Scenic Views" },
    { icon: "fas fa-hand-holding-heart", title: "Specialised Care" },
    { icon: "fas fa-user-nurse", title: "Nurse-Led Service" },
    { icon: "fas fa-bed", title: "Respite Service" },
    { icon: "fas fa-tree", title: "Rural Setting" },
    { icon: "fas fa-wifi", title: "Smart TVs & Wifi" }
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
    <div className="location-page theme-meadow-vale">
      {/* 1. HERO SECTION */}
      <div className="loc-hero">
        <div className="loc-hero__content">
          <h1 className="loc-hero__title">Welcome to Meadow Vale Cwtch</h1>
          <p className="loc-hero__subtitle">
            Young Onset Dementia Nursing Care
          </p>
          
          <button className="loc-hero__btn" onClick={() => setHeroExpanded(!heroExpanded)}>
            {heroExpanded ? 'See Less' : 'See More'}
          </button>

          {/* Expanded Content */}
          <div className={`loc-hero__expanded ${heroExpanded ? 'loc-hero__expanded--open' : ''}`}>
            <div className="loc-hero__expanded-card">
              <p>
                Meadow Vale Cwtch is a "home from home" style Young Onset Dementia Nursing 24-hour Care provision. 
                Designed for younger dementia registered persons in a home with stunning views of the Vale of Glamorgan 
                and a unique specialised care approach.
              </p>
              <p>
                A satellite project under the umbrella of the highly esteemed Waverley Care Centre and Bellavista Group. 
                This group home is to date one of its kind, run to the needs of the individuals living there with some 
                provision for a much-needed respite service.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row (Floating) */}
        <div className="loc-stats">
          <div className="loc-stats__item">
            <i className="fas fa-bed"></i>
            <span>9 Bed Capacity</span>
          </div>
          <div className="loc-stats__item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Vale of Glamorgan</span>
          </div>
          <div className="loc-stats__item">
            <i className="fas fa-user-nurse"></i>
            <span>Nurse-Led Service</span>
          </div>
          <div className="loc-stats__item">
            <i className="fas fa-brain"></i>
            <span>Dementia Care</span>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITIES SECTION */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Life at Meadow Vale</span>
                <h2 className="section-header__title">Activities</h2>
              </div>
              <p className="loc-text">
                The service aims to create a relaxed but focused approach to mental health. The service will be led by the persons themselves and supported to meet their own identified outcomes.
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
            <h2 className="modal-title">Activities at Meadow Vale</h2>
            <div className="modal-body">
              <p>
                We offer a wide range of activities to keep our residents engaged and active. From arts and crafts to musical performances, there is something for everyone.
              </p>
              <h3>Activities we offer:</h3>
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
                  As a previous dairy house, Meadow Vale is surrounded by an incredibly calm and country living environment. Rolling hills further than the eye can see, fully steeped in rural splendour.
                </p>
                
                <div className={`facilities-content__more ${facilitiesExpanded ? 'facilities-content__more--expanded' : ''}`}>
                  <p className="loc-text">
                    Meadow Vale Cwtch is a proposed new group living nurse-led service for those who need care and support but diagnosed with organic brain disease before 65 years.
                  </p>
                  <p className="loc-text">
                    As part of that service delivery, staff are fluid caregivers, happy to move between care, cleaning, and laundry support to help the individual manage their own day-to-day needs as a collaborative partnership.
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
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Dedicated Staff</span>
                <h2 className="section-header__title">Meet Our Team</h2>
              </div>
              <p className="loc-text">
                We are looking to recruit experienced caregivers with a skill set that can be applied to those living with Young Onset Dementia. Our staff are fluid caregivers, happy to move between care, cleaning, and laundry support.
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
      {locationNews.length > 0 && (
        <section className="loc-section loc-section--light">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News</h2>
            </div>
            <div className="news-grid modern">
              {locationNews.map((news) => (
                <div key={news.id} className="news-card modern">
                  <div className="news-card__image">
                    <img src={news.image} alt={news.title} />
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
                  <span>Meadow Vale Cwtch,<br/>Barry, Vale of Glamorgan</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:02920705282">029 2070 5282</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:manager@waverleycarecentre.com">manager@waverleycarecentre.com</a>
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
                  <span className="fact-label">Specialty:</span>
                  <span className="fact-value">Young Onset Dementia</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Capacity:</span>
                  <span className="fact-value">9 Beds</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Setting:</span>
                  <span className="fact-value">Rural Country</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Service:</span>
                  <span className="fact-value">Nurse-Led</span>
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
                  "A home from home style Young Onset Dementia Nursing Care provision."
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
            <ReviewForm locationName="Meadow Vale Cwtch" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MeadowValeCwtch;
