import React from 'react';
import { Link } from 'react-router-dom';

const ComingSoon = () => {
  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <i className="fas fa-hard-hat" style={{ fontSize: '4rem', color: '#0066cc', marginBottom: '20px' }}></i>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#333' }}>Coming Soon</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
          We are currently working on this page. Please check back later for updates.
        </p>
        <Link to="/" className="btn btn-primary" style={{ 
          display: 'inline-block', 
          background: '#0066cc', 
          color: 'white', 
          padding: '12px 30px', 
          borderRadius: '30px', 
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'transform 0.2s'
        }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
