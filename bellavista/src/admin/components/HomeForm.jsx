import React, { useState, useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';

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
  const [teamGalleryInput, setTeamGalleryInput] = useState({ type: 'image', url: '' });
  const [activityMediaInput, setActivityMediaInput] = useState({ type: 'image', url: '' });
  const [facilityMediaInput, setFacilityMediaInput] = useState({ type: 'image', url: '' });

  // Special handler for "Second Card Image" (which maps to activityImages[0])
  const handleSecondCardImageChange = (url) => {
    const currentImages = [...formData.activityImages];
    if (currentImages.length > 0) {
      // If it's an object, update url; if string, update string
      if (typeof currentImages[0] === 'object') {
        currentImages[0] = { ...currentImages[0], url: url };
      } else {
        currentImages[0] = url;
      }
    } else {
      // If empty, add as new item (defaulting to image type if object required, but here we can just push)
      // The backend/frontend seems to handle mixed types, but let's stick to object for consistency if possible,
      // or just string if that's what ImageUploader returns.
      // ImageUploader returns a string URL.
      // Our other lists use { type, url }. Let's use that.
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
      <div className="group-title" style={{marginTop:'20px', marginBottom:'10px'}}>Basic Information</div>
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
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>Card Images (Max 2)</div>
      <div className="grid cols-2">
        <div className="field">
          <ImageUploader 
            label="Card Image 1 (Main)" 
            aspectRatio={4/3}
            initialValue={formData.homeImage}
            onImageSelected={(url) => handleChange('homeImage', url)}
          />
        </div>
        <div className="field">
          <ImageUploader 
            label="Card Image 2" 
            aspectRatio={4/3}
            initialValue={getSecondCardImage()}
            onImageSelected={(url) => handleSecondCardImageChange(url)}
          />
          <small className="muted" style={{display:'block', marginTop:'5px'}}>
            *This image is also the first item in the Activities Gallery.
          </small>
        </div>
      </div>

      {/* 3. Facilities */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>Facilities</div>
      <div className="field">
         <label>Facilities Gallery Media (Images/Videos)</label>
         <div style={{display:'flex', gap:'5px', marginBottom:'5px'}}>
           <select 
             value={facilityMediaInput.type} 
             onChange={e => setFacilityMediaInput({...facilityMediaInput, type: e.target.value})}
             style={{width:'80px'}}
           >
             <option value="image">Image</option>
             <option value="video">Video</option>
           </select>
           <input 
              type="text" 
              placeholder={facilityMediaInput.type === 'image' ? "Image URL" : "Video URL"}
              value={facilityMediaInput.url}
              onChange={e => setFacilityMediaInput({...facilityMediaInput, url: e.target.value})}
              style={{flex:1}}
           />
           <button className="btn ghost small" onClick={() => {
             if(facilityMediaInput.url) { 
               const newItem = { type: facilityMediaInput.type, url: facilityMediaInput.url };
               addItem('facilitiesGalleryImages', newItem);
               setFacilityMediaInput({...facilityMediaInput, url: ''});
             }
           }}><i className="fa-solid fa-plus"></i></button>
         </div>
         
         <div style={{marginTop:'5px'}}>
            {formData.facilitiesGalleryImages.length} items added
            <div style={{display:'flex', flexDirection:'column', gap:'4px', marginTop:'4px'}}>
              {formData.facilitiesGalleryImages.map((item, i) => {
                const isObj = typeof item === 'object';
                const url = isObj ? item.url : item;
                const type = isObj ? item.type : 'image';
                return (
                <div key={i} style={{display:'flex', alignItems:'center', background:'#f5f5f5', padding:'4px', borderRadius:'4px'}}>
                  <div style={{width:'40px', height:'40px', background:'#ddd', marginRight:'10px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                    {type === 'video' ? <i className="fa-solid fa-video"></i> : <img src={url} style={{width:'100%', height:'100%', objectFit:'cover'}} alt=""/>}
                  </div>
                  <div style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'12px'}} title={url}>
                    {type.toUpperCase()}: {url}
                  </div>
                  <div style={{display:'flex', gap:'5px'}}>
                    <button className="btn ghost small icon-only" disabled={i===0} onClick={() => moveItem('facilitiesGalleryImages', i, 'up')}><i className="fa-solid fa-arrow-up"></i></button>
                    <button className="btn ghost small icon-only" disabled={i===formData.facilitiesGalleryImages.length-1} onClick={() => moveItem('facilitiesGalleryImages', i, 'down')}><i className="fa-solid fa-arrow-down"></i></button>
                    <button className="btn ghost small icon-only" style={{color:'red'}} onClick={() => removeItem('facilitiesGalleryImages', i)}><i className="fa-solid fa-times"></i></button>
                  </div>
                </div>
                );
              })}
            </div>
         </div>
      </div>

      {/* 4. Activities */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>Activities</div>
      <div className="field">
        <label>Activities Gallery Media (Images/Videos)</label>
        <div style={{display:'flex', gap:'5px', marginBottom:'5px'}}>
          <select 
            value={activityMediaInput.type} 
            onChange={e => setActivityMediaInput({...activityMediaInput, type: e.target.value})}
            style={{width:'80px'}}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <input 
             type="text" 
             placeholder={activityMediaInput.type === 'image' ? "Image URL" : "Video URL (YouTube/MP4)"}
             value={activityMediaInput.url}
             onChange={e => setActivityMediaInput({...activityMediaInput, url: e.target.value})}
             style={{flex:1}}
          />
          <button className="btn ghost small" onClick={() => {
            if(activityMediaInput.url) { 
              const newItem = { type: activityMediaInput.type, url: activityMediaInput.url };
              addItem('activityImages', newItem);
              setActivityMediaInput({...activityMediaInput, url: ''});
            }
          }}><i className="fa-solid fa-plus"></i></button>
        </div>
        
        <div style={{marginTop:'5px'}}>
           {formData.activityImages.length} items added
           <div style={{display:'flex', flexDirection:'column', gap:'4px', marginTop:'4px'}}>
             {formData.activityImages.map((item, i) => {
               const isObj = typeof item === 'object';
               const url = isObj ? item.url : item;
               const type = isObj ? item.type : 'image';
               return (
               <div key={i} style={{display:'flex', alignItems:'center', background:'#f5f5f5', padding:'4px', borderRadius:'4px'}}>
                 <div style={{width:'40px', height:'40px', background:'#ddd', marginRight:'10px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                   {type === 'video' ? <i className="fa-solid fa-video"></i> : <img src={url} style={{width:'100%', height:'100%', objectFit:'cover'}} alt=""/>}
                 </div>
                 <div style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'12px'}} title={url}>
                   {type.toUpperCase()}: {url} {i === 0 ? '(Used in Card)' : ''}
                 </div>
                 <div style={{display:'flex', gap:'5px'}}>
                   <button className="btn ghost small icon-only" disabled={i===0} onClick={() => moveItem('activityImages', i, 'up')}><i className="fa-solid fa-arrow-up"></i></button>
                   <button className="btn ghost small icon-only" disabled={i===formData.activityImages.length-1} onClick={() => moveItem('activityImages', i, 'down')}><i className="fa-solid fa-arrow-down"></i></button>
                   <button className="btn ghost small icon-only" style={{color:'red'}} onClick={() => removeItem('activityImages', i)}><i className="fa-solid fa-times"></i></button>
                 </div>
               </div>
               );
             })}
           </div>
        </div>
      </div>

      {/* 5. Meet My Team (Gallery) */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>Meet My Team</div>
      <div className="field">
        <label>Team Gallery Media (Images/Videos)</label>
        <div style={{display:'flex', gap:'5px', marginBottom:'5px'}}>
          <select 
            value={teamGalleryInput.type} 
            onChange={e => setTeamGalleryInput({...teamGalleryInput, type: e.target.value})}
            style={{width:'80px'}}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <input 
            type="text" 
            placeholder={teamGalleryInput.type === 'image' ? "Image URL" : "Video URL"}
            value={teamGalleryInput.url}
            onChange={e => setTeamGalleryInput({...teamGalleryInput, url: e.target.value})}
            style={{flex:1}}
          />
          <button className="btn ghost small" onClick={() => {
            if(teamGalleryInput.url) { 
              const newItem = { type: teamGalleryInput.type, url: teamGalleryInput.url };
              addItem('teamGalleryImages', newItem);
              setTeamGalleryInput({...teamGalleryInput, url: ''});
            }
          }}><i className="fa-solid fa-plus"></i></button>
        </div>
        
        <div style={{marginTop:'5px'}}>
           {formData.teamGalleryImages.length} items added
           <div style={{display:'flex', flexDirection:'column', gap:'4px', marginTop:'4px'}}>
             {formData.teamGalleryImages.map((item, i) => {
               const isObj = typeof item === 'object';
               const url = isObj ? item.url : item;
               const type = isObj ? item.type : 'image';
               return (
               <div key={i} style={{display:'flex', alignItems:'center', background:'#f5f5f5', padding:'4px', borderRadius:'4px'}}>
                 <div style={{width:'40px', height:'40px', background:'#ddd', marginRight:'10px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                   {type === 'video' ? <i className="fa-solid fa-video"></i> : <img src={url} style={{width:'100%', height:'100%', objectFit:'cover'}} alt=""/>}
                 </div>
                 <div style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'12px'}} title={url}>
                   {type.toUpperCase()}: {url}
                 </div>
                 <div style={{display:'flex', gap:'5px'}}>
                   <button className="btn ghost small icon-only" disabled={i===0} onClick={() => moveItem('teamGalleryImages', i, 'up')}><i className="fa-solid fa-arrow-up"></i></button>
                   <button className="btn ghost small icon-only" disabled={i===formData.teamGalleryImages.length-1} onClick={() => moveItem('teamGalleryImages', i, 'down')}><i className="fa-solid fa-arrow-down"></i></button>
                   <button className="btn ghost small icon-only" style={{color:'red'}} onClick={() => removeItem('teamGalleryImages', i)}><i className="fa-solid fa-times"></i></button>
                 </div>
               </div>
               );
             })}
           </div>
        </div>
      </div>

      {/* 6. My Team (Position) */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>My Team Position</div>
      <div className="grid cols-3" style={{alignItems:'end'}}>
        <div className="field"><label>Name</label><input value={teamInput.name} onChange={e => setTeamInput({...teamInput, name: e.target.value})} type="text" placeholder="Full Name"/></div>
        <div className="field"><label>Role</label><input value={teamInput.role} onChange={e => setTeamInput({...teamInput, role: e.target.value})} type="text" placeholder="Manager / Nurse"/></div>
        <div className="field"><label>Image URL</label><input value={teamInput.image} onChange={e => setTeamInput({...teamInput, image: e.target.value})} type="url" placeholder="https://..."/></div>
      </div>
      <button className="btn ghost small" style={{marginTop:'10px'}} onClick={() => {
        if(teamInput.name && teamInput.role) {
          addItem('teamMembers', teamInput);
          setTeamInput({name:'', role:'', image:''});
        }
      }}><i className="fa-solid fa-plus"></i> Add Member</button>
      
      <div style={{marginTop:'10px', display:'flex', flexDirection:'column', gap:'10px'}}>
        {formData.teamMembers.map((m, i) => (
          <div key={i} style={{background:'#f0f4f8', padding:'8px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'10px'}}>
            <img src={m.image || 'https://via.placeholder.com/30'} alt="" style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}}/>
            <div style={{flex:1}}>
              <strong>{m.name}</strong><br/><span className="muted">{m.role}</span>
            </div>
            <div style={{display:'flex', gap:'5px'}}>
              <button className="btn ghost small icon-only" disabled={i === 0} onClick={() => moveItem('teamMembers', i, 'up')}><i className="fa-solid fa-arrow-up"></i></button>
              <button className="btn ghost small icon-only" disabled={i === formData.teamMembers.length - 1} onClick={() => moveItem('teamMembers', i, 'down')}><i className="fa-solid fa-arrow-down"></i></button>
              <button className="btn ghost small icon-only" style={{color:'red'}} onClick={() => removeItem('teamMembers', i)}><i className="fa-solid fa-times"></i></button>
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar" style={{marginTop:'30px'}}>
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