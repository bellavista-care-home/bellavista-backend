import React from 'react';
import '../styles/Testimonials.css';
import ReviewForm from '../components/ReviewForm';

const Testimonials = () => {
  const reviews = [
    {
      text: "Bellavista Nursing Home is an established and trusted Nursing Care provider in South Wales area, reputed for its friendly, warm, caring and relaxed environment 'A Home from home'.",
      author: "Bellavista Group",
      role: "Our Philosophy"
    },
    {
      text: "At the Waverley we know that little things make all the difference to our lives – a smiling face in the morning, a trip outside when the sun is shining, staff who have time to stop and chat. In short, a home where we go the extra mile to ensure the comfort and happiness of our residents.",
      author: "Waverley Care Centre",
      role: "Care Team"
    },
    {
      text: "Home is highly recommended by residents and relatives alike, our homes provide a safe, comfortable and stimulating environment that enable our highly trained staff to provide the best possible care.",
      author: "Relative",
      role: "Testimonial"
    },
    {
      text: "The atmosphere at Baltimore House is warm and friendly so you are more than welcome to arrange to have a look around if you or your loved one is looking for care.",
      author: "Baltimore House",
      role: "Visitor"
    }
  ];

  return (
    <div className="testimonials-page">
      <div className="testimonials-header">
        <div className="container">
          <h1>Testimonials</h1>
          <p>What our residents and their families say about us</p>
        </div>
      </div>

      <div className="container">
        <div className="testimonials-grid">
          {reviews.map((review, index) => (
            <div key={index} className="testimonial-card">
              <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
              <p className="review-text">{review.text}</p>
              <div className="review-author">
                <h4>{review.author}</h4>
                <span>{review.role}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="carehome-review-badge">
          <h3>Top Rated Care Home</h3>
          <p>We are proud to be recognized as a leading care provider in South Wales.</p>
          <div className="stars">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
          </div>
        </div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ReviewForm locationName="Bellavista Nursing Homes" />
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
