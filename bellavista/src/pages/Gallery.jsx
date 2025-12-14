import React, { useState } from 'react';
import '../styles/Gallery.css';

const Gallery = () => {
  const images = [
    { src: '/HomeImages/cfnh1-1-150x150.jpg', category: 'Homes' },
    { src: '/HomeImages/IMG_0456_425x300_acf_cropped-150x150.jpg', category: 'Homes' },
    { src: '/HomeImages/barry-location.jpg', category: 'Locations' },
    { src: '/NewsImages/bollywood-night.jpg', category: 'Events' },
    { src: '/images/hero-care-staff.jpg', category: 'Staff' },
    // Add placeholders if actual images are not verified, but these paths are from previous reads/logic
  ];

  const [filter, setFilter] = useState('All');

  const filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.category === filter);

  const categories = ['All', 'Homes', 'Locations', 'Events', 'Staff'];

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="container">
          <h1>Photo Gallery</h1>
          <p>A glimpse into life at Bellavista</p>
        </div>
      </div>

      <div className="container">
        <div className="gallery-filter">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredImages.map((img, index) => (
            <div key={index} className="gallery-item">
              <img src={img.src} alt={`Gallery ${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
