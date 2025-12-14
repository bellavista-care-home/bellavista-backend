import React from 'react';
import '../styles/Facilities.css';

const Facilities = () => {
  const facilities = [
    { title: 'Reception', image: '/images/reception-facility.jpeg' },
    { title: 'Lounge Area', image: '/images/lounge-area.jpg' },
    { title: 'Dining Room', image: '/images/dining-room.jpg' },
    { title: 'Private Room', image: '/images/private-room.jpg' },
    { title: 'Garden', image: '/images/garden-facility.jpeg' },
    { title: 'Outdoor Terrace', image: '/images/outdoor-terrace.jpg' },
    { title: 'Activity Room', image: '/images/activity-room.jpg' },
    { title: 'Cinema', image: '/images/cinema-facility.jpeg' },
    { title: 'Library', image: '/images/library-facility.jpeg' },
    { title: 'Arts & Crafts', image: '/images/arts-facility.jpeg' },
    { title: 'Music Therapy', image: '/images/music-therapy.jpeg' },
    { title: 'Wellness Spa', image: '/images/wellness-spa.jpg' },
    { title: 'Physiotherapy', image: '/images/physiotherapy-room.jpg' },
    { title: 'Medical Suite', image: '/images/medical-suite.jpg' },
    { title: 'Kitchen', image: '/images/kitchen-area.jpg' },
    { title: 'Laundry Service', image: '/images/laundry-service.jpg' }
  ];

  return (
    <div className="facilities-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Facilities</h1>
          <p>Modern comforts in a home-like setting</p>
        </div>
      </div>

      <section className="facilities-intro">
        <div className="container">
          <p>
            We have carefully designed our homes to offer the best possible environment for our residents. 
            From comfortable private rooms to stimulating activity areas, every corner of Bellavista is 
            crafted to enhance quality of life.
          </p>
        </div>
      </section>

      <section className="facilities-gallery">
        <div className="container">
          <div className="gallery-grid">
            {facilities.map((facility, index) => (
              <div key={index} className="gallery-item">
                <div className="image-wrapper">
                  <img src={facility.image} alt={facility.title} loading="lazy" />
                </div>
                <h3>{facility.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Facilities;
