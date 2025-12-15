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

const WaverleyCareCentre = () => {
  const navigate = useNavigate();
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [teamExpanded, setTeamExpanded] = useState(false);
  const [waverleyNews, setWaverleyNews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const allNews = await fetchNewsItems();
      const filtered = allNews.filter(news => 
        news.location.toLowerCase().includes('waverley') || 
        news.location === 'All Locations'
      );
      setWaverleyNews(filtered);
    };
    loadNews();
  }, []);

  // Using Barry's images as placeholders as requested
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
    { icon: "fas fa-users", title: "129 Registered Places" },
    { icon: "fas fa-water", title: "Coastal Views" },
    { icon: "fas fa-user-nurse", title: "General Nursing" },
    { icon: "fas fa-brain", title: "EMI & FMI Care" },
    { icon: "fas fa-theater-masks", title: "Theatre/Sensory Room" },
    { icon: "fas fa-couch", title: "Lounges & Communal" },
    { icon: "fas fa-leaf", title: "Garden & Patio" },
    { icon: "fas fa-wheelchair", title: "Dementia Friendly" }
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
    <div className="location-page theme-waverley">
      {/* 1. HERO SECTION */}
      <div className="loc-hero">
        <div className="loc-hero__content">
          <h1 className="loc-hero__title">Waverley Care Centre</h1>
          <p className="loc-hero__subtitle">
            Stunning views over the coast and Bristol Channel in Penarth.
          </p>
          
          <button className="loc-hero__btn" onClick={() => setHeroExpanded(!heroExpanded)}>
            {heroExpanded ? 'See Less' : 'See More'}
          </button>

          {/* Expanded Content */}
          <div className={`loc-hero__expanded ${heroExpanded ? 'loc-hero__expanded--open' : ''}`}>
            <div className="loc-hero__expanded-card">
              <p>
                The Waverley is a family-owned nursing home that overlooks the sea and open countryside, 
                offering stunning views over the coast and Bristol Channel. We are conveniently located 
                within walking distance of Penarth's shops and facilities, just a few miles from Cardiff.
              </p>
              <p>
                At the Waverley, we know that little things make all the difference to our lives – a smiling face 
                in the morning, a trip outside when the sun is shining, or staff who have time to stop and chat. 
                We go the extra mile to ensure the comfort and happiness of our residents.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row (Floating) */}
        <div className="loc-stats">
          <div className="loc-stats__item">
            <i className="fas fa-users"></i>
            <span>129 Residents</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => navigate('/our-care')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-water"></i>
            <span style={{ textDecoration: 'underline', color: '#0066cc' }}>Our Care</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-user-nurse"></i>
            <span style={{ textDecoration: 'underline', color: '#0066cc' }}>170+ Staff</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Waverley+Care+Centre+Penarth', '_blank')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-walking"></i>
            <span style={{ textDecoration: 'underline', color: '#0066cc' }}>Walk to Penarth</span>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITIES SECTION */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Life at Waverley</span>
                <h2 className="section-header__title">Activities & Social Life</h2>
              </div>
              <p className="loc-text">
                We believe encouraging our residents to be as active as possible is a key part of maintaining good physical and mental well being. We offer a varied activity program designed to be stimulating, fun, and promote socialisation.
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
            <h2 className="modal-title">Activities at Waverley</h2>
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
                  At the Waverley we all work as a team to ensure our residents are happy, comfortable and well-cared for, with the best possible quality of life. The dignity and privacy of our residents is a priority.
                </p>
                <p className="loc-text" style={{ marginTop: '15px' }}>
                  We aim to keep our residents stimulated and interested by encouraging them to take part in a programme of regular and specially organised activities in the company of other residents and staff. Participation is entirely the choice of the individual.
                </p>
                
                <div className={`facilities-content__more ${facilitiesExpanded ? 'facilities-content__more--expanded' : ''}`}>
                  <p className="loc-text">
                    As far as possible we encourage the independence or our residents and provide laundry washing and drying facilities. Residents can make themselves hot drinks and snacks under supervision and are welcome, and indeed encouraged, to continue any hobbies they enjoy.
                  </p>

                  <div style={{ marginTop: '30px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '10px' }}>General nursing care</h3>
                    <p className="loc-text" style={{ marginBottom: '10px' }}>For elderly people needing personal and/or nursing care.</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '25px' }} className="loc-text">
                      <li>66 cheerful and newly refurbished single rooms with bedroom and sitting area</li>
                      <li>Most rooms have ensuite bathrooms and views over the coast and the Bristol Channel.</li>
                      <li>All rooms are suitable for wheelchair users.</li>
                      <li>Each floor of 10 – 14 rooms has its own dining and lounge area so residents can enjoy company or receive their care in the privacy of their bedroom.</li>
                      <li>There is a kitchen area on each floor for use by residents and visitors if they wish, or hot drinks can be made by the carers as requested.</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '10px' }}>Elderly Mentally Infirm</h3>
                    <p className="loc-text" style={{ marginBottom: '10px' }}>For people who suffer mainly from dementia or other cognitive mental infirmity.</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '25px' }} className="loc-text">
                      <li>We encourage communal living and dining as this helps to minimise the potential risk of an injury or accident to our residents. The staff can make sure that everybody is eating and drinking well.</li>
                      <li>29 cheerful bedrooms, mostly single, with a number of double rooms for those who prefer to share.</li>
                      <li>Some rooms also have ensuite bathroom facilities.</li>
                      <li>There are two communal lounge and dining areas; one is smaller and quieter for residents who are distracted in the larger area, where the aim is to stimulate residents with activity and a lively atmosphere.</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '10px' }}>Functional Mental Illness</h3>
                    <p className="loc-text" style={{ marginBottom: '10px' }}>For people who require nursing care because of functional mental illness.</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '25px' }} className="loc-text">
                      <li>We encourage communal living and most residents spend a lot of their day in company in the lounge or dining area. This area has a relaxed pace of life and we plan our residents’ care around their preferences.</li>
                      <li>24 cheerful single bedrooms, either with ensuite bathrooms or easy access to a nearby bathroom and toilet.</li>
                      <li>All rooms are suitable for wheelchair users.</li>
                      <li>All our bedrooms are fully furnished, but residents are welcome to bring small items of furniture with them to personalise their rooms. The large majority of our beds are profiling (electrically operated enabling them to adjust to a sitting position or to elevate the feet).</li>
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
      {(teamMembers.length > 0 || teamGalleryImages.length > 0) && (
        <section className="loc-section loc-section--white" id="team-section">
          <div className="container">
            <div className="loc-grid">
              <div className="loc-grid__content">
                <div className="section-header">
                  <span className="section-header__subtitle">Dedicated Staff</span>
                  <h2 className="section-header__title">Meet Our Team</h2>
                </div>
                <div className="team-content">
                  <p className="loc-text">
                    Each of our three units (General Nursing, EMI and FMI) is overseen by an experienced Unit Manager, supported by Sisters and Staff Nurses.
                  </p>
                  
                  <div className={`facilities-content__more ${teamExpanded ? 'facilities-content__more--expanded' : ''}`}>
                    <p className="loc-text">
                      Relevantly qualified staff are on duty at all times, including RGNs (general nursing) in Seaviews, RMNs (psychiatric nursing) in both Glan-y-mor and in Cliffhaven. All of our senior staff operate an open door policy and encourage friends and family to seek out the qualified nurse on duty, so that an up to date picture can be given, relevant to the person that is visiting.
                    </p>
                    <p className="loc-text">
                      Senior Care Assistants work under the guidance of the qualified staff and head up the Care Assistant teams. The atmosphere within the Waverley is one of busy but calm and the relaxed but professional ambience is very evident within the units.
                    </p>
                    <p className="loc-text">
                      We also benefit from 3 full time Physio Aides and Activities Officers. There are daily timetables of activities in each unit, not suitable for all, but during the week there are many activities which the majority thoroughly enjoy.
                    </p>
                    <p className="loc-text">
                      Two full-time Education Officers conduct a continuous programme of staff training to ensure that our competent and capable staff provide good care delivered with respect and dignity. Training takes place within the classroom and also out in the units, where standards are constantly monitored.
                    </p>
                    <p className="loc-text">
                      The management keep policies and procedures under continual review to ensure they are up-to-date with legislative changes and best practice.
                    </p>
                  </div>

                  <button 
                    className="btn btn--outline" 
                    onClick={() => setTeamExpanded(!teamExpanded)}
                    style={{ marginTop: '20px' }}
                  >
                    {teamExpanded ? 'Read Less' : 'Read More'}
                  </button>
                </div>
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
                <div className="section-header" style={{ marginBottom: '32px' }}>
                  <h3 className="section-header__title" style={{ fontSize: '1.8rem' }}>Key Staff Members</h3>
                </div>
                <div className="team-scroll-wrapper" style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: '24px',
                  paddingBottom: '24px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--color-primary) #f0f0f0',
                  WebkitOverflowScrolling: 'touch'
                }}>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="team-member-card" style={{
                      flex: '0 0 300px',
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transition: 'transform 0.3s ease',
                      border: '1px solid #eee'
                    }}>
                      <div className="team-member-image" style={{ height: '320px', background: '#f5f5f5', position: 'relative' }}>
                        {member.image ? (
                          <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ccc',
                            fontSize: '4rem'
                          }}>
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          padding: '24px 20px 16px',
                          color: 'white'
                        }}>
                          <h4 style={{ fontSize: '1.25rem', marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{member.name}</h4>
                          <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500 }}>{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. NEWS SECTION */}
      {waverleyNews.length > 0 && (
        <section className="loc-section loc-section--light">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News from Waverley</h2>
            </div>
            <div className="news-grid modern">
              {waverleyNews.map((news) => (
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
                  <span>122-124 Plymouth Road,<br/>Penarth, CF64 5DN</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:02920705282">029 2070 5282</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:reception@waverleycarecentre.com">reception@waverleycarecentre.com</a>
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
                  <span className="fact-value">129 Residents</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Location:</span>
                  <span 
                    className="fact-value" 
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Waverley+Care+Centre+Penarth', '_blank')}
                  >
                    Penarth
                  </span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Our Care:</span>
                  <Link 
                    to="/our-care" 
                    className="fact-value" 
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Our Care
                  </Link>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Setting:</span>
                  <span className="fact-value">Coastal</span>
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
                  "The Waverley staff go the extra mile to ensure the comfort and happiness of our residents."
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
            <ReviewForm locationName="Waverley Care Centre" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WaverleyCareCentre;
