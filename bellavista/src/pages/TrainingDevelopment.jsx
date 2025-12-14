import React from 'react';
import '../styles/Training.css';

const TrainingDevelopment = () => {
  return (
    <div className="training-page">
      <div className="training-header">
        <div className="container">
          <h1>Training and Development</h1>
          <p>Committed to the continual learning and growth of our employees</p>
        </div>
      </div>

      <div className="container">
        <div className="training-intro">
          <p>
            Bellavista Nursing Home offers a wide range of learning and development opportunities. We encourage all our staff to develop their knowledge and skills and, if needed, acquire qualifications. Whether you join Bellavista Nursing Home as an experienced professional or are joining us as your first experience within the care sector, we are committed to the continual learning and development of our employees.
          </p>
          <p>
            We provide all employees with a thorough formal induction and ongoing training opportunities. Development of our staff is mapped through clearly defined career development pathways. At Bellavista Nursing Home, we believe the key to any role is building confidence in your own performance.
          </p>
        </div>

        <div className="training-content-grid">
          <div className="training-text">
            <h2>Our Comprehensive Programme</h2>
            <p>
              Our work can be challenging but immensely rewarding. In recognition of this, at Bellavista Nursing Home, we have developed a comprehensive training and development programme. Training helps staff build their knowledge and skills to perform their roles to the best of their abilities. No matter what your role is, you can progress your career in Bellavista Nursing Home.
            </p>
            <p>
              Whether you are a newcomer to care or an experienced professional, you need guidance and support to do so. If you are looking for a change in career and thinking of care as your path to the future after your studies, or are a Graduate Nurse looking to complete your preceptorship, or a Senior Carer looking to take the next step through our CHAP Programme, Bellavista Nursing Home will support you.
            </p>
            <p>
              The Training team are committed to getting the best out of the staff team and to developing a workforce who are committed to learn, stay, grow, and develop their career within care. We believe in developing skills in an individual which will make them capable of building a successful career in care. They provide continual training and support to team members, which covers all aspects of learning and development. As we do not believe in using external agencies for workforce, we encourage and support all our current staff team to attend our paid career development programmes along with work experiences.
            </p>
          </div>

          <div className="career-paths">
            <div className="program-card">
              <h3>Qualifications (QCF)</h3>
              <p>
                For someone who is starting their career in care, we offer QCF level-2 and QCF level-3 programmes as mandatory career development in line with Regulatory requirements. All Senior and Nursing Assistants would be expected to work towards QCF level-5 to develop their career into management.
              </p>
              <p>
                Along with that, we have a workforce who have completed QCF and NVQ in their own particular career paths like Management personnel, Senior Nurses, Activity Coordinators, Kitchen Assistants and Chefs, Housekeeping, Administration, Finances, and Accounting.
              </p>
            </div>
          </div>
        </div>

        <div className="training-topics">
          <h2>Training Topics</h2>
          <p>As part of your personal development all staff would be trained with the following:</p>
          <div className="training-list">
            <ul>
              <li>Dementia Friendly Care / Awareness</li>
              <li>Positive Behaviour Management</li>
              <li>Health and Safety (including Manual Handling)</li>
              <li>Infection Control</li>
              <li>Food Hygiene</li>
              <li>COSHH</li>
              <li>Fire Safety</li>
              <li>SOVA (Safeguarding of Vulnerable Adults)</li>
              <li>Oral Hygiene</li>
              <li>Personal Care</li>
              <li>Nail Care</li>
              <li>Care Plans</li>
              <li>Fundamentals of Care</li>
              <li>Diet and Nutrition</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDevelopment;
