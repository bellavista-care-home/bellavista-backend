import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { saveBookingToAPI } from '../services/tourService';

const ReceptionKiosk = () => {
  const { locationId } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Map slug to display name
  const locationNames = {
    'barry': 'Bellavista Barry',
    'cardiff': 'Bellavista Cardiff',
    'waverley': 'Waverley Care Centre',
    'college-fields': 'College Fields Nursing Home',
    'baltimore': 'Baltimore Care Home',
    'meadow-vale': 'Meadow Vale Cwtch'
  };

  const homeName = locationNames[locationId] || 'Our Care Home';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const booking = {
      id: `${Date.now()}`,
      name: formData.name,
      email: formData.email || 'walk-in@example.com', // Default if skipped
      phone: formData.phone,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: new Date().toLocaleTimeString(),
      location: homeName,
      message: formData.message || 'Walk-in Visit',
      createdAt: new Date().toISOString(),
      status: 'walk-in' // Special status for admin to see
    };

    try {
      await saveBookingToAPI(booking);
      setSubmitted(true);
      // Reset form after 5 seconds for next visitor
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 5000);
    } catch (error) {
      alert('Error registering visit. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <i className="fas fa-check-circle" style={{ fontSize: '5rem', color: '#28a745', marginBottom: '20px' }}></i>
          <h1>Welcome to {homeName}</h1>
          <p>Your visit has been registered.</p>
          <p>A staff member will be with you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1>Welcome to {homeName}</h1>
          <p>Please register your visit below</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              style={styles.input}
              placeholder="Enter your mobile number"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email (Optional)</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <button type="submit" style={styles.button}>
            Check In Now
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center'
  },
  successCard: {
    background: 'white',
    padding: '60px',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    textAlign: 'center',
    animation: 'fadeIn 0.5s ease'
  },
  header: {
    marginBottom: '30px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  field: {
    textAlign: 'left'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '15px',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    fontSize: '16px',
    transition: 'border-color 0.3s'
  },
  button: {
    background: '#0066cc',
    color: 'white',
    border: 'none',
    padding: '18px',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background 0.3s'
  }
};

export default ReceptionKiosk;
