import React, { useState, useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';

const HomeForm = ({ mode = 'add', initialData = null, onCancel }) => {
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
  const [activityInput, setActivityInput] = useState('');
  const [activityMediaInput, setActivityMediaInput] = useState({ type: 'image', url: '' });
  const [facilityInput, setFacilityInput] = useState({ icon: '', title: '' });
  const [detFacilityInput, setDetFacilityInput] = useState({ title: '', icon: '', description: '' });
  const [facilityMediaInput, setFacilityMediaInput] = useState({ type: 'image', url: '' });
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
      
      {/* 1. Basic Information */}
      <div className="group-title" style={{marginTop:'20px', marginBottom:'10px'}}>Basic Information</div>
      <div className="grid cols-2">
        <div className="field">
          <label>Home Name</label>
          <input 
            value={formData.homeName} 
            onChange={(e) => handleChange('homeName', e.target.value)} 
            type="text" placeholder="e.g., Bellavista Cardiff"
          />
        </div>
        <div className="field">
          <label>Location</label>
          <input 
            value={formData.homeLocation} 
            onChange={(e) => handleChange('homeLocation', e.target.value)} 
            type="text" placeholder="City, Region"
          />
        </div>
        <div className="field">
          <ImageUploader 
            label="Card Image" 
            aspectRatio={4/3}
            initialValue={formData.homeImage}
            onImageSelected={(url) => handleChange('homeImage', url)}
          />
        </div>
        <div className="field">
          <label>Badge</label>
          <select 
            value={formData.homeBadge} 
            onChange={(e) => handleChange('homeBadge', e.target.value)}
          >
            <option value="">None</option>
            <option>Featured</option>
            <option>New</option>
            <option>Awarded</option>
          </select>
        </div>
        <div className="field" style={{gridColumn:'1/-1'}}>
          <label>Short Description (Card)</label>
          <textarea 
            value={formData.homeDesc} 
            onChange={(e) => handleChange('homeDesc', e.target.value)}
            placeholder="Short teaser shown on the card…" style={{minHeight:'80px'}}
          ></textarea>
        </div>
      </div>

      {/* 2. Hero Section */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>Hero Section</div>
      <div className="grid cols-2">
        <div className="field">
          <label>Hero Title</label>
          <input 
            value={formData.heroTitle} 
            onChange={(e) => handleChange('heroTitle', e.target.value)}
            type="text" placeholder="Welcome to Bellavista..."
          />
        </div>
        <div className="field">
          <label>Hero Subtitle</label>
          <input 
            value={formData.heroSubtitle} 
            onChange={(e) => handleChange('heroSubtitle', e.target.value)}
            type="text" placeholder="A chic, cosmopolitan atmosphere..."
          />
        </div>
        <div className="field" style={{gridColumn:'1/-1'}}>
          <ImageUploader 
            label="Hero Background Image" 
            aspectRatio={16/5} // Wide banner
            initialValue={formData.heroBgImage}
            onImageSelected={(url) => handleChange('heroBgImage', url)}
          />
        </div>
        <div className="field" style={{gridColumn:'1/-1'}}>
          <label>Expanded Description (Read More)</label>
          <textarea 
            value={formData.heroExpandedDesc} 
            onChange={(e) => handleChange('heroExpandedDesc', e.target.value)}
            placeholder="Full description appearing when 'See More' is clicked." style={{minHeight:'150px'}}
          ></textarea>
        </div>
      </div>

      {/* 3. Stats */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>Key Stats</div>
      <div className="grid cols-2">
        <div className="field">
          <label>Number of Bedrooms</label>
          <input 
            value={formData.statsBedrooms} 
            onChange={(e) => handleChange('statsBedrooms', e.target.value)}
            type="number" placeholder="62"
          />
        </div>
        <div className="field">
          <label>Number of Premier Rooms</label>
          <input 
            value={formData.statsPremier} 
            onChange={(e) => handleChange('statsPremier', e.target.value)}
            type="number" placeholder="18"
          />
        </div>
      </div>

      {/* 4. Team Members */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>Team Members</div>
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

      <div style={{marginTop:'20px'}}>
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

      {/* 5. Activities */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>Activities</div>
      <div className="field">
        <label>Intro Text</label>
        <textarea value={formData.activitiesIntro} onChange={e => handleChange('activitiesIntro', e.target.value)} style={{minHeight:'80px'}}></textarea>
      </div>
      
      <div className="grid cols-2" style={{marginTop:'10px'}}>
         <div className="field">
           <label>Add Activity Item</label>
           <div style={{display:'flex', gap:'8px'}}>
             <input value={activityInput} onChange={e => setActivityInput(e.target.value)} type="text" placeholder="e.g. Bingo"/>
             <button className="btn ghost small" onClick={() => {
               if(activityInput) { addItem('activities', activityInput); setActivityInput(''); }
             }}><i className="fa-solid fa-plus"></i></button>
           </div>
           <div style={{marginTop:'5px', display:'flex', flexDirection:'column', gap:'5px'}}>
             {formData.activities.map((a, i) => (
               <div key={i} style={{background:'#eef', padding:'4px 8px', borderRadius:'4px', fontSize:'13px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                 <span>{a}</span>
                 <div style={{display:'flex', gap:'5px'}}>
                    <i className="fa-solid fa-arrow-up" style={{cursor:'pointer', opacity: i===0?0.3:1}} onClick={() => moveItem('activities', i, 'up')}></i>
                    <i className="fa-solid fa-arrow-down" style={{cursor:'pointer', opacity: i===formData.activities.length-1?0.3:1}} onClick={() => moveItem('activities', i, 'down')}></i>
                    <i className="fa-solid fa-times" style={{cursor:'pointer', color:'red'}} onClick={() => removeItem('activities', i)}></i>
                 </div>
               </div>
             ))}
           </div>
         </div>
         <div className="field">
           <label>Add Gallery Media (Image/Video)</label>
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
                 // Store as object { type, url } or string if just image? User wants both.
                 // Let's standardize on object for mixed media lists.
                 // But existing data might be strings. We should handle both.
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
                      {type.toUpperCase()}: {url}
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
      </div>
      
      <div className="field" style={{marginTop:'10px'}}>
         <label>Modal Description (Full Details)</label>
         <textarea value={formData.activitiesModalDesc} onChange={e => handleChange('activitiesModalDesc', e.target.value)} placeholder="Detailed description..." style={{minHeight:'100px'}}></textarea>
      </div>

      {/* 6. Facilities */}
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px'}}>Facilities</div>
      <div className="field">
        <label>Intro Text</label>
        <textarea value={formData.facilitiesIntro} onChange={e => handleChange('facilitiesIntro', e.target.value)} style={{minHeight:'80px'}}></textarea>
      </div>

      <div className="grid cols-2" style={{marginTop:'10px'}}>
        <div className="field">
           <label>Add Facility Highlight</label>
           <div style={{display:'flex', gap:'8px'}}>
             <input value={facilityInput.icon} onChange={e => setFacilityInput({...facilityInput, icon: e.target.value})} type="text" placeholder="fa-solid fa-wifi" style={{width:'40%'}}/>
             <input value={facilityInput.title} onChange={e => setFacilityInput({...facilityInput, title: e.target.value})} type="text" placeholder="Free Wifi" style={{flex:1}}/>
             <button className="btn ghost small" onClick={() => {
               if(facilityInput.title) { addItem('facilitiesList', facilityInput); setFacilityInput({icon:'', title:''}); }
             }}><i className="fa-solid fa-plus"></i></button>
           </div>
           <ul style={{marginTop:'5px', listStyle:'none', padding:0}}>
             {formData.facilitiesList.map((f, i) => (
               <li key={i} style={{fontSize:'13px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px', background:'#f9f9f9', marginBottom:'2px'}}>
                 <span><i className={f.icon}></i> {f.title}</span>
                 <div style={{display:'flex', gap:'5px'}}>
                    <i className="fa-solid fa-arrow-up" style={{cursor:'pointer', opacity: i===0?0.3:1}} onClick={() => moveItem('facilitiesList', i, 'up')}></i>
                    <i className="fa-solid fa-arrow-down" style={{cursor:'pointer', opacity: i===formData.facilitiesList.length-1?0.3:1}} onClick={() => moveItem('facilitiesList', i, 'down')}></i>
                    <i className="fa-solid fa-times" style={{cursor:'pointer', color:'red'}} onClick={() => removeItem('facilitiesList', i)}></i>
                 </div>
               </li>
             ))}
           </ul>
        </div>
        
        <div className="field">
           <label>Add Facilities Gallery Media</label>
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
      </div>
        
        <div className="field">
           <label>Add Detailed Facility</label>
           <input value={detFacilityInput.title} onChange={e => setDetFacilityInput({...detFacilityInput, title: e.target.value})} type="text" placeholder="Title" style={{marginBottom:'5px'}}/>
           <input value={detFacilityInput.icon} onChange={e => setDetFacilityInput({...detFacilityInput, icon: e.target.value})} type="text" placeholder="Icon Class" style={{marginBottom:'5px'}}/>
           <textarea value={detFacilityInput.description} onChange={e => setDetFacilityInput({...detFacilityInput, description: e.target.value})} placeholder="Description" style={{minHeight:'60px', marginBottom:'5px'}}></textarea>
           <button className="btn ghost small" onClick={() => {
              if(detFacilityInput.title && detFacilityInput.description) {
                addItem('detailedFacilities', detFacilityInput);
                setDetFacilityInput({title:'', icon:'', description:''});
              }
           }}>Add Detail</button>
           <div style={{marginTop:'5px'}}>
             {formData.detailedFacilities.length} details added
           </div>
        </div>

      <div className="toolbar" style={{marginTop:'30px'}}>
        <label style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <input 
            checked={formData.homeFeatured} 
            onChange={(e) => handleChange('homeFeatured', e.target.checked)} 
            type="checkbox"
          /> Featured Home
        </label>
        <div className="right"></div>
        <button className="btn ghost" onClick={copyListingJson} style={{marginRight:'10px'}}>
          <i className="fa-solid fa-copy"></i>&nbsp;Copy Listing JSON
        </button>
        <button className="btn" onClick={() => alert(`${mode === 'add' ? 'Added' : 'Updated'} successfully! (Prototype)`)}>
          <i className={mode === 'add' ? "fa-solid fa-plus" : "fa-solid fa-save"}></i>&nbsp;{mode === 'add' ? 'Add Home' : 'Update Home'}
        </button>
      </div>
    </section>
  );
};

export default HomeForm;
