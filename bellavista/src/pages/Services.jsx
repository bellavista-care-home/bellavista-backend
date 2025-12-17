import React from 'react';
import '../styles/Services.css';

const Services = () => {
  return (
    <div className="services-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Care</h1>
          <p>Professional, Compassionate, and Personalized Care</p>
        </div>
      </div>

      <section className="services-intro">
        <div className="container">
          <div className="intro-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <p className="intro-text" style={{ fontSize: '1.25rem', marginBottom: '30px', textAlign: 'center' }}>
              Our staff are dedicated to providing specialist care for people in need of long term Nursing, Dementia, and Palliative care, Learning disability, and respite care in a warm and friendly environment. We encourage families to become involved in everything we do from the care planning process.
            </p>

            <div className="care-features" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '30px',
              marginBottom: '40px',
              textAlign: 'left'
            }}>
              <div className="feature-box" style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px', borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ color: 'var(--color-primary)', marginBottom: '15px', fontSize: '1.2rem' }}>Comprehensive Support</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}><i className="fas fa-check-circle" style={{ color: '#28a745', marginRight: '10px' }}></i>Support for physical health needs</li>
                  <li style={{ marginBottom: '10px' }}><i className="fas fa-check-circle" style={{ color: '#28a745', marginRight: '10px' }}></i>Comfortable accommodation</li>
                  <li style={{ marginBottom: '10px' }}><i className="fas fa-check-circle" style={{ color: '#28a745', marginRight: '10px' }}></i>24-hour care support</li>
                  <li style={{ marginBottom: '10px' }}><i className="fas fa-check-circle" style={{ color: '#28a745', marginRight: '10px' }}></i>Nutritious meals & day-to-day help</li>
                </ul>
              </div>

              <div className="feature-box" style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px', borderLeft: '4px solid var(--color-secondary)' }}>
                <h3 style={{ color: 'var(--color-secondary)', marginBottom: '15px', fontSize: '1.2rem' }}>Specialist Nursing</h3>
                <p style={{ marginBottom: '15px' }}>
                  Our care homes provide additional care from registered nurses and specialist support for residents living with dementia and nursing needs.
                </p>
                <p>
                  We help people settle into their new home by working with you and your family to document important life details, creating a care package as individual as you are.
                </p>
              </div>
            </div>

            <div className="cta-box" style={{ 
              background: 'linear-gradient(to right, #e3f2fd, #bbdefb)', 
              padding: '30px', 
              borderRadius: '15px', 
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <p style={{ fontSize: '1.2rem', color: '#0056b3', margin: 0, fontWeight: '500' }}>
                Please see the different elements of nursing care we provide in our nursing homes below, and <a href="/contact" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>contact us</a> for a more detailed quote based on your personal needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="service-details">
        <div className="container">
          
          {/* Dementia Care */}
          <div className="service-item" id="dementia-care">
            <div className="service-content">
              <div className="service-grid-layout">
                <div className="service-image">
                  <img src="/OurCare/dementia-care.jpg" alt="Dementia Care" loading="lazy" />
                </div>
                <div className="service-text">
                  <div className="icon-box" style={{ margin: '0 0 20px 0' }}>
                    <i className="fas fa-brain"></i>
                  </div>
                  <h2>Dementia Care</h2>
                  <p>
                    We focus on providing the best person-centred care for people with dementia and mental health problems. Our focus on this specific area allows us to use the knowledge that comes from our experience of the area, and along with our research and past evidence we are able to provide a tailored and person-centred approach to care for those in our homes.
                  </p>
                  <p>
                    The small things are just as important like personalising a room or filling a memory box, and dementia-friendly features to support people with visual, hearing and mobility impairments associated with dementia. All through the home we enhanced and carefully designed the environment to be Dementia friendly with features themes for a calmer and stimulating atmosphere.
                  </p>
                  <p>
                    Our staff are highly trained in all aspects of dementia care and behaviour therapy’s, we are always researching new information, ideas and technologies to give support to people living with Dementia, helping them lead fuller lives. With our new interaction inspired 3D dementia areas throughout our home we create scenes designed to inspire memories, and encourage conversations, Across the home, there are naturally simulated features and surroundings to match themes like indoor garden, café, library etc. so that people can relate their previous memories to their present life.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Long Term Nursing */}
          <div className="service-item alt-bg" id="nursing-care">
            <div className="service-content">
              <div className="service-grid-layout">
                <div className="service-image">
                  <img src="/OurCare/long-time-nursing.jpg" alt="Long Term Nursing" loading="lazy" />
                </div>
                <div className="service-text">
                  <div className="icon-box" style={{ margin: '0 0 20px 0' }}>
                    <i className="fas fa-user-nurse"></i>
                  </div>
                  <h2>Long Term Nursing</h2>
                  <p>
                    We provide nursing care for individuals with specialist requirements in many of our care homes. Our nursing care teams are fully qualified and have the specialist expertise required to care for residents’ varying medical needs and requirements.
                  </p>
                  <p>
                    There are many our residents who are in relatively good health but just need a little assistance with the activities. People who come to us may be living with conditions such as Parkinson’s Disease, Multiple Sclerosis or Motor Neuron Disease; others may have suffered a injury as a result of an accident.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Palliative Care */}
          <div className="service-item" id="palliative-care">
            <div className="service-content">
              <div className="service-grid-layout">
                <div className="service-image">
                  <img src="/OurCare/palliative-care.jpg" alt="Palliative Care" loading="lazy" />
                </div>
                <div className="service-text">
                  <div className="icon-box" style={{ margin: '0 0 20px 0' }}>
                    <i className="fas fa-hands-helping"></i>
                  </div>
                  <h2>Palliative Care</h2>
                  <p>
                    At Bellavista our palliative care services are provided with the care, compassion and professionalism that both the resident and their families need during this final stage in everyone’s life. The final stages of a person’s life can be even more of a complicated and emotionally overwhelming experience for the family of someone with late-stage dementia or a terminal illness.
                  </p>
                  <p>
                    Our staff will work with medical staff, hospices and other professionals whenever needed in order to provide a comfortable environment for the resident and to relieve suffering as much as possible. We provide tailored emotional support and practical guidance for families and friends throughout end of life care.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Respite Care */}
          <div className="service-item alt-bg" id="respite-care">
            <div className="service-content">
              <div className="service-grid-layout">
                <div className="service-image">
                  <img src="/OurCare/respite-care.jpg" alt="Respite Care" loading="lazy" />
                </div>
                <div className="service-text">
                  <div className="icon-box" style={{ margin: '0 0 20px 0' }}>
                    <i className="fas fa-coffee"></i>
                  </div>
                  <h2>Respite Care</h2>
                  <p>
                    We understand how difficult it can be for families or friends providing ongoing care. For this reason, it’s important to occasionally find time for yourself. Our respite care services provide a crucial break for carers for two weeks plus in planned circumstances or emergency circumstances.
                  </p>
                  <p>
                    Respite care offers families the chance to go on holiday or simply have some well-earned time off. We also provide convalescent care, to help people who need to recuperate after a hospital stay and to support them to be well enough to go back home.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* EMI Nursing & Residential Care */}
          <div className="service-item" id="emi-care">
            <div className="service-content">
              <div className="service-grid-layout">
                <div className="service-image">
                  <img src="/OurCare/emi-nursing-and-residential-care.jpg" alt="EMI Nursing & Residential Care" loading="lazy" />
                </div>
                <div className="service-text">
                  <div className="icon-box" style={{ margin: '0 0 20px 0' }}>
                    <i className="fas fa-home"></i>
                  </div>
                  <h2>EMI Nursing & Residential Care</h2>
                  <p>
                    Our residential care offers 24-hour support for older people who, through increasing frailty find it difficult to live independently at home. We do everything we can to make Residents feel safe and confident, and enjoy a fulfilled and happily balanced life within our homes.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Services;
