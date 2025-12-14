import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// EmailJS Setup Instructions:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template with variables: {{from_name}}, {{from_email}}, {{phone}}, {{tour_date}}, {{tour_time}}, {{location}}, {{notes}}
// 4. Replace the serviceId, templateId, and publicKey below with your actual EmailJS credentials
// 5. For production: Move these to environment variables (see .env.example)

const ScheduleTour = () => {
  // EmailJS configuration - Replace with your actual service details or environment variables
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tourDate: '',
    tourTime: '',
    homeLocation: '',
    notes: ''
  });

  // Get today's date for date picker minimum
  const today = new Date().toISOString().split('T')[0];
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration - Using environment variables for production
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration missing. Please check environment variables.');
      }

      // Prepare email data
      const emailData = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone,
        tour_date: formData.tourDate,
        tour_time: formData.tourTime,
        location: formData.homeLocation,
        notes: formData.notes || 'No additional notes',
        to_email: 'bellavistacarehomegit@gmail.com'
      };

      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, emailData, publicKey);

      setShowSuccess(true);
    } catch (error) {
      console.error('Email sending failed:', error);
      alert('Failed to send booking request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnHome = () => {
    navigate('/');
  };

  return (
    <section style={{ padding: '60px 0', background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="tour-container">
          {!showSuccess ? (
            <div>
              <h2 className="section-title">Schedule a Tour</h2>
              <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-medium)' }}>
                Book a personalized tour of our facilities and meet our caring staff.
              </p>

              <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Preferred Tour Date *</label>
                  <input
                    type="date"
                    name="tourDate"
                    className="form-control"
                    value={formData.tourDate}
                    onChange={handleInputChange}
                    min={today}
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Preferred Time *</label>
                  <select
                    name="tourTime"
                    className="form-control"
                    value={formData.tourTime}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                    required
                  >
                    <option value="">Select a time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Location *</label>
                  <select
                    name="homeLocation"
                    className="form-control"
                    value={formData.homeLocation}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                    required
                  >
                    <option value="">Select location</option>
                    <option value="cardiff">Cardiff</option>
                    <option value="barry">Barry</option>
                    <option value="waverley">Waverley</option>
                    <option value="college-fields">College Fields</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Notes</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    rows="3"
                    placeholder="Any specific requirements or questions..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px', resize: 'vertical' }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    marginTop: '20px',
                    background: isSubmitting ? '#ccc' : 'var(--gradient)',
                    color: 'white',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '30px',
                    fontWeight: '700',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <><i className="fas fa-spinner fa-spin"></i> Booking Tour...</>
                  ) : (
                    <><i className="fas fa-calendar-check"></i> Schedule Tour</>
                  )}
                </button>

                {isSubmitting && (
                  <div style={{
                    textAlign: 'center',
                    marginTop: '15px',
                    padding: '10px',
                    background: '#e3f2fd',
                    borderRadius: '5px',
                    color: '#1976d2',
                    fontSize: '14px'
                  }}>
                    ⏳ Processing your booking...
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="booking-success" style={{ textAlign: 'center', background: 'white', padding: '60px 40px', borderRadius: '15px', boxShadow: 'var(--shadow)', maxWidth: '500px', margin: '0 auto' }}>
              <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#28a745', marginBottom: '20px' }}></i>
              <h3>✅ Tour Scheduled Successfully!</h3>
              <p style={{ marginTop: '20px', fontSize: '16px' }}>📧 Confirmation email sent to bellavistacarehomegit@gmail.com</p>
              <p style={{ color: '#666' }}>We'll contact you within 24 hours to confirm details.</p>
              <button className="btn" onClick={returnHome} style={{ marginTop: '20px', background: 'linear-gradient(135deg, #28a745, #20c997)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '30px', fontWeight: '700' }}>
                🏠 Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScheduleTour;