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

const CollegeFieldsNursingHome = () => {
  const navigate = useNavigate();
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [teamExpanded, setTeamExpanded] = useState(false);
  const [collegeNews, setCollegeNews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const allNews = await fetchNewsItems();
      const filtered = allNews.filter(news => 
        news.location.toLowerCase().includes('college') || 
        news.location === 'All Locations'
      );
      setCollegeNews(filtered);
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
    { icon: "fas fa-utensils", title: "Home-Cooked Meals" },
    { icon: "fas fa-coffee", title: "Kitchenettes on Floors" },
    { icon: "fas fa-tshirt", title: "In-House Laundry" },
    { icon: "fas fa-user-friends", title: "Spacious Lounges" },
    { icon: "fas fa-hand-holding-heart", title: "Compassionate Staff" },
    { icon: "fas fa-user-nurse", title: "24/7 Nursing Care" },
    { icon: "fas fa-bed", title: "Respite Services" },
    { icon: "fas fa-notes-medical", title: "Palliative Care" }
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
    <div className="location-page theme-college-fields">
      {/* 1. HERO SECTION */}
      <div className="loc-hero">
        <div className="loc-hero__content">
          <h1 className="loc-hero__title">Welcome to College Fields</h1>
          <p className="loc-hero__subtitle">
            Where residents truly feel at home
          </p>
          
          <button className="loc-hero__btn" onClick={() => setHeroExpanded(!heroExpanded)}>
            {heroExpanded ? 'See Less' : 'See More'}
          </button>

          {/* Expanded Content */}
          <div className={`loc-hero__expanded ${heroExpanded ? 'loc-hero__expanded--open' : ''}`}>
            <div className="loc-hero__expanded-card">
              <p>
                Everyone here prides themselves in giving not only technically correct care but also creating an environment where residents truly feel at home and that they, as they do, matter. We also try to make life as fulfilling as possible by personal interaction and offering activities that interest individuals.
              </p>
              <p>
                It is not only residents who need comfort but often families as well. The reputation we have earned has been as a result of much hard work and staff showing how important it is to care properly and compassionately.
              </p>
              <p>
                Residents enjoy their home comforts in a warm, spacious and delightful environment with lots of companionship. Relatives are confident that their loved ones are receiving tender, loving care given by highly trained professional nurses, 24 hours a day.
              </p>
              <p>
                Visitors are welcome at any time both to see loved ones or to see whether it is the ideal place for themselves, their relatives or friends.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row (Floating) */}
        <div className="loc-stats">
          <div 
            className="loc-stats__item"
            onClick={() => navigate('/our-care')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-home"></i>
            <span style={{ textDecoration: 'underline', color: '#0066cc' }}>Our Care</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=College+Fields+Nursing+Home+Barry', '_blank')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-map-marker-alt"></i>
            <span style={{ textDecoration: 'underline', color: '#0066cc' }}>Barry</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-users"></i>
            <span style={{ textDecoration: 'underline', color: '#0066cc' }}>Expert Team</span>
          </div>
          <div className="loc-stats__item">
            <i className="fas fa-door-open"></i>
            <span>Open Visiting</span>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITIES SECTION */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Life at College Fields</span>
                <h2 className="section-header__title">Activities</h2>
              </div>
              <p className="loc-text">
                We have a team of activities organisers whose delight it is to find out what interests our residents and then to try and fulfil those wishes. Music always seems popular. So do animals. Belly dancers have proved very popular too, both with the ladies and the gentlemen.
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
            <h2 className="modal-title">Activities at College Fields</h2>
            <div className="modal-body">
              <p>
                How do we know what to put on? The activities organisers encourage all residents to join the (usually) monthly group who tell them what they like and don’t like. Isn’t it lovely to have some control over your life? Sometimes painting is the choice, or cookery. Yes cookery is popular even with those who because of dietary restriction cannot eat the results.
              </p>
              
              <div className="activity-highlight-box" style={{ background: 'var(--color-bg-light)', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>Outings & Transport</h4>
                <p style={{ marginBottom: '15px' }}>
                  Sometimes getting out of the house is a delight. I remember when as a child my parents took me for a car ride. May seem very ordinary to those who are out and about all the time but when your not it can be special.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  To help with this we run two vehicles that can take wheelchairs. A single wheel chair car is very helpful as it is inconspicuous and they can be like any other family going out for a coffee or going down the Island or the Knap. They could be going to the National Trust’s Dyffryn House, to see the house and gardens.
                </p>
                <p>
                  OK your ambitions are bigger. You want an outing with your new friends or family. We also have a minibus that will take up to three wheelchairs at one time. You may be like some of our ‘boys’ who went to a rock concert at St David’s Hall in Cardiff. They had a ball. Our ‘big’ minibus is well used for all manner of outings.
                </p>
              </div>

              <div className="activity-highlight-box" style={{ borderLeft: '4px solid var(--color-primary)', padding: '15px 20px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <p style={{ fontStyle: 'italic', color: '#555' }}>
                  "Imagine having to go to outpatients and the University Hospital in Cardiff and having to wait for an ambulance to pick you up then being seen and waiting for am ambulance to bring you back home. Hours spent., Hours wasted. Not for our residents as our team will take you and being you home without all the fuss."
                </p>
                <p style={{ marginTop: '10px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                  We try to make everyone’s life as fulfilling as possible.
                </p>
              </div>


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
                  Facilities for primarily residents but some for families and visitors.
                </p>
                <p className="loc-text" style={{ marginTop: '15px' }}>
                  Certain facilities are available to every resident. Others are available to residents with particular needs. For example every bedroom and bathroom have overhead hoists that enable residents to be transferred between their beds and chair or into the bath. These overheads give a smoother more reassuring transfer to the user of the hoist than the ‘portable’ ones.
                </p>
                
                <div className={`facilities-content__more ${facilitiesExpanded ? 'facilities-content__more--expanded' : ''}`}>
                  <div style={{ marginTop: '30px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '10px' }}>Residents Room</h3>
                    <p className="loc-text">
                      However, they will have some similar features. For example, every room will have a three way hi-low electric bed. Why is this? The three way profiling bed matched with a specialist memory foam mattress will reduce a chance of developing skin tissue problems. With residents at high risk then extra steps may be needed such as ‘turning’ the person at regular intervals. Others with exceptionally high risk will be supplied with a alternating air flow mattress that stimulates the blood flow and eliminating as much as possible any area that may be at risk.
                    </p>
                    <p className="loc-text">
                      Each and every room has an overhead gantry with its own dedicated electric hoist. The advantage of these for the resident is the confidence of transferring comfortably and safely.
                    </p>
                    <p className="loc-text">
                      I remember that someone described their idea of luxury as having clean bedding every day. If that is a criteria then we give a luxury service. I need say no more.
                    </p>
                    <p className="loc-text">
                      Room sizes vary considerably. Some are very ‘cwtchy’ a Welshism for cosy. Others a more grand. What we have found over the years is that everyone has their own idea of the right size for them. Hopefully, if the right sized room is not available on the day they enter they will be offered the right sized room for them when one becomes available.
                    </p>
                    <p className="loc-text">
                      Some rooms have sea views. Others do not. What is certain no matter what the size of the room the care will still be of a high standard. There are rooms on each of the three floors. To access each floor there is a lift and a ‘grand’ staircase.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '10px', marginTop: '25px' }}>Community Rooms</h3>
                    <p className="loc-text">
                      There are several rooms where residents can get together. The main lounge is the usual place where events are held. Sometimes it is only residents enjoying themselves by art classes, the monthly non sectarian service or a get together to decide which events they would like in the following month. Every week there is a professional artist, singer or other artist. Sometimes there are unusual creatures that seem to be enjoyed by many but others choose to watch from a distance. The belly dancers have interested both ladies and the gentlemen.
                    </p>
                    <p className="loc-text">
                      There are other rooms for residents including the quiet conservatory, the dining room and the sensory room that has been really effective and liked by some people.
                    </p>
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
        <section id="team-section" className="loc-section loc-section--white">
          <div className="container">
            <div className="loc-grid">
              <div className="loc-grid__content">
                <div className="section-header">
                  <span className="section-header__subtitle">Dedicated Staff</span>
                  <h2 className="section-header__title">Meet Our Team</h2>
                </div>
                <div className="team-content">
                  <p className="loc-text">
                    Our valued staff are key to high quality of care, starting here with the kitchen…
                  </p>
                  <p className="loc-text" style={{ marginTop: '15px' }}>
                    Our main kitchen creates four meals a day for residents. Residents have likes and dislikes about what they want to eat. Our kitchen staff try to cater for individual choices. All produce is sourced as locally as possible and as fresh as possible. We have a large team dedicated to making the ‘dining experience’ as good as it can be. All resident’s dietary needs are catered for. Whether each resident can eat traditionally, or need a ‘soft’ diet or even be peg fed or as is often the case, need assistance with actually eating, the team are there to help and support.
                  </p>
                  
                  <div className={`facilities-content__more ${teamExpanded ? 'facilities-content__more--expanded' : ''}`}>
                      <p className="loc-text">
                          In addition to the main kitchen, there are small kitchens on every floor. Each one has a microwave, a kettle and a dishwasher. This enables staff at all times of day to prepare a hot or cold snack and a warm drink.
                      </p>
                      <p className="loc-text">
                          I have yet to meet a family who when visiting mum or dad don’t have a cuppa. When mum or dad’s home is College Fields then nothing should change. Family should be able to make a cuppa. So they will find tea and coffee. Cups and saucers (or mugs) available. Milk in the fridge. They should feel at home too!!!!
                      </p>

                      <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '10px', marginTop: '25px' }}>Other important staff involvement</h3>
                      <p className="loc-text">
                          We regularly ask residents what they think of the service they have with us. We find this helpful as we can continue doing things they like and change things they don’t.
                      </p>
                      <p className="loc-text">
                          Our domestic staff, one of whom can be seen in the pictures above, not only keep everything as spotless as possible but also chat and take an interest in resident’s families. On one response to our questionaire the resident wrote that although no one ever came to clean her room it was always immaculate. The domestic staff in that case obviously did her job of interacting so well her cleaning taks were never noticed being done.
                      </p>
                      <p className="loc-text">
                          We have our own in house laundry as can be seen above. The commercial machine can be set to ensure that everything is hygenically washed for infection control purposes.
                      </p>
                      <p className="loc-text">
                          Reception staff are invaluable in welcoming new visitors to the home and ensuring visiting professionals know where to go so they waste none of their valuable time.
                      </p>
                      <p className="loc-text">
                          Administration in the modern world is more and more necessary. Not only to check the books balance but all the masses of client records are correctly filed so they can be found when needed.
                      </p>
                      <p className="loc-text">
                          A building the size and age of ours needs constant maintenance and our team are up to the challenge.
                      </p>

                      <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '10px', marginTop: '25px' }}>Nurses and Care Staff</h3>
                      <p className="loc-text">
                          Nurses, nursing auxiliaries and care staff are the backbone of the care we provide.
                      </p>
                      <p className="loc-text">
                          We have a full compliment of trained, qualified nurses. These are supported by nurse auxiliaries. Both are trained to a high standard with the qualified nurses now generally to degree standards. They are responsible for supporting residents, understanding their medical and other needs and knowing how to react to their individual problems and needs.
                      </p>
                      <p className="loc-text">
                          Care practitioners support the top level nurses. They, too, are trained to a high standard here at College Fields. They undertake so much of the personal care helping each resident with their particular needs. Although care staff do not need to be registered with Social Care Wales until 2021 we are putting in place now all the preparatory education they will need to make their registration as swift and simple as possible
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
      {collegeNews.length > 0 && (
        <section className="loc-section loc-section--light">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News</h2>
            </div>
            <div className="news-grid modern">
              {collegeNews.map((news) => (
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
                  <span>College Fields Close,<br/>Barry, CF62 8LE</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:01446747778">01446 747778</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:reception@cfnh.wales">reception@cfnh.wales</a>
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
                  <span className="fact-label">Atmosphere:</span>
                  <span className="fact-value">Home-from-Home</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Location:</span>
                  <span 
                    className="fact-value" 
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=College+Fields+Nursing+Home+Barry', '_blank')}
                  >
                    Barry
                  </span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Our Care:</span>
                  <Link 
                    to="/our-care" 
                    className="fact-value" 
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Nursing Care
                  </Link>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Dining:</span>
                  <span className="fact-value">4 Meals Daily</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Visiting:</span>
                  <span className="fact-value">Open Policy</span>
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
                  "Residents enjoy home comforts in a warm, spacious, and delightful environment."
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
            <ReviewForm locationName="College Fields Nursing Home" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeFieldsNursingHome;
