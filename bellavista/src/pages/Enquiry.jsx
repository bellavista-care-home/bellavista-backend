import React, { useState } from 'react';
import '../styles/ScheduleTour.css';
import { sendEnquiryEmail, saveEnquiryLocal, saveEnquiryToAPI } from '../services/enquiryService';

const Enquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'General',
    location: 'Barry',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enquiry = {
      id: `${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      enquiryType: formData.enquiryType,
      location: formData.location,
      message: formData.message,
      createdAt: new Date().toISOString(),
      status: 'received'
    };
    try {
      await sendEnquiryEmail(enquiry);
    } catch {}
    let savedLocal = false;
    try {
      saveEnquiryLocal(enquiry);
      savedLocal = true;
    } catch {}
    try {
      await saveEnquiryToAPI(enquiry);
    } catch {}
    if (savedLocal) {
      alert('Thank you for your enquiry. We will get back to you as soon as possible.');
    } else {
      alert('We received your enquiry but could not save it locally.');
    }
    setFormData({
      name: '',
      email: '',
      phone: '',
      enquiryType: 'General',
      location: 'Barry',
      message: ''
    });
  };

  return (
    <div className="tour-page">
      <div className="tour-header">
        <div className="container">
          <h1>Make an Enquiry</h1>
          <p>We are here to help answer your questions about care and our homes</p>
        </div>
      </div>

      <div className="container">
        <div className="tour-content-grid">
          <div className="tour-info">
            <h2>How can we help?</h2>
            <div className="info-card">
              <h3><i className="fas fa-question-circle"></i> Care Advice</h3>
              <p>Our experienced team can offer guidance on the types of care available and funding options.</p>
            </div>
            <div className="info-card">
              <h3><i className="fas fa-phone-alt"></i> Direct Contact</h3>
              <p>Prefer to speak to someone? Call our main office on <strong>01446 743983</strong>.</p>
            </div>
            <div className="info-card">
              <h3><i className="fas fa-envelope-open-text"></i> Quick Response</h3>
              <p>We aim to respond to all online enquiries within 24 hours.</p>
            </div>
          </div>

          <div className="tour-form-container">
            <h2>Send us a Message</h2>
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
                <label>Enquiry Type</label>
                <select 
                  name="enquiryType" 
                  value={formData.enquiryType} 
                  onChange={handleChange}
                >
                  <option value="General">General Enquiry</option>
                  <option value="Care Availability">Care Availability</option>
                  <option value="Funding">Funding & Fees</option>
                  <option value="Recruitment">Recruitment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Related Home (if applicable)</label>
                <select 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                >
                  <option value="Any">Any / Not Sure</option>
                  <option value="Barry">Bellavista Barry</option>
                  <option value="Cardiff">Bellavista Cardiff</option>
                  <option value="Waverley">Waverley Care Centre</option>
                  <option value="College Fields">College Fields Nursing Home</option>
                  <option value="Baltimore">Baltimore Care Home</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Message</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">Send Enquiry</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
