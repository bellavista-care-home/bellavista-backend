import React from 'react';
import '../styles/Services.css';

const DementiaEnvironment = () => {
  const galleryImages = [
    { src: "/DementiaFriendlyEnvironment/BuyingDress.jpg", alt: "Dementia Friendly Shopping Experience" },
    { src: "/DementiaFriendlyEnvironment/Cafe.jpg", alt: "On-site Café" },
    { src: "/DementiaFriendlyEnvironment/DiningArea.jpg", alt: "Dementia Friendly Dining" },
    { src: "/DementiaFriendlyEnvironment/Library.jpg", alt: "Quiet Library Space" },
    { src: "/DementiaFriendlyEnvironment/wallart.jpg", alt: "Stimulating Wall Art" },
    { src: "/DementiaFriendlyEnvironment/wallposters.jpg", alt: "Themed Wall Posters" }
  ];

  return (
    <div className="services-page">
      <div className="page-header dementia-header">
        <div className="container">
          <h1>Dementia Friendly Environment</h1>
          <p>Designed to inspire memories and encourage conversations</p>
        </div>
      </div>

      <section className="services-intro" style={{ padding: '60px 0', background: '#fff' }}>
        <div className="container">
          <div className="intro-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            <div className="quote-box" style={{ 
              textAlign: 'center', 
              marginBottom: '50px',
              position: 'relative' 
            }}>
              <i className="fas fa-quote-left" style={{ 
                fontSize: '2rem', 
                color: 'var(--color-primary)', 
                opacity: 0.2, 
                marginBottom: '20px',
                display: 'block'
              }}></i>
              <p style={{ 
                fontSize: '1.4rem', 
                lineHeight: '1.8', 
                color: '#333', 
                fontStyle: 'italic',
                fontWeight: '300'
              }}>
                "Our immediate surroundings can have a huge impact on our quality of life, particularly when trying to make sense of the world around us. We work hard to create an environment that helps people living with dementia to live as independent and stress-free a life as possible."
              </p>
            </div>

            <div className="philosophy-card" style={{ 
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
              padding: '40px', 
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              borderLeft: '5px solid var(--color-primary)'
            }}>
              <h3 style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '20px', 
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <i className="fas fa-heart"></i>
                Our Passion & Commitment
              </h3>
              <p style={{ 
                fontSize: '1.15rem', 
                lineHeight: '1.7', 
                color: '#555',
                marginBottom: 0
              }}>
                Our team is passionate about creating supporting and enabling dementia environments which balance <strong>colour schemes</strong>, <strong>points of interest</strong> and <strong>areas</strong> to create a safe, homely and easily understood environment.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="service-details">
        <div className="container">
          
          {/* Awareness & Environment */}
          <div className="service-item">
            <div className="service-content">
              <div className="service-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                <div className="service-text">
                  <div className="icon-box">
                    <i className="fas fa-hand-holding-heart"></i>
                  </div>
                  <h2>Commitment to Awareness</h2>
                  <p>
                    As nursing care providers, Bellavista Nursing Home has been working closely with the Alzheimer’s Society, Social Services, Local Health Board and most of the departments in Cardiff Council to spread awareness to a wider population.
                  </p>
                  <p>
                    Our home is dementia friendly, and the small things are just as important—like personalising a room or filling a memory box, and incorporating dementia-friendly features to support people with visual, hearing and mobility impairments associated with dementia. All through the home we have enhanced and carefully designed the environment to be dementia friendly with themed features for a calmer and stimulating atmosphere.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff & 3D Areas */}
          <div className="service-item alt-bg">
            <div className="service-content">
              <div className="service-text">
                <div className="icon-box">
                  <i className="fas fa-user-nurse"></i>
                </div>
                <h2>Specialist Care & Environment</h2>
                <p>
                  Our staff are highly trained in all aspects of dementia care. We are always researching new information, ideas and technologies to give support to people living with Dementia, helping them lead fuller lives.
                </p>
                <p>
                  With our new interaction-inspired 3D dementia areas throughout our home, we create scenes designed to inspire memories and encourage conversations. Across the home, there are naturally simulated features and surroundings to match themes like an indoor garden, café, library, etc., so that people can relate their previous memories to their present life.
                </p>
              </div>
            </div>
          </div>

          {/* Community Event */}
          <div className="service-item">
            <div className="service-content">
              <div className="icon-box">
                <i className="fas fa-users"></i>
              </div>
              <h2>Connecting Communities</h2>
              <p>
                As part of connecting communities towards Dementia Awareness, Bellavista Nursing Home organised a major event on 20th of April 2018 called ‘Dementia Friendly Cardiff Bay’ in association with Dementia Friends Cardiff and local communities, which was sponsored by Barclays Bank Plc.
              </p>
              <p>
                The event was a big success and we managed to give Dementia Friendly awareness to more than 300 local people in Cardiff Bay and the local area. This helped to support the needs of the local communities in Dementia Care along with the Residents of the area. We are hoping to connect the communities and people in Cardiff and Cardiff Bay.
              </p>
              <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                <p style={{ fontStyle: 'italic', margin: 0 }}>
                  "The initiative was to bring awareness and better understanding about Dementia to support families and friends of someone living with Dementia. We wanted the local population, shops, businesses and charities to be able to welcome and support them well when they are visiting Cardiff Bay."
                </p>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="gallery-section" style={{ marginTop: '60px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--color-primary)' }}>Our Dementia Friendly Spaces</h2>
            <div className="gallery-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {galleryImages.map((img, index) => (
                <div key={index} className="gallery-item" style={{ 
                  borderRadius: '10px', 
                  overflow: 'hidden', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease'
                }}>
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div className="gallery-caption" style={{ padding: '15px', background: '#fff', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: '500', color: '#555' }}>{img.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default DementiaEnvironment;
