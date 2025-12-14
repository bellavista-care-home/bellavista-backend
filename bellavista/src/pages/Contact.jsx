import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const locations = [
    {
      name: 'Bellavista Nursing Home Barry',
      address: '106-108 Tynewydd Road, Barry, CF62 8BB',
      phone: '01446 743983',
      email: 'manager@bellavistanursinghome.com',
      mapLink: 'https://maps.google.com/?q=106-108+Tynewydd+Road,+Barry,+CF62+8BB'
    },
    {
      name: 'Bellavista Nursing Home Cardiff',
      address: '2 Harrowby Place, Cardiff Bay, CF10 5GB',
      phone: '029 2048 5588',
      email: 'cardiff@bellavistanursinghome.com',
      mapLink: 'https://maps.google.com/?q=2+Harrowby+Place,+Cardiff+Bay,+CF10+5GB'
    },
    {
      name: 'Waverley Care Centre',
      address: '122-124 Plymouth Road, Penarth, CF64 5DN',
      phone: '029 2070 5282',
      email: 'reception@waverleycarecentre.com',
      mapLink: 'https://maps.google.com/?q=122-124+Plymouth+Road,+Penarth,+CF64+5DN'
    },
    {
      name: 'College Fields Nursing Home',
      address: 'College Fields Close, Barry, CF62 8LE',
      phone: '+44 1446 747778',
      email: 'reception@cfnh.wales',
      mapLink: 'https://maps.google.com/?q=College+Fields+Close,+Barry,+CF62+8LE'
    },
    {
      name: 'Baltimore Care Home',
      address: '1-2 Park Rd, Barry, CF62 6NU',
      phone: '01446 420714',
      email: 'manager@baltimorecarehome.com',
      mapLink: 'https://maps.google.com/?q=1-2+Park+Rd,+Barry,+CF62+6NU'
    }
  ];

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help and answer any question you might have.</p>
        </div>
      </div>

      <section className="contact-content">
        <div className="container">
          <div className="locations-grid">
            {locations.map((loc, index) => (
              <div key={index} className="location-card">
                <h3>{loc.name}</h3>
                <div className="contact-detail">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>{loc.address}</p>
                </div>
                <div className="contact-detail">
                  <i className="fas fa-phone"></i>
                  <p>{loc.phone}</p>
                </div>
                <div className="contact-detail">
                  <i className="fas fa-envelope"></i>
                  <p>{loc.email}</p>
                </div>
                <a href={loc.mapLink} target="_blank" rel="noopener noreferrer" className="btn-map">
                  View on Map
                </a>
              </div>
            ))}
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="tel" placeholder="Your Phone" />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
