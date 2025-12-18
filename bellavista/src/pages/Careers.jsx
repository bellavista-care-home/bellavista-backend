import React, { useState, useEffect } from 'react';
import { fetchVacancies, applyForJob } from '../services/vacancyService';
import '../styles/Careers.css';

const Careers = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVacancy, setSelectedVacancy] = useState(null); // For Read More
  const [applyingVacancy, setApplyingVacancy] = useState(null); // For Apply Form
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobRole: '',
    cv: null,
    marketingConsent: false,
    privacyConsent: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      const data = await fetchVacancies();
      setVacancies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (vacancy) => {
    setSelectedVacancy(vacancy);
  };

  const handleApply = (vacancy) => {
    setApplyingVacancy(vacancy);
    setFormData(prev => ({
      ...prev,
      jobRole: vacancy.title, // Pre-fill job role
      vacancyId: vacancy.id
    }));
    setFormSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      if (files[0] && files[0].size > 2 * 1024 * 1024) {
          alert("File size exceeds 2MB limit.");
          e.target.value = null; // Reset input
          return;
      }
      setFormData(prev => ({ ...prev, cv: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.privacyConsent) {
      alert("Please agree to the Privacy Policy.");
      return;
    }
    if (!formData.cv) {
      alert("Please upload your CV.");
      return;
    }

    setFormLoading(true);
    const data = new FormData();
    data.append('vacancyId', formData.vacancyId || (applyingVacancy ? applyingVacancy.id : ''));
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('jobRole', formData.jobRole);
    data.append('cv', formData.cv);
    data.append('marketingConsent', formData.marketingConsent);
    data.append('privacyConsent', formData.privacyConsent);

    try {
      await applyForJob(data);
      setFormSuccess(true);
      setTimeout(() => {
          setApplyingVacancy(null);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            jobRole: '',
            cv: null,
            marketingConsent: false,
            privacyConsent: false
          });
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

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

        {loading ? (
          <p style={{textAlign:'center'}}>Loading vacancies...</p>
        ) : (
          <div className="jobs-grid">
            {vacancies.length === 0 ? (
                <p style={{textAlign:'center', gridColumn:'1/-1'}}>No current vacancies. Please check back later.</p>
            ) : (
                vacancies.map((job) => (
                <div key={job.id} className="job-card">
                    <h3>{job.title}</h3>
                    {job.image && <img src={job.image} alt={job.title} style={{width:'100%', height:'200px', objectFit:'cover', borderRadius:'5px', marginBottom:'15px'}} />}
                    <div className="job-meta">
                    {job.location && <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>}
                    {job.type && <span><i className="fas fa-clock"></i> {job.type}</span>}
                    {job.salary && <span><i className="fas fa-pound-sign"></i> {job.salary}</span>}
                    </div>
                    <p className="job-description">{job.shortDescription}</p>
                    <div className="vacancy-actions">
                        <button className="read-more-btn" onClick={() => handleReadMore(job)}>Read More</button>
                        <button className="apply-btn" onClick={() => handleApply(job)}>Apply Now</button>
                    </div>
                </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* Read More Modal */}
      {selectedVacancy && (
        <div className="modal-overlay" onClick={() => setSelectedVacancy(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedVacancy.title}</h3>
              <button className="modal-close" onClick={() => setSelectedVacancy(null)}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedVacancy.image && (
                  <img src={selectedVacancy.image} alt={selectedVacancy.title} style={{width:'100%', height:'auto', maxHeight:'300px', objectFit:'cover', borderRadius:'5px', marginBottom:'20px'}} />
              )}
              <div className="job-meta" style={{marginBottom:'20px'}}>
                    {selectedVacancy.location && <span><i className="fas fa-map-marker-alt"></i> {selectedVacancy.location}</span>}
                    {selectedVacancy.type && <span><i className="fas fa-clock"></i> {selectedVacancy.type}</span>}
                    {selectedVacancy.salary && <span><i className="fas fa-pound-sign"></i> {selectedVacancy.salary}</span>}
              </div>
              <div dangerouslySetInnerHTML={{ __html: selectedVacancy.detailedDescription?.replace(/\n/g, '<br/>') }} />
            </div>
            <div className="modal-footer">
              <button className="apply-btn" onClick={() => { setSelectedVacancy(null); handleApply(selectedVacancy); }}>Apply Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyingVacancy && (
        <div className="modal-overlay" onClick={() => !formLoading && setApplyingVacancy(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Job Vacancy Application</h3>
              <button className="modal-close" onClick={() => !formLoading && setApplyingVacancy(null)} disabled={formLoading}>&times;</button>
            </div>
            <div className="modal-body">
              {formSuccess ? (
                  <div style={{textAlign:'center', padding:'40px'}}>
                      <i className="fas fa-check-circle" style={{fontSize:'4rem', color:'var(--primary-green)', marginBottom:'20px'}}></i>
                      <h3>Application Submitted!</h3>
                      <p>Thank you for applying. We will be in touch shortly.</p>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="application-form">
                    <div className="form-group">
                        <label>Your Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Your Surname</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Job Role</label>
                        <input type="text" name="jobRole" value={formData.jobRole} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Upload your CV</label>
                        <input type="file" name="cv" onChange={handleInputChange} accept=".doc,.docx,.txt,.rtf,.pdf,.wps,.odt" required />
                        <span className="file-hint">[Upload size limit 2Mb] [File format allowed: .doc|.docx|.txt|.rtf|.pdf|.wps|.odt]</span>
                    </div>
                    
                    <div className="checkbox-group" style={{marginTop:'20px', display:'flex', gap:'10px', alignItems:'start'}}>
                        <input type="checkbox" name="marketingConsent" checked={formData.marketingConsent} onChange={handleInputChange} id="marketing" style={{marginTop:'4px', width:'auto'}} />
                        <label htmlFor="marketing" style={{display:'inline', fontWeight:'normal'}}>I confirm that i would like to be kept up to date with future offers and sevices</label>
                    </div>
                    <div className="checkbox-group" style={{marginTop:'10px', display:'flex', gap:'10px', alignItems:'start'}}>
                        <input type="checkbox" name="privacyConsent" checked={formData.privacyConsent} onChange={handleInputChange} id="privacy" style={{marginTop:'4px', width:'auto'}} required />
                        <label htmlFor="privacy" style={{display:'inline', fontWeight:'normal'}}>I confirm that i have read and understood the Privacy Notice <a href="/privacy-policy" target="_blank">Privacy policy</a></label>
                    </div>

                    <button type="submit" className="submit-application-btn" style={{marginTop:'30px'}} disabled={formLoading}>
                        {formLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
