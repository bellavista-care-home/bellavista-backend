import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import santaGif from '../assets/santa.gif';

const Header = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const closeSideMenu = () => {
    setSideMenuOpen(false);
  };

  useEffect(() => {
    if (sideMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    const handleClickOutside = (event) => {
      if (sideMenuOpen && !event.target.closest('.left-menu-wrapper')) {
        setSideMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [sideMenuOpen]);

  return (
    <header className="christmas-theme">
      <div className="christmas-bg">
        <div className="snow-layer layer1"></div>
        <div className="snow-layer layer2"></div>
        <img 
          className="santa-claus-img" 
          src={santaGif} 
          alt="Walking Santa"
        />
      </div>
      <div className="header-container">
        <div className="left-menu-wrapper">
          <div className="left-menu-toggle" onClick={toggleSideMenu}>
            <i className="fas fa-bars"></i>
          </div>
          <div className={`side-dropdown-menu ${sideMenuOpen ? 'active' : ''}`}>
            <div className="nav-header">
              <div className="nav-logo">
                <i className="fas fa-home"></i>
                <span>Bellavista</span>
              </div>
            </div>
            <div className="close-menu" onClick={closeSideMenu}>
              <i className="fas fa-times"></i>
            </div>
            <div className="nav-scrollable">
              <ul>
                <div className="nav-category">Main</div>
                <li><Link to="/" onClick={closeSideMenu}>Home</Link></li>
                <li><Link to="/our-homes" onClick={closeSideMenu}>Our Homes</Link></li>
                <div className="nav-category">Services</div>
                <li><Link to="/activities" onClick={closeSideMenu}>Activities & Events</Link></li>
                <li><Link to="/facilities" onClick={closeSideMenu}>Facilities</Link></li>
                <li><Link to="/services" onClick={closeSideMenu}>Care Services</Link></li>
                <div className="nav-category">Get Started</div>
                <li><Link to="/enquiry" onClick={closeSideMenu}>Care Enquiry</Link></li>
                <li><Link to="/schedule-tour" onClick={closeSideMenu}>Schedule a Tour</Link></li>
                <div className="nav-category">Information</div>
                <li><Link to="/testimonials" onClick={closeSideMenu}>Reviews</Link></li>
                <li><Link to="/news" onClick={closeSideMenu}>News & Updates</Link></li>
                <li><Link to="/faq" onClick={closeSideMenu}>FAQ</Link></li>
                <div className="nav-category">Support</div>
                <li><Link to="/contact" onClick={closeSideMenu}>Contact Us</Link></li>
                <li><Link to="/career" onClick={closeSideMenu}>Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className={`menu-overlay ${sideMenuOpen ? 'active' : ''}`} onClick={closeSideMenu} />
        </div>
        
        <Link to="/" className="logo">
          <div className="logo-icon">
            <i className="fas fa-home"></i>
          </div>
          <div className="logo-text-group">
            <div className="logo-text">Bellavista <span>Nursing Homes</span></div>
            <div className="tagline">A Home From Home</div>
          </div>
        </Link>
        <nav>
          <ul>
            <li className="has-dropdown">
              <Link to="/our-homes">Our Homes <i className="fas fa-chevron-down"></i></Link>
              <ul className="dropdown-menu">
                <li><Link to="/bellavista-barry">Bellavista Barry</Link></li>
                <li><Link to="/bellavista-cardiff">Bellavista Cardiff</Link></li>
                <li><Link to="/waverley-care-center">Waverley Care Center</Link></li>
                <li><Link to="/college-fields-nursing-home">College Fields Nursing Home</Link></li>
                <li><Link to="/baltimore-care-home">Baltimore Care Home</Link></li>
                <li><Link to="/meadow-vale-cwtch">Meadow Vale Cwtch</Link></li>
                <li><Link to="/bellavista-pontypridd">Bellavista Pontypridd</Link></li>
              </ul>
            </li>
            <li className="has-dropdown">
              <Link>Services <i className="fas fa-chevron-down"></i></Link>
              <ul className="dropdown-menu">
                <li><Link to="/services">Care Services</Link></li>
                <li><Link to="/dementia-friendly-environment">Dementia Environment</Link></li>
                <li><Link to="/activities">Activities</Link></li>
                <li><Link to="/facilities">Facilities</Link></li>
                <li><Link to="/dining-and-nutrition">Dining & Nutrition</Link></li>
                <li><Link to="/visitor-policy">Visitor Policy</Link></li>
              </ul>
            </li>
            <li className="has-dropdown">
              <Link>About us<i className="fas fa-chevron-down"></i></Link>
              <ul className="dropdown-menu">
                <li><Link to="/our-vision">Our Vision</Link></li>
                <li><Link to="/our-values">Our Values</Link></li>
                <li><Link to="/our-care">Our Care</Link></li>
                <li><Link to="/management-team">Management Team</Link></li>
              </ul>
            </li>
            <li><Link to="/testimonials">Reviews</Link></li>
            <li className='has-dropdown'>
                <Link to="/career">Career <i className="fas fa-chevron-down"></i></Link>
                <ul className="dropdown-menu">
                  <li><Link to="/current-jobs">Current Jobs</Link></li>
                  <li><Link to="/training-and-development">Training and Development</Link></li>
                  <li><Link to="/staff-portal">Staff Portal</Link></li>
                </ul>
            </li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
