import React, { useState, useRef } from 'react';
import '../styles/Careers.css';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState('');
  const formRef = useRef(null);

  const handleApplyClick = (jobTitle) => {
    setSelectedJob(jobTitle);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const jobs = [
    {
      title: 'Registered Mental Health Nurse (RMN)',
      location: 'Cardiff & Barry',
      type: 'Full-time, Permanent',
      salary: '£19.00+ per hour (Depending on experience)',
      description: 'We are currently recruiting for experienced Registered Mental Health Nurses. You will be leading and co-ordinating the shift, providing advice and support to a team of care staff.',
      requirements: [
        'Registered Nurse (Mental Health) with Valid NMC Registration',
        'Recent experience in mental health/dementia setting',
        'Excellent communication skills'
      ]
    },
    {
      title: 'Band 5 Nurse',
      location: 'Penarth, Barry & Cardiff',
      type: 'Permanent / Full Time',
      salary: '£28,080 - £37,440 Per Annum',
      description: 'Working towards NMC full registration. We offer consistent support, training and professional development.',
      requirements: [
        'Nursing qualification',
        'Commitment to high-quality care',
        'Team working skills'
      ]
    },
    {
      title: 'Activities Coordinator',
      location: 'Cardiff',
      type: 'Full Time / Permanent',
      salary: 'Competitive',
      description: 'Co-ordinate daily activities for individual residents, ensuring activities are flexible and varied to suit all capabilities.',
      requirements: [
        'Friendly, kind and reassuring nature',
        'Excellent communication skills',
        'Creativity and organizational skills'
      ]
    },
    {
      title: 'Care Assistant',
      location: 'Barry & College Fields',
      type: 'Full Time (40 Hr)',
      salary: 'Competitive',
      description: 'Reporting to Home Manager/Deputy Manager. delivering high standards of person-centred care.',
      requirements: [
        'Caring and dedicated attitude',
        'Willingness to learn',
        'Reliability'
      ]
    }
  ];

  return (
    <div className="careers-page">
      <div className="careers-header">
        <div className="container">
          <h1>Careers at Bellavista</h1>
          <p>We are looking for the best, and we will bring out the best in you</p>
        </div>
      </div>

      <div className="container">
        <div className="careers-intro">
          <h2>Join Our Team</h2>
          <p>
            We are committed to delivering the highest standards of person-centred care and striving for excellence to enrich the lives of our residents. 
            As a family-run business, our values are very important to us and we are always looking for caring and dedicated people to join our wonderful teams.
          </p>
          <p>
            If you want a fulfilling role, explore our range of exciting opportunities and see how our clear career ladder, benefits packages, 
            and impressive learning and development programmes will help your career flourish.
          </p>
        </div>

        <div className="jobs-grid">
          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3>{job.title}</h3>
              <div className="job-meta">
                <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                <span><i className="fas fa-clock"></i> {job.type}</span>
                <span><i className="fas fa-pound-sign"></i> {job.salary}</span>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="job-requirements">
                <h4>Requirements:</h4>
                <ul>
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
              <button className="apply-btn" onClick={() => handleApplyClick(job.title)}>Apply Now</button>
            </div>
          ))}
        </div>

        <div className="recruitment-contact" ref={formRef}>
          <h3>Apply Now</h3>
          <p>Please complete the form below to apply. Your application will be prepared in your default email client.</p>
          
          <form className="application-form" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const position = formData.get('position');
            const message = formData.get('message');
            try {
              const application = {
                id: `${Date.now()}`,
                name,
                phone,
                position,
                message,
                createdAt: new Date().toISOString(),
                status: 'submitted'
              };
              const key = 'career_applications';
              const existing = JSON.parse(localStorage.getItem(key) || '[]');
              localStorage.setItem(key, JSON.stringify([application, ...existing]));
            } catch {}
            const subject = `Job Application: ${position} - ${name}`;
            const body = `Name: ${name}%0D%0APhone: ${phone}%0D%0APosition: ${position}%0D%0AMessage: ${message}%0D%0A%0D%0APlease attach your CV to this email.`;
            window.location.href = `mailto:admin@bellavistanursinghome.com?subject=${encodeURIComponent(subject)}&body=${body}`;
          }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" required placeholder="Your Full Name" />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" required placeholder="Your Phone Number" />
            </div>
            
            <div className="form-group">
              <label>Position Applied For</label>
              <input 
                type="text" 
                name="position" 
                required 
                placeholder="e.g. Registered Nurse" 
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Cover Message</label>
              <textarea name="message" rows="5" placeholder="Tell us why you're a good fit..."></textarea>
            </div>
            
            <div className="form-note">
              <p><i className="fas fa-info-circle"></i> Clicking "Send Application" will open your email client. Please remember to attach your CV before sending.</p>
            </div>
            
            <button type="submit" className="submit-application-btn">Send Application</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Careers;
