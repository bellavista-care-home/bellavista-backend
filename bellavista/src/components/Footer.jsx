import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-container">
          <div className="footer-col">
            <h3>Bellavista Nursing Homes</h3>
            <p>Providing exceptional care with a focus on comfort, dignity, and personalized attention in a beautiful, serene environment.</p>
            <div className="social-links">
              <a aria-label="Facebook" href="https://www.facebook.com/bellavistanursinghome/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a aria-label="Twitter" href="https://x.com/home_bellavista?lang=en" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a aria-label="YouTube" href="https://www.youtube.com/@bellavistagroupofnursinghomes" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/testimonials">Testimonials</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Our Services</h3>
            <ul className="footer-links">
              <li><Link to="/services">Residential Care</Link></li>
              <li><Link to="/services">Nursing Care</Link></li>
              <li><Link to="/services">Dementia Care</Link></li>
              <li><Link to="/services">Respite Care</Link></li>
              <li><Link to="/activities">Activities & Wellness</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact Info</h3>
            <ul className="footer-links">
              <li><i className="fas fa-map-marker-alt"></i> South Wales, UK</li>
              <li><i className="fas fa-phone"></i> (555) 123-4567</li>
              <li><i className="fas fa-envelope"></i> info@bellavista.com</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>© 2024 Bellavista Nursing Homes. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;