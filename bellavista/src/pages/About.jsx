import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>A Home from Home</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Welcome to Bellavista Nursing Home</h2>
              <p>
                Bellavista Nursing Home is an established and trusted Nursing Care provider, reputed for its friendly, warm, caring and relaxed environment “A Home from home”.
              </p>
              <p>
                With over 10 years’ experience in providing top quality nursing and specialist dementia care to the elderly. The design of Bellavista and our carefully selected staff, combined with our diligent approach to each and every resident, affords them the opportunity to flourish, make new friends, maintain contact with their local communities and live a life of possibility.
              </p>
              <p>
                Home is highly recommended by residents and relatives alike, our homes provide a safe, comfortable and stimulating environment that enable our highly trained staff to provide the best possible care.
              </p>
            </div>
            <div className="about-image">
              <img src="/images/hero-care-staff.jpg" alt="Bellavista Staff" />
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <i className="fas fa-heart"></i>
              <h3>Our Mission</h3>
              <p>Bellavista Nursing Home aims to provide its service users with a secure, relaxed and homely environment in which their care, well-being and comfort are of prime importance. Good reputation for its friendly warm, caring and relaxed environment – “A home from Home”.</p>
            </div>
            <div className="mv-card">
              <i className="fas fa-eye"></i>
              <h3>Our Vision</h3>
              <p>Carers will strive to preserve and maintain the dignity, individuality and privacy of all service users within a warm and caring atmosphere and in so doing will be sensitive to the service user’s changing needs. Service users are encouraged to participate in the development of their individual care plans.</p>
            </div>
            <div className="mv-card">
              <i className="fas fa-star"></i>
              <h3>Our Values</h3>
              <ul>
                <li>Compassion & Dignity</li>
                <li>Individuality & Privacy</li>
                <li>Excellence in Care</li>
                <li>Respect & Sensitivity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
