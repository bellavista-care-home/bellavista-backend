import React, { useState } from 'react';
import '../styles/ReviewForm.css';

const ReviewForm = ({ locationName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    console.log('Review submitted:', { ...formData, rating, location: locationName });
    setSubmitted(true);
    // Reset form after delay or keep success message
    setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', review: '' });
        setRating(0);
    }, 5000);
  };

  return (
    <div className="review-form-container">
      <h3>Write a Review for {locationName || 'Bellavista'}</h3>
      {submitted ? (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <p>Thank you for your review! It has been submitted for approval.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-input">
            <label>Your Rating:</label>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={ratingValue <= (hover || rating) ? "on" : "off"}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <span className="star">&#9733;</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your Name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Your Email"
            />
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea 
              required 
              value={formData.review}
              onChange={(e) => setFormData({...formData, review: e.target.value})}
              placeholder="Share your experience..."
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="submit-review-btn">Submit Review</button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;