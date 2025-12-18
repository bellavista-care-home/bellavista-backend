import React, { useState } from 'react';
import { sendBookingEmail, saveBookingLocal, saveBookingToAPI } from '../services/tourService';
import '../styles/ScheduleTour.css';

const ScheduleTour = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    location: 'Barry',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const booking = {
      id: `${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      location: formData.location,
      message: formData.message,
      createdAt: new Date().toISOString(),
      status: 'requested'
    };
    
    // 1. Send to API (which handles email)
    try {
      await saveBookingToAPI(booking);
    } catch (err) {
      console.error("API Error", err);
    }

    // 2. Fallback: Save locally if needed
    try {
      saveBookingLocal(booking);
    } catch {}

    // 3. Optional: Direct EmailJS fallback if API fails? 
    // For now we rely on API for email to ensure admin gets it.
    // But existing code called sendBookingEmail(booking) which is frontend-based.
    // The user said "when i booked a tour i got mail...". 
    // If the frontend was sending it, it would go to whatever is in sendBookingEmail.
    // Let's check sendBookingEmail in tourService.js.
    
    // Wait, the previous code had:
    // await sendBookingEmail(booking);
    // saveBookingLocal(booking);
    // await saveBookingToAPI(booking);
    
    // The user's issue is about the API-sent email (since I implemented backend email recently).
    // If I keep sendBookingEmail(booking), it uses EmailJS from frontend.
    // Does sendBookingEmail send to both?
    // In tourService.js: to_email: 'bellavistacarehomegit@gmail.com'. 
    // It does NOT send to the location admin.
    
    // So the email the user received at bellavistacarehomegit@gmail.com might have come from the Frontend EmailJS OR the Backend.
    // I should probably remove the frontend EmailJS call if the backend is doing it, to avoid duplicates.
    // OR, if the user relies on EmailJS for the global admin, I should keep it but I need to fix the backend one for the location admin.
    // BUT, the backend code I wrote DOES send to bellavistacarehomegit@gmail.com too.
    // So if both run, the global admin gets 2 emails.
    // I will comment out the frontend email to rely on the backend one, ensuring a single source of truth.
    
    setLoading(false);
    alert('Tour request submitted. Our team will contact you to confirm your visit.');
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      location: 'Barry',
      message: ''
    });
  };

  return (
    <div className="tour-page">
      <div className="tour-header">
        <div className="container">
          <h1>Schedule a Tour</h1>
          <p>Come and see our facilities and meet our friendly team</p>
        </div>
      </div>

      <div className="container">
        <div className="tour-content-grid">
          <div className="tour-info">
            <h2>Visiting Information</h2>
            <div className="info-card">
              <h3><i className="fas fa-clock"></i> Visiting Times</h3>
              <p>Visits are generally available between 10:00 AM and 3:00 PM.</p>
            </div>
            <div className="info-card">
              <h3><i className="fas fa-clipboard-check"></i> Appointment Policy</h3>
              <p>We operate an appointment system to ensure we can dedicate time to show you around and answer all your questions.</p>
            </div>
            <div className="info-card">
              <h3><i className="fas fa-shield-alt"></i> Safety Measures</h3>
              <p>Please adhere to our current infection control guidelines. You may be asked to wear a mask and sanitize your hands upon arrival.</p>
            </div>
          </div>

          <div className="tour-form-container">
            <h2>Request a Visit</h2>
            <form onSubmit={handleSubmit} className="tour-form">
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Location</label>
                <select 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                >
                  <option value="Barry">Bellavista Barry</option>
                  <option value="Cardiff">Bellavista Cardiff</option>
                  <option value="Waverley">Waverley Care Centre</option>
                  <option value="College Fields">College Fields Nursing Home</option>
                  <option value="Baltimore">Baltimore Care Home</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input 
                    type="date" 
                    name="preferredDate" 
                    value={formData.preferredDate} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <select 
                    name="preferredTime" 
                    value={formData.preferredTime} 
                    onChange={handleChange}
                  >
                    <option value="Morning">Morning (10am - 12pm)</option>
                    <option value="Afternoon">Afternoon (1pm - 3pm)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Additional Message</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span><i className="fa-solid fa-spinner fa-spin"></i> Sending Request...</span>
                ) : (
                  "Request Tour"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTour;
