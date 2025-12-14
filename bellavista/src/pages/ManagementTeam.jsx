import React from 'react';
import '../styles/ManagementTeam.css';

const ManagementTeam = () => {
  const team = [
    {
      name: "Helen Randall",
      role: "Home Manager",
      description: "Dedicated to ensuring the highest standards of care and operational excellence across our homes."
    },
    {
      name: "Emma Pinnell",
      role: "Deputy Manager",
      description: "Supporting the management team and staff to deliver person-centred care to all residents."
    },
    {
      name: "Bellavista Directors",
      role: "Directors",
      description: "As a family-owned business, the directors are fully involved in the daily management and strategic direction of the homes."
    }
  ];

  return (
    <div className="team-page">
      <div className="team-header">
        <div className="container">
          <h1>Management Team</h1>
          <p>Meet the dedicated leaders behind Bellavista Nursing Home</p>
        </div>
      </div>

      <div className="container">
        <div className="team-intro">
          <p>
            Our management team are constantly working front of house and behind the scenes on ways to expand and improve our services. The Management team's roles continue to evolve on a daily basis, and we are a very busy team at Bellavista Nursing Home, however, we are very much one team – all working together to deliver the best care for our residents, and strong support for our staff 24 hours a day.
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <div className="member-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <h3>{member.name}</h3>
              <span className="member-role">{member.role}</span>
              <p>{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagementTeam;
