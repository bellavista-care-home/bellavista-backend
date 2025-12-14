import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OurHomes.css';

export const HOMES_DATA = [
  {
    id: 'cardiff',
    name: 'Bellavista Cardiff',
    location: 'Cardiff Bay',
    description: 'A homely and friendly purpose-built Nursing Home with overlooking views of Cardiff Bay waterfront. Situated in a sought-after area, it offers a chic, cosmopolitan atmosphere where residents can enjoy the vibrant surroundings.',
    features: ['62 Bedrooms', 'Ensuite Facilities', 'Cinema/Sensory Room', 'Dementia Friendly Areas', 'Views of Cardiff Bay'],
    images: [
      '/HomeImages/cfnh1-1-150x150.jpg',
      '/HomeImages/IMG_0456_425x300_acf_cropped-150x150.jpg'
    ],
    link: '/bellavista-cardiff'
  },
  {
    id: 'barry',
    name: 'Bellavista Barry',
    location: 'Barry',
    description: 'A long-established quality Nursing Home situated in the seaside town of Barry with spectacular views over the Bristol Channel. Running since 2007, we enable elderly people to live as independently as possible.',
    features: ['39 Bedded Home', 'Seaside Views', 'Cinema Lounge', 'Landscaped Gardens', 'Dementia Friendly Dining'],
    images: [
      '/HomeImages/IMG_0736_425x300_acf_cropped-150x150.jpg',
      '/HomeImages/IMG_5863-1_360x360_acf_cropped-150x150.jpg'
    ],
    link: '/bellavista-barry'
  },
  {
    id: 'waverley',
    name: 'Waverley Care Centre',
    location: 'Penarth',
    description: 'A family-owned nursing home overlooking the sea and open countryside. We offer a warm, friendly, and professional environment where "little things make all the difference".',
    features: ['129 Registered Places', 'General Nursing', 'EMI & FMI Care', 'Stunning Coast Views', 'Walking Distance to Penarth'],
    images: [
      '/HomeImages/preview_b-1_425x300_acf_cropped-2.jpg',
      '/HomeImages/preview_bellavista1_425x300_acf_cropped.jpg'
    ],
    link: '/waverley-care-center'
  },
  {
    id: 'college-fields',
    name: 'College Fields Nursing Home',
    location: 'Barry',
    description: 'Priding ourselves on creating an environment where residents truly feel at home. We focus on technically correct care combined with personal interaction and fulfilling activities.',
    features: ['Home-cooked Meals', 'Personalized Care', 'In-house Laundry', 'Warm & Spacious Environment', 'Dedicated Staff'],
    images: [
      '/HomeImages/preview_Carresr-Page_425x300_acf_cropped.png',
      '/HomeImages/preview_cfnh10-1_425x300_acf_cropped.jpg'
    ],
    link: '/college-fields-nursing-home'
  },
  {
    id: 'baltimore',
    name: 'Baltimore Care Home',
    location: 'Barry',
    description: 'A welcoming residential care home providing a safe and comfortable environment. We focus on individual needs and creating a supportive community for all our residents.',
    features: ['Residential Care', 'Comfortable Rooms', 'Community Atmosphere', 'Daily Activities', 'Pastoral Area'],
    images: [
      '/HomeImages/preview_cfnh2-1_425x300_acf_cropped.jpg',
      '/HomeImages/preview_IMG-20180716-WA0016_425x300_acf_cropped.jpg'
    ],
    link: '/baltimore-care-home'
  },
  {
    id: 'meadow-vale',
    name: 'Meadow Vale Cwtch',
    location: 'Barry',
    description: 'A "home from home" style Young Onset Dementia Nursing 24-hour Care provision. Designed for younger dementia registered persons with stunning views of the Vale of Glamorgan.',
    features: ['Young Onset Dementia', '9 Bed Capacity', 'Nurse-Led Service', 'Rural Country Setting', 'Respite Service'],
    images: [
      '/HomeImages/IMG_0736_425x300_acf_cropped-150x150.jpg',
      '/HomeImages/IMG_5863-1_360x360_acf_cropped-150x150.jpg'
    ],
    link: '/meadow-vale-cwtch'
  },
  {
    id: 'pontypridd',
    name: 'Bellavista Pontypridd',
    location: 'Pontypridd',
    description: 'Our newest location coming soon to Pontypridd. We are excited to bring our high standards of care to this community.',
    features: ['Coming Soon', 'Nursing Care', 'Dementia Care'],
    images: [
      '/HomeImages/cfnh1-1-150x150.jpg',
      '/HomeImages/IMG_0456_425x300_acf_cropped-150x150.jpg'
    ],
    link: '/bellavista-pontypridd'
  }
];

const OurHomes = ({ isStandalone = false }) => {
  const [imageIndices, setImageIndices] = useState(HOMES_DATA.map(() => 0));
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndices(prev => prev.map(index => (index + 1) % 2));
    }, 4000); // Slower rotation

    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (homeIndex, imageIndex) => {
    setImageIndices(prev => {
      const newIndices = [...prev];
      newIndices[homeIndex] = imageIndex;
      return newIndices;
    });
  };

  return (
    <div className={`our-homes-page ${isStandalone ? 'standalone' : ''}`}>
      {isStandalone && (
        <div className="homes-header">
          <div className="container">
            <h1>Our Care Homes</h1>
            <p>Discover our network of exceptional care homes across South Wales</p>
          </div>
        </div>
      )}

      <div className="container">
        {!isStandalone && (
          <div className="section-header">
            <h2 className="section-title">Our Care Homes</h2>
            <p className="section-subtitle">
              Discover our modern care homes across South Wales, each designed with comfort, safety & wellbeing in mind.
            </p>
          </div>
        )}
        
        <div className={`homes-grid ${!isStandalone ? 'scrollable' : ''}`}>
          {HOMES_DATA.map((home, index) => (
            <div key={home.id} className="home-card" onClick={() => navigate(home.link)}>
              <div className="home-image-container">
                <img 
                  src={home.images[imageIndices[index]]} 
                  alt={home.name} 
                  className="home-main-image"
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/400x300?text=Bellavista+Home'}}
                />
                <div className="location-badge">
                  <i className="fas fa-map-marker-alt"></i> {home.location}
                </div>
                <div className="image-indicators">
                  {home.images.map((_, imgIndex) => (
                    <button
                      key={imgIndex}
                      className={`indicator-dot ${imageIndices[index] === imgIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(index, imgIndex);
                      }}
                      aria-label={`View image ${imgIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="home-content">
                <h3>{home.name}</h3>
                <p className="home-description">{home.description}</p>
                
                <div className="home-features">
                  {home.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="feature-tag">
                      <i className="fas fa-check"></i> {feature}
                    </span>
                  ))}
                </div>

                <button className="view-home-btn">
                  View Home <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurHomes;
