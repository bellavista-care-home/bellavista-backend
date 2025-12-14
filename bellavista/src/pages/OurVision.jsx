import React from 'react';
import '../styles/About.css';

const OurVision = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Vision</h1>
          <p>Preserving Dignity, Individuality, and Privacy</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          <div className="vision-content">
            <div className="mv-card full-width">
              <i className="fas fa-eye"></i>
              <h2>Our Vision Statement</h2>
              <p>
                Bellavista Nursing Home aims to provide its service users with a secure, relaxed and homely environment in which their care, well-being and comfort are of prime importance. Good reputation for its friendly warm, caring and relaxed environment – “A home from Home”
              </p>
              <p>
                 Carers will strive to preserve and maintain the dignity, individuality and privacy of all service users within a warm and caring atmosphere and in so doing will be sensitive to the service user’s changing needs. Such needs may be medical / therapeutic (for physical and mental welfare), cultural, psychological, religious, spiritual, emotional and social. Service users are encouraged to participate in the development of their individual care plans in which the involvement of family and friends may be appropriate and is greatly valued.
              </p>
              <p>
                This will be achieved through planned activities designed to encourage mental alertness, self-esteem and social interaction with other service users.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurVision;
