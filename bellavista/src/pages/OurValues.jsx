import React from 'react';
import '../styles/About.css';

const OurValues = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Values</h1>
          <p>People, Not Patients</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          
          {/* Philosophy Section */}
          <div className="mv-card" style={{ marginBottom: '60px', textAlign: 'center' }}>
            <i className="fas fa-heart"></i>
            <h2>Our Philosophy</h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '900px', margin: '0 auto 20px' }}>
              We believe in people, not patients, and every resident is special and valued. 
              Every resident, and the care we provide for them, is unique.
            </p>
            <p style={{ fontSize: '1.2rem', maxWidth: '900px', margin: '0 auto', fontWeight: '500', color: 'var(--color-primary)' }}>
              Our professional work is led by the principles of kindness, empathy, dignity, integrity, respect and trust.
            </p>
          </div>

          {/* Commitments Grid */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>We Want To:</h2>
            <div className="mv-grid">
              <div className="mv-card">
                  <i className="fas fa-user-check"></i>
                  <h3>Respect & Needs</h3>
                  <p>Understand service users’ individual needs and preferences and treat them with respect.</p>
              </div>
              <div className="mv-card">
                  <i className="fas fa-door-closed"></i>
                  <h3>Privacy</h3>
                  <p>Preserve the right of a service user to be left alone and undisturbed whenever they wish.</p>
              </div>
              <div className="mv-card">
                  <i className="fas fa-hand-holding-heart"></i>
                  <h3>Independence</h3>
                  <p>While keeping them safe and healthy, allow service users to take calculated risks, to make their own decisions and think and act for themselves.</p>
              </div>
              <div className="mv-card">
                  <i className="fas fa-list-ul"></i>
                  <h3>Choice</h3>
                  <p>Give service users opportunities to select from a range of alternatives and options.</p>
              </div>
              <div className="mv-card">
                  <i className="fas fa-balance-scale"></i>
                  <h3>Rights</h3>
                  <p>Preserve all basic human rights and comply with Regulation 12(4)(b).</p>
              </div>
              <div className="mv-card">
                  <i className="fas fa-bullseye"></i>
                  <h3>Personal Aims</h3>
                  <p>Enable the service users to realise their own aims.</p>
              </div>
            </div>
          </div>

          {/* Social & Leisure Section */}
          <div className="about-grid">
            <div className="about-text">
              <h2>Social & Leisure</h2>
              <p>
                At Bellavista Nursing Home we place the utmost importance on the continuity of our residents’ quality of life. We want our residents to have every opportunity to keep up with their hobbies and interests – and hopefully develop a few new ones along the way.
              </p>
              <p>
                We have a varied and imaginative agenda of activities, carefully chosen to ensure there’s always something enjoyable to do. Some social activities are planned – others are spontaneous and on the spur of the moment.
              </p>
            </div>
            <div className="mv-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <i className="fas fa-glass-cheers"></i>
              <h3>Active Living</h3>
              <p>
                Summertime trips to the Races, carol singing at Christmas, regular visits to the local church Time Out Club and one to one shopping trips are just some of the exciting things happening throughout the year.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default OurValues;