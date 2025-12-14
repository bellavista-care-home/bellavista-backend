import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const VisitorPolicy = () => {
  return (
    <div className="visitor-policy-page">
      <div className="page-header">
        <div className="container">
          <h1>Visitor Policy</h1>
          <p>Guidelines for visiting your loved ones</p>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 0' }}>
        
        {/* Intro Section */}
        <div className="intro-section" style={{ maxWidth: '900px', margin: '0 auto 80px' }}>
          <div className="intro-text-card" style={{ 
            background: '#fff', 
            padding: '40px', 
            borderRadius: '20px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center'
          }}>
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}></div>
             <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>Visiting Information</h2>
             <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#555' }}>
               We aim to maintain a safe environment for all our residents and staff. We continue to undertake strict infection control policies. We look for your continued support to protect our residents.
             </p>
          </div>
        </div>

        {/* Guidelines Grid */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ 
            display: 'inline-block', 
            padding: '8px 16px', 
            background: '#e3f2fd', 
            color: 'var(--color-primary)', 
            borderRadius: '30px', 
            fontWeight: '600', 
            fontSize: '0.9rem',
            marginBottom: '15px'
          }}>SAFETY FIRST</span>
          <h2 style={{ fontSize: '2.5rem', color: '#333', margin: 0 }}>Visiting Guidelines</h2>
        </div>

        <div className="guidelines-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px',
          marginBottom: '80px'
        }}>
          
          {/* Card 1: Appointment */}
          <div className="guideline-card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ width: '50px', height: '50px', background: '#e3f2fd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)', fontSize: '1.5rem' }}>
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#333' }}>Appointment System</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Visits are currently by appointment to ensure the normal running of the home and residents' routines.</p>
          </div>

          {/* Card 2: Hours */}
          <div className="guideline-card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ width: '50px', height: '50px', background: '#e3f2fd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)', fontSize: '1.5rem' }}>
              <i className="fas fa-clock"></i>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#333' }}>Visiting Hours</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Visits generally take place between <strong>10:00 am and 3:00 pm</strong> to accommodate daily care routines.</p>
          </div>

          {/* Card 3: Visitors */}
          <div className="guideline-card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ width: '50px', height: '50px', background: '#e3f2fd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)', fontSize: '1.5rem' }}>
              <i className="fas fa-user-friends"></i>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#333' }}>Number of Visitors</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Due to room sizes and ventilation, we may limit the number of visitors at one time (typically two).</p>
          </div>

          {/* Card 4: Health & Safety */}
          <div className="guideline-card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ width: '50px', height: '50px', background: '#e3f2fd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)', fontSize: '1.5rem' }}>
              <i className="fas fa-shield-virus"></i>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#333' }}>Health & Safety</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Visitors may be asked to complete a health declaration or undergo testing depending on current guidelines. Masks may be required.</p>
          </div>

          {/* Card 5: Video Calls */}
          <div className="guideline-card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ width: '50px', height: '50px', background: '#e3f2fd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)', fontSize: '1.5rem' }}>
              <i className="fas fa-video"></i>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#333' }}>Video Calls</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Video contacts are available via FaceTime, WhatsApp, or Zoom. Please contact the home to book a video link-up.</p>
          </div>

        </div>

        {/* Booking Section */}
        <div className="booking-section" style={{ 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
          borderRadius: '25px', 
          padding: '60px 40px', 
          textAlign: 'center',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.03)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <i className="fas fa-calendar-alt" style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '25px', display: 'block' }}></i>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', color: '#333' }}>How to Book a Visit</h2>
            <p style={{ fontSize: '1.15rem', color: '#555', marginBottom: '30px', lineHeight: '1.8' }}>
              Please contact the specific home directly to book your appointment. 
              <br/>
              <strong>For College Fields</strong>, please telephone extension 200.
              <br/>
              <strong>For other homes</strong>, please use the main contact numbers provided on their respective pages.
            </p>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
              <Link to="/contact" className="btn btn--primary" style={{ 
                padding: '15px 40px', 
                fontSize: '1.1rem', 
                borderRadius: '50px', 
                boxShadow: '0 10px 20px rgba(30, 91, 168, 0.2)',
                background: 'var(--color-primary)',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-phone-alt" style={{ marginRight: '10px' }}></i> Contact Us to Book
              </Link>
              <Link to="/our-homes" className="btn btn--outline" style={{ 
                padding: '15px 40px', 
                fontSize: '1.1rem', 
                borderRadius: '50px', 
                border: '2px solid var(--color-primary)',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                background: 'transparent'
              }}>
                Find Home Number
              </Link>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#888', fontStyle: 'italic' }}>
              * If you are unable to attend your appointment, please let us know as soon as possible so the slot can be offered to another family.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VisitorPolicy;
