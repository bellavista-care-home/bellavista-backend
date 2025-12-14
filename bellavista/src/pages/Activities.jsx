import React, { useState } from 'react';
import '../styles/Activities.css';

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const activities = [
    { title: 'Community Events', description: 'We regularly host community events like our famous Bollywood Night and Family Fun Days.', image: '/NewsImages/bollywood-night.jpg', details: 'Our community events bring together residents, families, and the local community for days of fun, food, and entertainment.' },
    { title: 'Holiday Celebrations', description: 'Every holiday is special at Bellavista, from Christmas to Remembrance Day, we celebrate together.', image: '/NewsImages/christmas-celebration-cardiff.jpg', details: 'We celebrate all major holidays with special meals, decorations, and themed activities to ensure everyone feels the festive spirit.' },
    { title: 'Trips & Outings', description: 'Residents enjoy trips to local attractions like St Fagans and the seaside.', image: '/NewsImages/st-fagans-trip.jpg', details: 'Regular outings are organized to local places of interest, museums, parks, and the seaside, providing stimulation and enjoyment.' },
    { title: 'Arts & Music', description: 'Creative sessions and music therapy are a core part of our wellness program.', image: '/NewsImages/school-coir-barry.jpg', details: 'Music and arts therapy sessions are held weekly, encouraging self-expression and providing therapeutic benefits.' },
    { title: 'Social Gatherings', description: 'Regular coffee mornings, tea parties, and social gatherings to keep spirits high.', image: '/NewsImages/roseday_celebration.jpg', details: 'Social interaction is key. We host coffee mornings, tea parties, and other social events to foster friendships.' },
    { title: 'Themed Days', description: 'We love dressing up and enjoying themed days with food, music, and decorations.', image: '/NewsImages/family-fun-day-waverley.jpg', details: 'From Hawaiian days to 1950s parties, our themed days are a hit with residents and staff alike.' }
  ];

  const handleCardClick = (activity) => {
    setSelectedActivity(activity);
  };

  const closeModal = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="activities-page">
      <div className="page-header">
        <div className="container">
          <h1>Activities & Wellness</h1>
          <p>Enriching lives through active engagement</p>
        </div>
      </div>

      <section className="activities-intro" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          
          {/* Hero Quote */}
          <div className="quote-wrapper" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontStyle: 'italic', 
              color: 'var(--color-primary)', 
              lineHeight: '1.4',
              fontWeight: '300',
              marginBottom: '20px'
            }}>
              “We provide a full and varied activity programme for all interests, there is always something to do…”
            </h2>
            <div style={{ width: '80px', height: '4px', background: 'var(--color-secondary)', margin: '0 auto', borderRadius: '2px' }}></div>
          </div>

          {/* Two Column Content */}
          <div className="content-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '50px',
            marginBottom: '60px'
          }}>
            
            {/* Left Column */}
            <div className="text-col">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ 
                  width: '40px', height: '40px', 
                  background: '#e3f2fd', 
                  borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: '15px',
                  color: 'var(--color-primary)'
                }}>
                  <i className="fas fa-heart"></i>
                </div>
                <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#333' }}>Therapeutic & Individual</h3>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#555' }}>
                Our Residents are offered encouragement to follow their individual interests and perhaps even develop new ones during their stay at Bellavista. Our activities are designed to be therapeutic, and our individualised personal pen pictures help us to achieve this. These are put together from the information gathered from your social wellbeing document and one-2-one time with our highly trained Activities Co-ordinators, we offer a wide range of activities, all of which are designed to meet individual needs.
              </p>
            </div>

            {/* Right Column */}
            <div className="text-col">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ 
                  width: '40px', height: '40px', 
                  background: '#fff3e0', 
                  borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: '15px',
                  color: 'var(--color-secondary)'
                }}>
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#333' }}>A Full Timetable</h3>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#555' }}>
                Our friendly activity organisers encourage a person to pursue their hobbies and interests. We have a full timetable of outside entertainment, seasonal fairs and events.
              </p>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="feature-banner" style={{ 
            background: 'linear-gradient(to right, #f8f9fa, #e9ecef)', 
            padding: '40px', 
            borderRadius: '15px',
            borderLeft: '5px solid var(--color-primary)'
          }}>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#444', margin: 0, textAlign: 'center' }}>
              Our range of activities are designed to cater for a wide range of interests, skills, experiences, personalities and medical conditions. Whether a person prefers to relax and reflect on life with one of our friendly team or chooses to pot and plant in our stimulating gardens, we provide the security and facilities to make it so.
            </p>
          </div>

        </div>
      </section>

      <section className="activities-list">
        <div className="container">
          <div className="activities-grid">
            {activities.map((activity, index) => (
              <div key={index} className="activity-card" onClick={() => handleCardClick(activity)}>
                <div className="activity-image">
                  <img src={activity.image} alt={activity.title} loading="lazy" />
                </div>
                <div className="activity-content">
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedActivity && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <img src={selectedActivity.image} alt={selectedActivity.title} />
            <h2>{selectedActivity.title}</h2>
            <p>{selectedActivity.details}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 600px;
          width: 90%;
          position: relative;
        }
        .modal-content img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .close-modal {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 30px;
          border: none;
          background: none;
          cursor: pointer;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Activities;
