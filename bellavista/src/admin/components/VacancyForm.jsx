import React, { useState, useEffect } from 'react';

const VacancyForm = ({ mode = 'add', initialData = null, onCancel, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    location: '',
    salary: '',
    type: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        title: initialData.title || '',
        shortDescription: initialData.shortDescription || '',
        detailedDescription: initialData.detailedDescription || '',
        location: initialData.location || '',
        salary: initialData.salary || '',
        type: initialData.type || '',
        image: initialData.image || null
      });
      if (initialData.image && typeof initialData.image === 'string') {
        setPreviewImage(initialData.image);
      }
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{mode === 'add' ? 'Add New Vacancy' : 'Edit Vacancy'}</h2>
        <button className="btn ghost" onClick={onCancel}>
          <i className="fa-solid fa-times"></i> Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Job Title (Heading)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Senior Care Assistant"
          />
        </div>

        <div className="form-group">
          <label>Image (Optional)</label>
          <div className="image-upload-preview">
            {previewImage && (
              <div className="preview-container">
                <img src={previewImage} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }} />
                <button 
                  type="button" 
                  className="btn small danger"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData(prev => ({ ...prev, image: null }));
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            {!previewImage && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Short Description (For Card)</label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            placeholder="Brief overview of the role..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Detailed Description (For Modal)</label>
          <textarea
            name="detailedDescription"
            value={formData.detailedDescription}
            onChange={handleChange}
            required
            placeholder="Full details of the role, responsibilities, etc..."
            rows={8}
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>Location (Optional)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Cardiff"
            />
          </div>
          <div className="form-group half">
            <label>Salary (Optional)</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. £12.50/hr"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Job Type (Optional)</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Type...</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Bank">Bank</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div className="form-actions">
          {mode === 'edit' && (
            <button type="button" className="btn danger" onClick={onDelete}>
              <i className="fa-solid fa-trash"></i> Delete Vacancy
            </button>
          )}
          <div className="right-actions">
            <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary">
              <i className="fa-solid fa-save"></i> Save Vacancy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VacancyForm;
