import React from 'react';

const StaffPortal = () => {
  return (
    <div className="staff-portal-page" style={{ padding: '100px 0', textAlign: 'center', minHeight: '60vh' }}>
      <div className="container">
        <h1>Staff Portal</h1>
        <div className="construction-message" style={{ marginTop: '50px' }}>
          <i className="fas fa-tools" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '20px' }}></i>
          <h2>Under Maintenance</h2>
          <p>Modification work is going on for this page…</p>
          <p>Please check back later.</p>
        </div>
      </div>
    </div>
  );
};

export default StaffPortal;
