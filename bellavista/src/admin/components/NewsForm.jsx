import React, { useState, useRef } from 'react';
import EnhancedImageUploader, { ImageCropper } from '../../components/EnhancedImageUploader';

const NewsForm = ({ mode = 'add', initialData = null, onCancel, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    // Main Card Section
    title: '',
    mainImage: '',
    shortDescription: '',
    date: '',
    location: 'All Locations',
    category: 'events',
    important: false,
    badge: '',
    
    // Detailed Content Section
    fullDescription: '',
    galleryImages: [],
    videos: [],
    videoDescription: '',
    author: 'Bellavista Team'
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [croppingImageIndex, setCroppingImageIndex] = useState(null);
  const videoInputRef = useRef(null);

  // Load initial data if in edit mode
  React.useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        ...formData,
        ...initialData,
        mainImage: initialData.image || '',
        shortDescription: initialData.excerpt || '',
        galleryImages: initialData.gallery || [],
        videos: initialData.videoUrl ? [{ url: initialData.videoUrl, type: 'external' }] : [],
        videoDescription: initialData.videoDescription || ''
      });
    }
  }, [mode, initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMainImageSelect = (imageUrl) => {
    handleChange('mainImage', imageUrl);
  };

  const handleGalleryImageSelect = (imageUrl) => {
    // Add new image
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, imageUrl]
    }));
  };

  const handleRecropComplete = (imageUrl) => {
    if (croppingImageIndex !== null) {
      setFormData(prev => ({
        ...prev,
        galleryImages: prev.galleryImages.map((img, i) => i === croppingImageIndex ? imageUrl : img)
      }));
      setCroppingImageIndex(null);
      setEditingImageIndex(null);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
    setEditingImageIndex(null);
  };

  const addVideo = (videoUrl, videoType = 'external') => {
    if (videoUrl.trim()) {
      // Currently backend only supports one video URL, so we replace it or treat as list
      // For now, we'll keep the list structure but backend only saves the first one
      setFormData(prev => ({
        ...prev,
        videos: [{ url: videoUrl.trim(), type: videoType }] 
      }));
    }
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const progressKey = `${type}_${Date.now()}`;
    setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(prev => ({ ...prev, [progressKey]: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        if (type === 'video') {
          addVideo(data.url, 'uploaded');
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[progressKey];
        return newProgress;
      });
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return false;
    }
    if (!formData.shortDescription.trim()) {
      alert('Please enter a short description');
      return false;
    }
    if (!formData.date) {
      alert('Please select a date');
      return false;
    }
    if (!formData.mainImage) {
      alert('Please upload a main image');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const payload = {
        ...formData,
        image: formData.mainImage,
        excerpt: formData.shortDescription,
        gallery: formData.galleryImages,
        videoUrl: formData.videos.length > 0 ? formData.videos[0].url : '',
        videoDescription: formData.videoDescription
      };
      
      if (onSave) {
        onSave(payload);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      if (onDelete) onDelete(initialData.id);
    }
  };

  const locations = [
    'All Locations',
    'Bellavista Cardiff',
    'Bellavista Barry', 
    'Waverley Care Centre',
    'College Fields Nursing Home',
    'Baltimore Care Home',
    'Meadow Vale Cwtch'
  ];

  const categories = [
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' },
    { value: 'awards', label: 'Awards' },
    { value: 'innovation', label: 'Innovation' },
    { value: 'health-updates', label: 'Health Updates' },
    { value: 'activities', label: 'Activities' },
    { value: 'announcements', label: 'Announcements' }
  ];

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>{mode === 'add' ? 'Add News' : 'Update News'}</h2>
          <p className="muted">Create a news item with main card and detailed content sections</p>
        </div>
        {mode === 'edit' && (
          <button className="btn ghost" onClick={onCancel}>
            <i className="fa-solid fa-arrow-left"></i> Back to List
          </button>
        )}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'24px', height: 'calc(100vh - 200px)'}}>
        <div style={{overflowY: 'auto', paddingRight: '10px'}}>
          {/* Section 1: Main Card */}
          <div className="group-title" style={{ marginTop: '20px', marginBottom: '15px', color: '#2c5aa0', fontSize: '18px' }}>
            <i className="fa-solid fa-newspaper"></i> Main Card Section
          </div>
          <div className="grid cols-2">
            <div className="field">
              <label>Title *</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter news headline"
                style={{ fontWeight: 'bold' }}
              />
            </div>
            <div className="field">
              <label>Date *</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                style={{ fontFamily: 'monospace' }}
              />
            </div>
            <div className="field">
              <label>Location *</label>
              <select 
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Image with Standard Size */}
          <div className="field" style={{ marginTop: '15px' }}>
            <label>Main Card Image * (800×450px, 16:9 ratio)</label>
            <div style={{ 
              border: '2px dashed #ccc', 
              borderRadius: '8px', 
              padding: '20px', 
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              marginBottom: '10px'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  <i className="fa-solid fa-info-circle"></i> Standard size: 800×450px (16:9) - automatically resized
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  Accepted formats: JPG, PNG, WebP. Max size: 5MB
                </p>
              </div>
              
              <EnhancedImageUploader 
                label="Upload Main Image"
                aspectRatio={16/9}
                initialValue={formData.mainImage}
                onImageSelected={handleMainImageSelect}
                showCrop={true}
                allowSkipOnUpload={true}
              />
            </div>
          </div>

          <div className="field">
            <label>Short Description * (Max 180 characters)</label>
            <textarea 
              value={formData.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value.slice(0, 180))}
              placeholder="Brief description for the main card..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {formData.shortDescription.length}/180 characters
            </div>
          </div>

          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              checked={formData.important}
              onChange={(e) => handleChange('important', e.target.checked)}
              style={{ width: 'auto', margin: 0 }}
            />
            <span>Mark as Important (will be highlighted on main page)</span>
          </div>

          {/* Section 2: Detailed Content */}
          <div className="group-title" style={{ marginTop: '40px', marginBottom: '15px', color: '#2c5aa0', fontSize: '18px' }}>
            <i className="fa-solid fa-align-left"></i> Detailed Content Section
          </div>

          <div className="field">
            <label>Full Description</label>
            <textarea 
              value={formData.fullDescription}
              onChange={(e) => handleChange('fullDescription', e.target.value)}
              placeholder="Detailed article content..."
              rows={8}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div className="field">
            <label>Author</label>
            <input 
              type="text" 
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="Article author"
            />
          </div>

          {/* Enhanced Gallery Images with Click-to-Edit */}
          <div className="field" style={{ marginTop: '20px' }}>
            <label>Gallery Images (1200×675px, 16:9 ratio)</label>
            <div style={{ 
              border: '2px dashed #e0e0e0', 
              borderRadius: '8px', 
              padding: '20px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  <i className="fa-solid fa-images"></i> Add multiple images to showcase the news story
                </p>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '15px' }}>
                  Click on an image to Remove or Recrop it.
                </p>
              </div>
              
              {/* Gallery Grid */}
              {formData.galleryImages.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: '15px', 
                  marginBottom: '20px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '10px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}>
                  {formData.galleryImages.map((image, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        position: 'relative', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transform: editingImageIndex === index ? 'scale(1.02)' : 'none',
                        zIndex: editingImageIndex === index ? 10 : 1,
                        outline: editingImageIndex === index ? '2px solid #2c5aa0' : 'none'
                      }}
                      onClick={() => setEditingImageIndex(index)}
                    >
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: '120px', 
                          objectFit: 'contain',
                          backgroundColor: '#f0f0f0',
                          borderBottom: '1px solid #eee',
                          opacity: editingImageIndex === index ? 0.6 : 1
                        }}
                      />
                      
                      {/* Options Overlay */}
                      {editingImageIndex === index && (
                        <div style={{ 
                          position: 'absolute', 
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex', 
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '10px',
                          background: 'rgba(0,0,0,0.4)'
                        }}>
                          <button 
                            className="btn small" 
                            style={{ 
                              background: '#2c5aa0',
                              border: 'none',
                              color: 'white',
                              width: '80%'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCroppingImageIndex(index);
                            }}
                          >
                            <i className="fa-solid fa-crop"></i> Recrop
                          </button>
                          <button 
                            className="btn small" 
                            style={{ 
                              background: '#ff4757',
                              border: 'none',
                              color: 'white',
                              width: '80%'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGalleryImage(index);
                            }}
                          >
                            <i className="fa-solid fa-trash"></i> Remove
                          </button>
                          <button 
                            className="btn ghost small"
                            style={{
                              color: 'white',
                              borderColor: 'white',
                              width: '80%'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingImageIndex(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add More Images Button */}
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <EnhancedImageUploader 
                  label="Add New Photo"
                  aspectRatio={16/9}
                  onImageSelected={(imageUrl) => handleGalleryImageSelect(imageUrl)}
                  autoReset={true}
                  allowSkipOnUpload={true}
                />
              </div>
            </div>
          </div>

          {/* Crop Modal for Gallery Images */}
          {croppingImageIndex !== null && (
            <ImageCropper
              imageUrl={formData.galleryImages[croppingImageIndex]}
              aspectRatio={16/9}
              onCropComplete={handleRecropComplete}
              onCancel={() => setCroppingImageIndex(null)}
            />
          )}

          {/* Enhanced Videos Section */}
          <div className="field" style={{ marginTop: '20px' }}>
            <label>Videos</label>
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '15px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input 
                  type="url" 
                  placeholder="Enter video URL (YouTube, Vimeo, or direct MP4)"
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addVideo(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button 
                  className="btn small" 
                  onClick={(e) => {
                    const input = e.target.previousElementSibling;
                    addVideo(input.value);
                    input.value = '';
                  }}
                >
                  <i className="fa-solid fa-plus"></i> Add
                </button>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <input 
                  ref={videoInputRef}
                  type="file" 
                  accept="video/*" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleFileUpload(file, 'video');
                    }
                  }}
                />
                <button 
                  className="btn ghost small" 
                  onClick={() => videoInputRef.current?.click()}
                >
                  <i className="fa-solid fa-upload"></i> Upload Video File
                </button>
              </div>

              {formData.videos.length > 0 && (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {formData.videos.map((video, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px', 
                      backgroundColor: 'white', 
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}>
                      <div style={{ 
                        width: '60px', 
                        height: '40px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="fa-solid fa-video" style={{ color: '#666' }}></i>
                      </div>
                      <div style={{ flex: 1, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {video.url}
                        <div style={{ fontSize: '10px', color: '#999' }}>
                          {video.type === 'uploaded' ? 'Uploaded' : 'External'}
                        </div>
                      </div>
                      <button 
                        className="btn ghost small"
                        onClick={() => removeVideo(index)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="field" style={{marginTop:'15px'}}>
                <label>Video Description</label>
                <textarea 
                  value={formData.videoDescription} 
                  onChange={e => handleChange('videoDescription', e.target.value)}
                  placeholder="Short description about the video..."
                  rows={2}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="toolbar" style={{ marginTop: '30px' }}>
            <div className="right"></div>
            {mode === 'edit' && (
              <>
                <button className="btn ghost" onClick={handleDelete} style={{ marginRight: '10px', color: 'red', borderColor: 'red' }}>
                  <i className="fa-solid fa-trash"></i> Delete News
                </button>
                <button className="btn ghost" onClick={onCancel} style={{ marginRight: '10px' }}>
                  <i className="fa-solid fa-times"></i> Cancel
                </button>
              </>
            )}
            <button className="btn" onClick={handleSubmit}>
              <i className={mode === 'add' ? "fa-solid fa-plus" : "fa-solid fa-save"}></i>
              {mode === 'add' ? ' Publish News' : ' Update News'}
            </button>
          </div>
        </div>
        
        <div style={{position:'sticky', top:'20px', alignSelf:'start', height: '100%', overflowY: 'auto'}}>
          <div style={{border:'1px solid #e0e0e0', borderRadius:'10px', overflow:'hidden', background:'white'}}>
            <div style={{padding:'12px', borderBottom:'1px solid #f0f0f0'}}>
              <h3 style={{margin:0, fontSize:'16px'}}>Live Preview</h3>
              <div className="muted" style={{fontSize:'12px'}}>Shows how this article will appear</div>
            </div>
            <div style={{padding:'12px', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto'}}>
              {formData.mainImage && (
                <div style={{width:'100%', aspectRatio:'16/9', background:`url(${formData.mainImage}) center/contain no-repeat`, backgroundColor: '#333', borderRadius:'8px', position:'relative'}}>
                  <div style={{position:'absolute', bottom:'4px', right:'4px', background:'rgba(0,0,0,0.7)', color:'white', fontSize:'10px', padding:'2px 6px', borderRadius:'3px'}}>800×450</div>
                </div>
              )}
              <h4 style={{margin:'12px 0 6px 0'}}>{formData.title || 'Title will appear here'}</h4>
              <div className="muted" style={{fontSize:'12px'}}>{formData.date || 'YYYY-MM-DD'} • {formData.location}</div>
              <div style={{marginTop:'10px', fontSize:'13px'}}>{formData.shortDescription || 'Short description preview...'}</div>
              {formData.galleryImages.length > 0 && (
                <div style={{marginTop:'12px'}}>
                  <div style={{display:'flex', gap:'8px', overflowX:'auto', padding:'6px', borderRadius:'8px', border:'1px solid #eee', background:'#fafafa'}}>
                    {formData.galleryImages.map((img, i) => (
                      <div key={i} style={{flex:'0 0 120px', height:'70px', borderRadius:'6px', overflow:'hidden', border:'1px solid #ddd', background:'#fff'}}>
                        <img src={img} alt={`Preview ${i+1}`} style={{width:'100%', height:'100%', objectFit:'contain'}} />
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:'10px', color:'#666', marginTop:'4px'}}>{formData.galleryImages.length} gallery image{formData.galleryImages.length !== 1 ? 's' : ''} in preview</div>
                </div>
              )}
              {formData.videos.length > 0 && (
                <div style={{marginTop:'12px', fontSize:'12px'}}>
                  <i className="fa-solid fa-video"></i> Video attached
                  {formData.videoDescription && (
                    <div style={{marginTop:'6px', fontStyle:'italic', color:'#666'}}>{formData.videoDescription}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsForm;
