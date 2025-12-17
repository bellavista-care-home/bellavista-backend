import React, { useState, useEffect } from 'react';
import EnhancedImageUploader from '../../components/EnhancedImageUploader';

const HomeForm = ({ mode = 'add', initialData = null, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    homeName: '',
    homeLocation: '',
    homeImage: '',
    homeBadge: '',
    homeDesc: '',
    heroTitle: '',
    heroSubtitle: '',
    heroBgImage: '',
    heroExpandedDesc: '',
    statsBedrooms: '',
    statsPremier: '',
    teamMembers: [],
    teamGalleryImages: [],
    activitiesIntro: '',
    activities: [],
    activityImages: [],
    activitiesModalDesc: '',
    facilitiesIntro: '',
    facilitiesList: [],
    detailedFacilities: [],
    facilitiesGalleryImages: [],
    homeFeatured: false
  });

  // Load initial data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        ...formData,
        ...initialData
      });
    }
  }, [mode, initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field, item) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const moveItem = (field, index, direction) => {
    const newArray = [...formData[field]];
    if (direction === 'up' && index > 0) {
      [newArray[index], newArray[index - 1]] = [newArray[index - 1], newArray[index]];
    } else if (direction === 'down' && index < newArray.length - 1) {
      [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
    }
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  // Local state for list inputs
  const [teamInput, setTeamInput] = useState({ name: '', role: '', image: '' });
  const [teamGalleryInput, setTeamGalleryInput] = useState({ type: 'image', url: '', cropMode: 'uncropped' });
  const [activityMediaInput, setActivityMediaInput] = useState({ type: 'image', url: '', cropMode: 'uncropped' });
  const [facilityMediaInput, setFacilityMediaInput] = useState({ type: 'image', url: '', cropMode: 'uncropped' });

  // Special handler for "Second Card Image" (which maps to activityImages[0])
  const handleSecondCardImageChange = (url) => {
    const currentImages = [...formData.activityImages];
    if (currentImages.length > 0) {
      if (typeof currentImages[0] === 'object') {
        currentImages[0] = { ...currentImages[0], url: url };
      } else {
        currentImages[0] = url;
      }
    } else {
      currentImages.push({ type: 'image', url: url });
    }
    setFormData(prev => ({ ...prev, activityImages: currentImages }));
  };

  const getSecondCardImage = () => {
    if (formData.activityImages.length > 0) {
      const item = formData.activityImages[0];
      return typeof item === 'object' ? item.url : item;
    }
    return '';
  };

  const copyListingJson = async () => {
    const id = (formData.homeName || 'home').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const name = formData.homeName || '';
    const location = formData.homeLocation || '';
    const description = formData.homeDesc || '';
    const images = [formData.homeImage, ...formData.activityImages].filter(Boolean).slice(0, 2);
    const features = [];
    if (formData.statsBedrooms) features.push(`${formData.statsBedrooms} Bedrooms`);
    if (formData.statsPremier) features.push(`${formData.statsPremier} Premier Rooms`);
    features.push(...(formData.facilitiesList || []).map(f => f.title).filter(Boolean));
    const link = `/${id}`;
    const payload = { id, name, location, description, features, images, link };
    const json = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      alert('Home listing JSON copied to clipboard');
    } catch {
      alert(json);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = async (file, field) => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('process_type', 'none');

      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const videoUrl = data.url; // Returns /uploads/filename.ext

      const newItem = { type: 'video', url: videoUrl };
      addItem(field, newItem);
      
      // Reset inputs
      if (field === 'facilitiesGalleryImages') setFacilityMediaInput(prev => ({ ...prev, url: '' }));
      if (field === 'activityImages') setActivityMediaInput(prev => ({ ...prev, url: '' }));
      if (field === 'teamGalleryImages') setTeamGalleryInput(prev => ({ ...prev, url: '' }));
      
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to render a Gallery Grid Item
  const GalleryItem = ({ item, index, total, field, label }) => {
    const isObj = typeof item === 'object';
    const url = isObj ? item.url : item;
    const type = isObj ? item.type : 'image';
    const cropMode = isObj ? item.cropMode : 'uncropped';

    return (
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          height: '140px',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {type === 'video' ? (
             <div style={{textAlign: 'center'}}>
               <i className="fa-solid fa-video" style={{fontSize: '32px', color: '#666', marginBottom: '5px'}}></i>
               <div style={{fontSize: '10px', color: '#666', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 auto'}}>{url}</div>
             </div>
          ) : (
             <img src={url} style={{width: '100%', height: '100%', objectFit: cropMode === 'cropped' ? 'cover' : 'contain', backgroundColor: '#333'}} alt="" />
          )}
          {label && (
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(44, 90, 160, 0.9)', color: 'white', fontSize: '10px', fontWeight: 'bold'}}>
              {label}
            </div>
          )}
        </div>
        <div style={{
          padding: '10px',
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'white'
        }}>
           <div style={{display: 'flex', gap: '4px'}}>
              <button className="btn ghost small icon-only" disabled={index === 0} onClick={() => moveItem(field, index, 'up')} title="Move Left/Up">
                 <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button className="btn ghost small icon-only" disabled={index === total - 1} onClick={() => moveItem(field, index, 'down')} title="Move Right/Down">
                 <i className="fa-solid fa-chevron-right"></i>
              </button>
           </div>
           <button className="btn ghost small icon-only" style={{color: '#ff4757', borderColor: '#ff4757'}} onClick={() => removeItem(field, index)} title="Remove">
              <i className="fa-solid fa-trash"></i>
           </button>
        </div>
      </div>
    );
  };

  return (
    <section className="panel">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <div>
          <h2>{mode === 'add' ? 'Add Home' : 'Update Home'}</h2>
          <p className="muted">{mode === 'add' ? 'Create a new Nursing Home card.' : `Editing ${initialData?.homeName || 'Home'}`}</p>
        </div>
        {mode === 'edit' && (
          <button className="btn ghost" onClick={onCancel}>
            <i className="fa-solid fa-arrow-left"></i> Back to List
          </button>
        )}
      </div>
      
      {/* 1. Basic Information (Read Only) */}
      <div className="group-title" style={{marginTop:'20px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-info-circle"></i> Basic Information
      </div>
      <div className="grid cols-2">
        <div className="field">
          <label>Home Name</label>
          <input 
            value={formData.homeName} 
            readOnly
            disabled
            type="text"
            style={{background: '#f5f5f5', color: '#666'}}
          />
        </div>
        <div className="field">
          <label>Location</label>
          <input 
            value={formData.homeLocation} 
            readOnly
            disabled
            type="text"
            style={{background: '#f5f5f5', color: '#666'}}
          />
        </div>
      </div>

      {/* 2. Card Images */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-image"></i> Card Images (Max 2)
      </div>
      <div className="grid cols-2">
        <div className="field">
          <EnhancedImageUploader 
            label="Card Image 1 (Main)" 
            aspectRatio={4/3}
            initialValue={formData.homeImage}
            onImageSelected={(url) => handleChange('homeImage', url)}
            showCrop={true}
            allowSkipOnUpload={true}
          />
        </div>
        <div className="field">
          <EnhancedImageUploader 
            label="Card Image 2" 
            aspectRatio={4/3}
            initialValue={getSecondCardImage()}
            onImageSelected={(url) => handleSecondCardImageChange(url)}
            showCrop={true}
            allowSkipOnUpload={true}
          />
          <small className="muted" style={{display:'block', marginTop:'5px'}}>
            *This image is also the first item in the Activities Gallery.
          </small>
        </div>
      </div>

      {/* 3. Facilities */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-building"></i> Facilities Gallery
      </div>
      <div className="field">
         <label>Add Facility Media</label>
         <div style={{
           border: '2px dashed #e0e0e0',
           borderRadius: '8px',
           padding: '20px',
           backgroundColor: '#fafafa',
           marginBottom: '20px'
         }}>
           <div style={{marginBottom:'15px'}}>
             <label style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block'}}>Media Type</label>
             <div style={{display: 'flex', gap: '15px'}}>
               <label style={{
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '8px', 
                 cursor: 'pointer',
                 padding: '8px 16px',
                 background: facilityMediaInput.type === 'image' ? '#e6f7ff' : 'white',
                 border: `1px solid ${facilityMediaInput.type === 'image' ? '#1890ff' : '#d9d9d9'}`,
                 borderRadius: '4px'
               }}>
                 <input 
                   type="radio" 
                   name="facilityMediaType" 
                   value="image"
                   checked={facilityMediaInput.type === 'image'}
                   onChange={() => setFacilityMediaInput({...facilityMediaInput, type: 'image'})}
                   style={{cursor: 'pointer'}}
                 />
                 <span><i className="fa-solid fa-image"></i> Image</span>
               </label>
               <label style={{
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '8px', 
                 cursor: 'pointer',
                 padding: '8px 16px',
                 background: facilityMediaInput.type === 'video' ? '#e6f7ff' : 'white',
                 border: `1px solid ${facilityMediaInput.type === 'video' ? '#1890ff' : '#d9d9d9'}`,
                 borderRadius: '4px'
               }}>
                 <input 
                   type="radio" 
                   name="facilityMediaType" 
                   value="video"
                   checked={facilityMediaInput.type === 'video'}
                   onChange={() => setFacilityMediaInput({...facilityMediaInput, type: 'video'})}
                   style={{cursor: 'pointer'}}
                 />
                 <span><i className="fa-solid fa-video"></i> Video</span>
              </label>
            </div>
          </div>
          
          {facilityMediaInput.type === 'image' && (
            <div style={{marginBottom:'15px'}}>
              <label style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block'}}>Display Mode</label>
              <div style={{display: 'flex', gap: '15px'}}>
                <label style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  padding: '8px 16px',
                  background: facilityMediaInput.cropMode === 'uncropped' ? '#e6f7ff' : 'white',
                  border: `1px solid ${facilityMediaInput.cropMode === 'uncropped' ? '#1890ff' : '#d9d9d9'}`,
                  borderRadius: '4px'
                }}>
                  <input 
                    type="radio" 
                    name="facilityDisplayMode" 
                    value="uncropped"
                    checked={facilityMediaInput.cropMode === 'uncropped'}
                    onChange={() => setFacilityMediaInput({...facilityMediaInput, cropMode: 'uncropped'})}
                    style={{cursor: 'pointer'}}
                  />
                  <span>Uncropped (Fit)</span>
                </label>
                <label style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  padding: '8px 16px',
                  background: facilityMediaInput.cropMode === 'cropped' ? '#e6f7ff' : 'white',
                  border: `1px solid ${facilityMediaInput.cropMode === 'cropped' ? '#1890ff' : '#d9d9d9'}`,
                  borderRadius: '4px'
                }}>
                  <input 
                    type="radio" 
                    name="facilityDisplayMode" 
                    value="cropped"
                    checked={facilityMediaInput.cropMode === 'cropped'}
                    onChange={() => setFacilityMediaInput({...facilityMediaInput, cropMode: 'cropped'})}
                    style={{cursor: 'pointer'}}
                  />
                  <span>Cropped (Fill)</span>
                </label>
              </div>
            </div>
          )}

          {facilityMediaInput.type === 'video' ? (
             <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
               <div style={{display: 'flex', gap: '10px'}}>
                  <input 
                    type="text" 
                    placeholder="Paste Video URL (YouTube/Vimeo)..."
                    value={facilityMediaInput.url}
                    onChange={e => setFacilityMediaInput({...facilityMediaInput, url: e.target.value})}
                    style={{flex:1}}
                  />
                  <button className="btn" onClick={() => {
                    if(facilityMediaInput.url) { 
                      const newItem = { type: facilityMediaInput.type, url: facilityMediaInput.url };
                      addItem('facilitiesGalleryImages', newItem);
                      setFacilityMediaInput({...facilityMediaInput, url: ''});
                    }
                  }}><i className="fa-solid fa-plus"></i> Add URL</button>
               </div>
               
               <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: 'white', borderRadius: '4px', border: '1px solid #eee'}}>
                 <input
                    type="file"
                    accept="video/*"
                    id="facility-video-upload"
                    style={{display: 'none'}}
                    onChange={(e) => handleVideoUpload(e.target.files[0], 'facilitiesGalleryImages')}
                 />
                 <button 
                    className="btn ghost" 
                    onClick={() => document.getElementById('facility-video-upload').click()}
                    disabled={isUploading}
                 >
                    {isUploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-upload"></i>} Upload Video File
                 </button>
                 <span className="muted" style={{fontSize: '12px'}}>Supports MP4, WebM (Max 50MB)</span>
               </div>
             </div>
           ) : (
              <EnhancedImageUploader
                label=""
                aspectRatio={16/9}
                onImageSelected={(url) => {
                   if (url) addItem('facilitiesGalleryImages', { type: 'image', url, cropMode: facilityMediaInput.cropMode });
                }}
                autoReset={true}
                allowSkipOnUpload={true}
                showCrop={true}
              />
           )}
         </div>
         
         {formData.facilitiesGalleryImages.length > 0 && (
           <>
            <label style={{marginBottom: '10px', display: 'block'}}>{formData.facilitiesGalleryImages.length} Items in Gallery</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {formData.facilitiesGalleryImages.map((item, i) => (
                <GalleryItem 
                  key={i} 
                  item={item} 
                  index={i} 
                  total={formData.facilitiesGalleryImages.length} 
                  field="facilitiesGalleryImages" 
                />
              ))}
            </div>
           </>
         )}
      </div>

      {/* 4. Activities */}
      <div className="group-title" style={{marginTop:'40px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-person-running"></i> Activities Gallery
      </div>
      <div className="field">
        <label>Add Activity Media</label>
        <div style={{
           border: '2px dashed #e0e0e0',
           borderRadius: '8px',
           padding: '20px',
           backgroundColor: '#fafafa',
           marginBottom: '20px'
         }}>
          <div style={{marginBottom:'15px'}}>
            <label style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block'}}>Media Type</label>
            <div style={{display: 'flex', gap: '15px'}}>
              <label style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '8px 16px',
                background: activityMediaInput.type === 'image' ? '#e6f7ff' : 'white',
                border: `1px solid ${activityMediaInput.type === 'image' ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '4px'
              }}>
                <input 
                  type="radio" 
                  name="activityMediaType" 
                  value="image"
                  checked={activityMediaInput.type === 'image'}
                  onChange={() => setActivityMediaInput({...activityMediaInput, type: 'image'})}
                  style={{cursor: 'pointer'}}
                />
                <span><i className="fa-solid fa-image"></i> Image</span>
              </label>
              <label style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '8px 16px',
                background: activityMediaInput.type === 'video' ? '#e6f7ff' : 'white',
                border: `1px solid ${activityMediaInput.type === 'video' ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '4px'
              }}>
                <input 
                  type="radio" 
                  name="activityMediaType" 
                  value="video"
                  checked={activityMediaInput.type === 'video'}
                  onChange={() => setActivityMediaInput({...activityMediaInput, type: 'video'})}
                  style={{cursor: 'pointer'}}
                />
                <span><i className="fa-solid fa-video"></i> Video</span>
              </label>
            </div>
          </div>
          
          {activityMediaInput.type === 'video' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={{display: 'flex', gap: '10px'}}>
                <input 
                   type="text" 
                   placeholder="Paste Video URL (YouTube/MP4)..."
                   value={activityMediaInput.url}
                   onChange={e => setActivityMediaInput({...activityMediaInput, url: e.target.value})}
                   style={{flex:1}}
                />
                <button className="btn" onClick={() => {
                  if(activityMediaInput.url) { 
                    const newItem = { type: activityMediaInput.type, url: activityMediaInput.url };
                    addItem('activityImages', newItem);
                    setActivityMediaInput({...activityMediaInput, url: ''});
                  }
                }}><i className="fa-solid fa-plus"></i> Add URL</button>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: 'white', borderRadius: '4px', border: '1px solid #eee'}}>
                <input
                   type="file"
                   accept="video/*"
                   id="activity-video-upload"
                   style={{display: 'none'}}
                   onChange={(e) => handleVideoUpload(e.target.files[0], 'activityImages')}
                />
                <button 
                   className="btn ghost" 
                   onClick={() => document.getElementById('activity-video-upload').click()}
                   disabled={isUploading}
                >
                   {isUploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-upload"></i>} Upload Video File
                </button>
                <span className="muted" style={{fontSize: '12px'}}>Supports MP4, WebM (Max 50MB)</span>
              </div>
            </div>
          ) : (
            <EnhancedImageUploader
               label=""
               aspectRatio={16/9}
               onImageSelected={(url) => {
                  if (url) addItem('activityImages', { type: 'image', url, cropMode: activityMediaInput.cropMode });
               }}
               autoReset={true}
               allowSkipOnUpload={true}
               showCrop={true}
             />
          )}
        </div>
        
        {formData.activityImages.length > 0 && (
           <>
            <label style={{marginBottom: '10px', display: 'block'}}>{formData.activityImages.length} Items in Gallery</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {formData.activityImages.map((item, i) => (
                <GalleryItem 
                  key={i} 
                  item={item} 
                  index={i} 
                  total={formData.activityImages.length} 
                  field="activityImages"
                  label={i === 0 ? 'Main Card' : null}
                />
              ))}
            </div>
           </>
         )}
      </div>

      {/* 5. Meet My Team (Gallery) */}
      <div className="group-title" style={{marginTop:'40px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-users"></i> Meet My Team (Gallery)
      </div>
      <div className="field">
        <label>Add Team Gallery Media</label>
        <div style={{
           border: '2px dashed #e0e0e0',
           borderRadius: '8px',
           padding: '20px',
           backgroundColor: '#fafafa',
           marginBottom: '20px'
         }}>
          <div style={{marginBottom:'15px'}}>
            <label style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block'}}>Media Type</label>
            <div style={{display: 'flex', gap: '15px'}}>
              <label style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '8px 16px',
                background: teamGalleryInput.type === 'image' ? '#e6f7ff' : 'white',
                border: `1px solid ${teamGalleryInput.type === 'image' ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '4px'
              }}>
                <input 
                  type="radio" 
                  name="teamMediaType" 
                  value="image"
                  checked={teamGalleryInput.type === 'image'}
                  onChange={() => setTeamGalleryInput({...teamGalleryInput, type: 'image'})}
                  style={{cursor: 'pointer'}}
                />
                <span><i className="fa-solid fa-image"></i> Image</span>
              </label>
              <label style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '8px 16px',
                background: teamGalleryInput.type === 'video' ? '#e6f7ff' : 'white',
                border: `1px solid ${teamGalleryInput.type === 'video' ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '4px'
              }}>
                <input 
                  type="radio" 
                  name="teamMediaType" 
                  value="video"
                  checked={teamGalleryInput.type === 'video'}
                  onChange={() => setTeamGalleryInput({...teamGalleryInput, type: 'video'})}
                  style={{cursor: 'pointer'}}
                />
                <span><i className="fa-solid fa-video"></i> Video</span>
              </label>
            </div>
          </div>
          
          {teamGalleryInput.type === 'image' && (
            <div style={{marginBottom:'15px'}}>
              <label style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block'}}>Display Mode</label>
              <div style={{display: 'flex', gap: '15px'}}>
                <label style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  padding: '8px 16px',
                  background: teamGalleryInput.cropMode === 'uncropped' ? '#e6f7ff' : 'white',
                  border: `1px solid ${teamGalleryInput.cropMode === 'uncropped' ? '#1890ff' : '#d9d9d9'}`,
                  borderRadius: '4px'
                }}>
                  <input 
                    type="radio" 
                    name="teamDisplayMode" 
                    value="uncropped"
                    checked={teamGalleryInput.cropMode === 'uncropped'}
                    onChange={() => setTeamGalleryInput({...teamGalleryInput, cropMode: 'uncropped'})}
                    style={{cursor: 'pointer'}}
                  />
                  <span>Uncropped (Fit)</span>
                </label>
                <label style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  padding: '8px 16px',
                  background: teamGalleryInput.cropMode === 'cropped' ? '#e6f7ff' : 'white',
                  border: `1px solid ${teamGalleryInput.cropMode === 'cropped' ? '#1890ff' : '#d9d9d9'}`,
                  borderRadius: '4px'
                }}>
                  <input 
                    type="radio" 
                    name="teamDisplayMode" 
                    value="cropped"
                    checked={teamGalleryInput.cropMode === 'cropped'}
                    onChange={() => setTeamGalleryInput({...teamGalleryInput, cropMode: 'cropped'})}
                    style={{cursor: 'pointer'}}
                  />
                  <span>Cropped (Fill)</span>
                </label>
              </div>
            </div>
          )}
          
          {teamGalleryInput.type === 'video' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={{display: 'flex', gap: '10px'}}>
                <input 
                  type="text" 
                  placeholder="Paste Video URL..."
                  value={teamGalleryInput.url}
                  onChange={e => setTeamGalleryInput({...teamGalleryInput, url: e.target.value})}
                  style={{flex:1}}
                />
                <button className="btn" onClick={() => {
                  if(teamGalleryInput.url) { 
                    const newItem = { type: teamGalleryInput.type, url: teamGalleryInput.url };
                    addItem('teamGalleryImages', newItem);
                    setTeamGalleryInput({...teamGalleryInput, url: ''});
                  }
                }}><i className="fa-solid fa-plus"></i> Add URL</button>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: 'white', borderRadius: '4px', border: '1px solid #eee'}}>
                <input
                   type="file"
                   accept="video/*"
                   id="team-video-upload"
                   style={{display: 'none'}}
                   onChange={(e) => handleVideoUpload(e.target.files[0], 'teamGalleryImages')}
                />
                <button 
                   className="btn ghost" 
                   onClick={() => document.getElementById('team-video-upload').click()}
                   disabled={isUploading}
                >
                   {isUploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-upload"></i>} Upload Video File
                </button>
                <span className="muted" style={{fontSize: '12px'}}>Supports MP4, WebM (Max 50MB)</span>
              </div>
            </div>
          ) : (
            <EnhancedImageUploader
              label=""
              aspectRatio={16/9}
              onImageSelected={(url) => {
                 if (url) addItem('teamGalleryImages', { type: 'image', url, cropMode: teamGalleryInput.cropMode });
              }}
              autoReset={true}
              allowSkipOnUpload={true}
              showCrop={true}
            />
          )}
        </div>
        
        {formData.teamGalleryImages.length > 0 && (
           <>
            <label style={{marginBottom: '10px', display: 'block'}}>{formData.teamGalleryImages.length} Items in Gallery</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {formData.teamGalleryImages.map((item, i) => (
                <GalleryItem 
                  key={i} 
                  item={item} 
                  index={i} 
                  total={formData.teamGalleryImages.length} 
                  field="teamGalleryImages"
                />
              ))}
            </div>
           </>
         )}
      </div>

      {/* 6. My Team (Position) */}
      <div className="group-title" style={{marginTop:'40px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-user-doctor"></i> My Team Position
      </div>
      <div style={{
        background: '#f9f9f9',
        border: '1px solid #eee',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <div className="grid cols-2" style={{alignItems:'start', gap: '20px'}}>
          <div>
            <div className="field">
              <label>Name</label>
              <input 
                value={teamInput.name} 
                onChange={e => setTeamInput({...teamInput, name: e.target.value})} 
                type="text" 
                placeholder="Full Name"
              />
            </div>
            <div className="field">
              <label>Role</label>
              <input 
                value={teamInput.role} 
                onChange={e => setTeamInput({...teamInput, role: e.target.value})} 
                type="text" 
                placeholder="Manager / Nurse"
              />
            </div>
          </div>
          <div>
            <EnhancedImageUploader
              label="Member Photo"
              aspectRatio={1}
              initialValue={teamInput.image}
              onImageSelected={(url) => setTeamInput({...teamInput, image: url})}
              autoReset={false}
              allowSkipOnUpload={true}
              showCrop={true}
            />
          </div>
        </div>
        <button className="btn" style={{marginTop:'10px'}} onClick={() => {
          if(teamInput.name && teamInput.role) {
            addItem('teamMembers', teamInput);
            setTeamInput({name:'', role:'', image:''});
          } else {
            alert('Please enter Name and Role');
          }
        }}><i className="fa-solid fa-plus"></i> Add Team Member</button>
      </div>
      
      {formData.teamMembers.length > 0 && (
        <div style={{marginTop:'20px'}}>
          <label style={{marginBottom: '10px', display: 'block'}}>{formData.teamMembers.length} Members Added</label>
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            {formData.teamMembers.map((m, i) => (
              <div key={i} style={{
                background:'white', 
                padding:'10px', 
                borderRadius:'8px', 
                display:'flex', 
                alignItems:'center', 
                gap:'15px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{width:'50px', height:'50px', borderRadius:'50%', overflow:'hidden', background:'#eee', border:'1px solid #ddd'}}>
                   <img src={m.image || 'https://via.placeholder.com/50'} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                </div>
                <div style={{flex:1}}>
                  <strong style={{fontSize:'16px', color:'#2c5aa0'}}>{m.name}</strong>
                  <div className="muted">{m.role}</div>
                </div>
                <div style={{display:'flex', gap:'5px'}}>
                  <button className="btn ghost small icon-only" disabled={i === 0} onClick={() => moveItem('teamMembers', i, 'up')}><i className="fa-solid fa-arrow-up"></i></button>
                  <button className="btn ghost small icon-only" disabled={i === formData.teamMembers.length - 1} onClick={() => moveItem('teamMembers', i, 'down')}><i className="fa-solid fa-arrow-down"></i></button>
                  <button className="btn ghost small icon-only" style={{color:'red'}} onClick={() => removeItem('teamMembers', i)}><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="toolbar" style={{marginTop:'40px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
        <div className="right"></div>
        <button className="btn ghost" onClick={copyListingJson} style={{marginRight:'10px'}}>
          <i className="fa-solid fa-copy"></i>&nbsp;Copy Listing JSON
        </button>
        <button className="btn" onClick={() => {
          if (onSave) {
            onSave(formData);
          } else {
            alert(`${mode === 'add' ? 'Added' : 'Updated'} successfully! (Prototype)`);
          }
        }}>
          <i className={mode === 'add' ? "fa-solid fa-plus" : "fa-solid fa-save"}></i>&nbsp;{mode === 'add' ? 'Add Home' : 'Update Home'}
        </button>
      </div>
    </section>
  );
};

export default HomeForm;
