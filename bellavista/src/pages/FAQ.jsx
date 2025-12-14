import React, { useState } from 'react';
import '../styles/FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      question: "What are your visiting hours?",
      answer: "Visits generally take place between 10am and 3pm to ensure the normal running of the home and our residents' routines can be maintained. However, we try to be flexible where possible. Please contact the specific home to confirm."
    },
    {
      question: "Do I need to book an appointment to visit?",
      answer: "Yes, we operate an appointment system for visits to ensure the safety and comfort of all our residents. Please telephone the home directly to book a slot."
    },
    {
      question: "What types of care do you provide?",
      answer: "We provide a comprehensive range of care including Residential Care, Nursing Care, Dementia Care, Respite Care, Palliative Care, and care for those with Learning Disabilities. Specific services may vary by location."
    },
    {
      question: "Can I bring my own furniture?",
      answer: "We encourage residents to personalise their rooms with small items of furniture, pictures, and ornaments to make it feel like a home from home. Please discuss specific large items with the Home Manager."
    },
    {
      question: "What activities are available for residents?",
      answer: "We have dedicated Activity Coordinators who organize a varied programme of activities including arts and crafts, music therapy, community events, and outings. We tailor activities to individual interests and capabilities."
    },
    {
      question: "Do you offer respite care?",
      answer: "Yes, we offer respite care services which provide a crucial break for carers. This can be for planned breaks or in emergency circumstances, subject to availability."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-header">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Common questions about life at Bellavista Nursing Home</p>
        </div>
      </div>

      <div className="container">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="toggle-icon">
                  <i className={`fas ${activeIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
                </span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h3>Still have questions?</h3>
          <p>We are here to help. Please feel free to contact us directly.</p>
          <button className="contact-btn" onClick={() => window.location.href='/contact'}>Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
