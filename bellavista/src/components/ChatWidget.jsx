import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="chat-widget" ref={widgetRef}>
      <div className="chat-button" onClick={toggleChat}>
        <i className="fas fa-comments"></i>
        <div className="chat-tooltip">Ask a Question</div>
      </div>
      <div className={`chat-popup ${isOpen ? 'active' : ''}`}>
        <div className="chat-header">
          <h4>How can we help you?</h4>
          <button className="chat-close" onClick={toggleChat}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="chat-options">
          <Link to="/enquiry" className="chat-option">
            <i className="fas fa-heart"></i>
            <span>Care Enquiry</span>
          </Link>
          <Link to="/schedule-tour" className="chat-option">
            <i className="fas fa-calendar"></i>
            <span>Schedule Tour</span>
          </Link>
          <Link to="/contact" className="chat-option">
            <i className="fas fa-phone"></i>
            <span>Call Us</span>
          </Link>
          <Link to="/faq" className="chat-option">
            <i className="fas fa-question-circle"></i>
            <span>FAQ</span>
          </Link>
          <Link to="/contact" className="chat-option emergency">
            <i className="fas fa-ambulance"></i>
            <span>Emergency</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
