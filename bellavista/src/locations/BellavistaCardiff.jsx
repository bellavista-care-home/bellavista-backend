import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import '../styles/CareHome.css';
import ReviewForm from '../components/ReviewForm';
import { fetchNewsItems } from '../services/newsService';

const BellavistaCardiff = () => {
  const navigate = useNavigate();
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [cardiffNews, setCardiffNews] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const allNews = await fetchNewsItems();
      const filtered = allNews.filter(news => 
        news.location.toLowerCase().includes('cardiff') || 
        news.location === 'All Locations'
      );
      setCardiffNews(filtered);
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

  const teamMembers = [
    { name: "Ceri A Evans", role: "Home Manager" },
    { name: "Titty Raj", role: "Lead Nurse in Charge" },
    { name: "Zsuzsanna Karkosak", role: "Accounts Assistant" },
    { name: "Cerry Davies", role: "Kitchen In charge" },
    { name: "Karen Thomas", role: "RMN in Charge" },
    { name: "Tania", role: "Housekeeping In charge" }
  ];

  const activitiesList = [
    "Wheelchair Zumba",
    "Ukulele Party",
    "Arts and Crafts Bingo",
    "Fancy Dress Party",
    "Meals Out",
    "Playing Cards",
    "Sing a long/ Karaoke",
    "Ice Skating show",
    "Board Games",
    "Trips out",
    "Knitting",
    "Gardening",
    "Sewing",
    "Singers and Musicians Performing",
    "Animal Therapy",
    "Decorating Calendars",
    "Exotic Animals Zoolab Event",
    "Food Tasting",
    "Local School’s Visiting",
    "Church Service",
    "Crosswords and Puzzles",
    "Armchair Exercises",
    "Garden Activities",
    "Newspaper Reading",
    "Film Days",
    "1-2-1 Reminiscing",  
    "Seasonal Activities"
  ];

  const facilitiesList = [
    { icon: "fas fa-bed", title: "62 Bedrooms" },
    { icon: "fas fa-star", title: "18 Premier Rooms" },
    { icon: "fas fa-theater-masks", title: "Theatre/Sensory Room" },
    { icon: "fas fa-book-open", title: "Library & Cafe" },
    { icon: "fas fa-umbrella-beach", title: "Indoor 'Beach' Area" },
    { icon: "fas fa-wifi", title: "Smart TVs & Wifi" },
    { icon: "fas fa-user-nurse", title: "24/7 Nursing" },
    { icon: "fas fa-elevator", title: "Lift Access" }
  ];

  const detailedFacilities = [
    {
      id: 1,
      title: "Lounges and Communal Spaces",
      icon: "fas fa-couch",
      description: "There are 6 lounges which includes a 3-large dining rooms and quieter rooms and sitting areas. Our residents are encouraged to use these public rooms but service users who choose to stay in their own rooms may do so. In addition to this there is facilitated training room, a conference room and staff rest room. We have communal spaces and quiet spaces, so our residents can find an area that’s right for them at that particular time – whether it’s for an intimate chat with their family, or a social gathering with friends."
    },
    {
      id: 2,
      title: "Theatre Room/Sensory Room",
      icon: "fas fa-theater-masks",
      description: "We have an onsite theatre room/sensory room that is used in Bellavista on a daily basis. There is a number of things we use this room for such as concerts, film afternoons and sensory experiences. The Sensory Room, is a space for enjoying a variety of sensory experiences and where gentle stimulation of the senses (sight, sound, touch, taste, smell and movement) can be provided in a controlled way. Stimulation can be increased or decreased to match the interests and therapeutic needs of the user. Such spaces, and how they are equipped, offer a range of activities that can either be sensory stimulating or calming in their effects."
    },
    {
      id: 3,
      title: "Dementia Friendly Area",
      icon: "fas fa-brain",
      description: "We are very proud of our onsite rooms these include an onsite Library, beach and cafe. Dementia sufferers take comfort in completing everyday tasks that feel familiar and that we have re-created this. We have chosen a variation in rooms as we acknowledge that everyone with dementia is different in every possible way: different age, different degrees of impairment, different backgrounds and life experience, different physical and sensory impairments, different attitudes, different tastes and so on."
    },
    {
      id: 4,
      title: "Bathing and Showering Facilities",
      icon: "fas fa-bath",
      description: "The Home has three communal shower rooms which can accommodate hoists transfer of people, in addition to this the Home has three disabled bath facilities one of them is a trolley shower/bath that can be used for people who have positioning difficulty in a standard disabled bath or shower chair. More over The Home also predominantly provides a shower facility or a bath in service user’s own rooms and all Rooms are provided with en-suite facilities."
    },
    {
      id: 5,
      title: "Specialist Equipment Facilities",
      icon: "fas fa-wheelchair",
      description: "The Home has a wide variety of specialist equipment and adaptations to meet varying needs of the service users. This include Lifting equipment like standing and full hoists, Elevators , Profiling beds, Alternating pressure mattress. Wander alarms, Nurse call systems, Suction machines, Foot protectors, nebulisers, specialist feeding cups etc"
    },
    {
      id: 6,
      title: "Outside Garden & Patio Area",
      icon: "fas fa-tree",
      description: `We have a large garden at the back of the home for the residents to enjoy. The front garden is surrounded with trees and the shrubbery and borders are full of colour.

where residents can enjoy a lovely patio area with garden furniture, and a gazebo our sunny garden is safe and secure for residents and their families to use freely and is accessible from the back entrance of the home .

We actively encourage our residents to get involved in the Gardening and garden-related activities can be a fun way of getting nursing home residents more physically active and engaged. For residents with dementia, they can provide opportunities to be involved, express themselves and interact with others

We Regularly take advantage of our big garden space and often hold garden parties for our staff/ residents and hold dementia Friendly events which can include BBQ’S Bouncy Castle’s and Entertainment.`
    }
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
    <div className="location-page theme-cardiff">
      {/* 1. HERO SECTION */}
      <div className="loc-hero">
        <div className="loc-hero__content">
          <h1 className="loc-hero__title">Welcome to Bellavista Cardiff</h1>
          <p className="loc-hero__subtitle">
            A chic, cosmopolitan atmosphere with views of Cardiff Bay.
          </p>
          
          <button className="loc-hero__btn" onClick={() => setHeroExpanded(!heroExpanded)}>
            {heroExpanded ? 'See Less' : 'See More'}
          </button>

          {/* Expanded Content */}
          <div className={`loc-hero__expanded ${heroExpanded ? 'loc-hero__expanded--open' : ''}`}>
            <div className="loc-hero__expanded-card">
              <p>
                Bellavista Nursing Home Cardiff we aim to provide its service users with a secure, relaxed and homely environment in which their care, well-being and comfort are of prime importance, we offer a homely, professional nursing, and Dementia friendly environment for people who want to retain a level of independence, but are unable to do so safely with in their own home.  We want people to enjoy living with us and feedback and support from families help us to achieve that.  We strive to preserve and maintain the dignity, privacy and individuality of everyone who chooses to live with us.              </p>
              <p>
                Bellavista Nursing Home Cardiff is located in a pleasant part of Cardiff Bay, residents benefit from living close to numerous amenities and transport routes, while enjoying the charm and comfort of homely and friendly purpose built Nursing Home with a overlooking view of Cardiff bay waterfront with a chic, cosmopolitan atmosphere, where Cardiff comes to relax. We also organise outings to local places of interest. Residents are encouraged to live an active and independent life according to preferences of residents.              </p>
              <p>
                The home is registered to provide high level of  dementia nursing , Dementia Residential,General Nursing,  Respite ,CHC Nursing and End of Life care . We offer you and your loved ones the perfect mix of peace and tranquillity, privacy and companionship, all within a safe, secure and High-Quality Nursing caring environment.
              </p>
              <p>
                All our staffs are highly trained to provide high quality care to all our residents, we continue providing on going training to further improve skills.We have a dedicated activity team who tailored person centred activity to our residents. We trying to improve our quality of care  and support our staff through various training and development programs .
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row (Floating) */}
        <div className="loc-stats">
          <div className="loc-stats__item">
            <i className="fas fa-bed"></i>
            <span>62 Bedrooms</span>
          </div>
          <div 
            className="loc-stats__item" 
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Bellavista+Nursing+Home+Cardiff+Bay', '_blank')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-map-marker-alt"></i>
            <span>Cardiff Bay</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => navigate('/our-care')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-star"></i>
            <span>Quality Care</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-users"></i>
            <span>Expert Team</span>
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
                <h2 className="section-header__title">Activities Cardiff</h2>
              </div>
              <p className="loc-text">
                At Bellavista Nursing Home Cardiff, we believe encouraging our clients to be as active as possible is a key part of maintaining good physical and mental well being. We have a dedicated in house Activities coordinator who arranges varied activity program for all of our residents.
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
            <h2 className="modal-title">Activities at Bellavista Cardiff</h2>
            <div className="modal-body">
              <p>
                We are passionate about providing as many activities as possible for our residents to enjoy and participate in. They are tailored to their abilities and choices, not limited by risk or disability.Keeping mind, body and soul stimulated, healthy and alert is a fundamental aspect of caring. we have a dedicated Activities Co-ordinator who spend time with each resident individually to understand their interests and creates a varied program for all of our residents . Our dedicated Activities Team devise a programme of regular events and entertainment within the home and opportunities to visit local events and places of interest in the community.Beneficial to us and our activity programme is being based in the heart of Cardiff Bay, a fantastic multicultural area, full of life and great things to do, with regular visits to the ice cream parlour and the inspiring Millennium Centre, also an ideal place for families to easily access with their relatives, for quality time making new memories.              
              </p>
              <p>
                We also pride ourselves on being able to support people to enjoy meaningful and fun activities of daily living, such as cooking your own meal, (maybe an old family favourite), cleaning, or setting the tables, all of which help promote wellbeing, independence and social inclusion. We also encourage strong links with the local communities providing the occasional entertainment services such as sing-alongs and performances engaging with the nostalgia that residents enjoy reminiscing over.

              </p>
              <p>
                At Bellavista Nursing Home Cardiff we have a multi-functional Cinema Theatre and sensory activities and facilities that aims to improve end-of-life care for people in nursing homes who have advanced dementia by giving them pleasure and helping them connect with others. Our residents have freedom of choice to take part in any of our many activities, a popular choice is our cinema room, complete with popcorn machine and ice creams, cookery, gardening, art classes and many more. We have various themed areas such as dining experience, Library, cafe shop], beach effects, old Victorian and Edwardian themes, gazebos and a splendid outdoor garden and other facilities which is all sensory and visual effects to Dementia Care of our Service users.The Activities programme is published each month in our Newsletter which is available on our homepage.
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
                  Bellavista Cardiff features 62 bedrooms, including 18 Premier rooms, all overlooking the beautiful waterfront. We provide a range of facilities including a Theatre/Sensory Room, Library & Cafe, and an Indoor 'Beach' Area.
                </p>
                
                <div className={`facilities-content__more ${facilitiesExpanded ? 'facilities-content__more--expanded' : ''}`}>
                  <p className="loc-text">
                    Bellavista nursing home is set in the sought-after area of Cardiff Bay.  As well as exceptional levels of care delivered by our dedicated team or staff we provide first rate accommodation and beautiful surroundings..
                  </p>
                  <p className="loc-text">
                    Bellavista has 62 Bedrooms, 18 of which are premier rooms.All our Rooms come with Ensuite bathrooms and are decorated to a high standard they are provided with a flat screen Smart TV and are connected to a nurse call bell system. All bedrooms have privacy locks on door’s and lockable facility to secure valuable and personal items.  We also encourage our residents to bring their own belongings to individualise their room into a home from home environment, Our premier rooms will come at an extra cost all are unique and very spacious, our Premier rooms are provided with built in wardrobes and top of the range furniture. All premier Rooms have an ensuite walk in shower room and are warm and comforting throughout.
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
          
          {/* Detailed Facilities Cards */}
          <div className="detailed-facilities-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px', 
            marginTop: '40px' 
          }}>
            {detailedFacilities.map((facility) => (
              <div 
                key={facility.id} 
                className="detailed-facility-card" 
                onClick={() => setSelectedFacility(facility)}
                style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid #eee',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '16px' }}>
                  <i className={facility.icon}></i>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#333' }}>{facility.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 'auto' }}>
                  {facility.description}
                </p>
                <span style={{ display: 'inline-block', marginTop: '16px', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                  Read More <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i>
                </span>
              </div>
            ))}
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

      {/* Facility Details Modal */}
      {selectedFacility && (
        <div className="modal-overlay" onClick={() => setSelectedFacility(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedFacility(null)}>
              <i className="fas fa-times"></i>
            </button>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <i className={selectedFacility.icon} style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '16px' }}></i>
              <h2 className="modal-title">{selectedFacility.title}</h2>
            </div>
            <div className="modal-body">
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{selectedFacility.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TEAM & CARE */}
      <section className="loc-section loc-section--white" id="team-section">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Dedicated Staff</span>
                <h2 className="section-header__title">Meet Our Team</h2>
              </div>
              <p className="loc-text">
                Bellavista Cardiff has more than 100 members of staff working at our Nursing Home and we’re extremely proud of all of them. We select our staff because of their caring attitude, and we train them in all aspects of care so you have peace of mind that your loved one is in good hands. Most of them have been with us for a long time, some from the very start, forming a well-knit team dedicated to providing care of the highest standard.

                Our wonderful team comprises Nurses, Nursing assistant, Carers, Activities coordinators, Chefs, Kitchen assistant, Housekeepers, Maintenance, and more. These people are here to ensure that residents enjoy their time at the home and are supported to live life to the fullest.
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
                    fontSize: '2.5rem'
                  }}>
                    <i className="fas fa-user"></i>
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
        </div>
      </section>

      {/* 5. NEWS SECTION */}
      {cardiffNews.length > 0 && (
        <section className="loc-section loc-section--light">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News from Cardiff</h2>
            </div>
            <div className="news-grid modern">
              {cardiffNews.map((news) => (
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
                  <span>Near Techniquest,<br/>Cardiff Bay, CF10 5BW</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:02920705282">029 2070 5282</a>
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
                  <span className="fact-value">Cardiff Bay</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Specialty:</span>
                  <span className="fact-value">Dementia Care</span>
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
                  "The care and attention my father receives is outstanding. The staff are so friendly and the home is always clean."
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
            <ReviewForm locationName="Bellavista Cardiff" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BellavistaCardiff;
