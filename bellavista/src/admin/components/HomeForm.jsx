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
    activitiesIntro: '',
    activities: [],
    activityImages: [],
    activitiesModalDesc: '',
    facilitiesIntro: '',
    facilitiesList: [],
    detailedFacilities: [],
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

  // Local state for list inputs
  const [teamInput, setTeamInput] = useState({ name: '', role: '', image: '' });
  const [activityInput, setActivityInput] = useState('');
  const [activityImgInput, setActivityImgInput] = useState('');
  const [facilityInput, setFacilityInput] = useState({ icon: '', title: '' });
  const [detFacilityInput, setDetFacilityInput] = useState({ title: '', icon: '', description: '' });
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
        <div className="field"><label>Name</label><input value={teamInput.name} onChange={e => setTeamInput({...teamInput, name: e.target.value})} type="text"/></div>
        <div className="field"><label>Role</label><input value={teamInput.role} onChange={e => setTeamInput({...teamInput, role: e.target.value})} type="text"/></div>
        <div className="field"><label>Image URL</label><input value={teamInput.image} onChange={e => setTeamInput({...teamInput, image: e.target.value})} type="url"/></div>
      </div>
      <button className="btn ghost small" style={{marginTop:'10px'}} onClick={() => {
        if(teamInput.name && teamInput.role) {
          addItem('teamMembers', teamInput);
          setTeamInput({name:'', role:'', image:''});
        }
      }}><i className="fa-solid fa-plus"></i> Add Member</button>
      
      <div style={{marginTop:'10px', display:'flex', gap:'10px', flexWrap:'wrap'}}>
        {formData.teamMembers.map((m, i) => (
          <div key={i} style={{background:'#f0f4f8', padding:'8px', borderRadius:'8px', fontSize:'13px', display:'flex', alignItems:'center', gap:'8px'}}>
            <img src={m.image || 'https://via.placeholder.com/30'} alt="" style={{width:'30px', height:'30px', borderRadius:'50%', objectFit:'cover'}}/>
            <div><strong>{m.name}</strong><br/><span className="muted">{m.role}</span></div>
            <i className="fa-solid fa-times" style={{cursor:'pointer', color:'red'}} onClick={() => removeItem('teamMembers', i)}></i>
          </div>
        ))}
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
           <div style={{marginTop:'5px', display:'flex', flexWrap:'wrap', gap:'5px'}}>
             {formData.activities.map((a, i) => (
               <span key={i} style={{background:'#eef', padding:'4px 8px', borderRadius:'4px', fontSize:'12px'}}>
                 {a} <i className="fa-solid fa-times" style={{cursor:'pointer', marginLeft:'4px'}} onClick={() => removeItem('activities', i)}></i>
               </span>
             ))}
           </div>
         </div>
         <div className="field">
           <label>Add Gallery Image</label>
           <ImageUploader 
             label="" 
             aspectRatio={1} // Square for gallery
             helperText="Square crop recommended"
             onImageSelected={(url) => {
               if(url) addItem('activityImages', url);
             }}
           />
           <div style={{marginTop:'5px'}}>
              {formData.activityImages.length} images added
              <div style={{display:'flex', gap:'4px', marginTop:'4px', overflowX:'auto'}}>
                {formData.activityImages.map((img, i) => (
                  <div key={i} style={{position:'relative'}}>
                    <img src={img} style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}} />
                    <i className="fa-solid fa-times" 
                       style={{position:'absolute', top:0, right:0, background:'red', color:'white', fontSize:'10px', padding:'2px', cursor:'pointer'}}
                       onClick={() => removeItem('activityImages', i)}
                    ></i>
                  </div>
                ))}
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
           <ul style={{marginTop:'5px', listStyle:'none'}}>
             {formData.facilitiesList.map((f, i) => (
               <li key={i} style={{fontSize:'13px'}}>
                 <i className={f.icon}></i> {f.title} <i className="fa-solid fa-times" style={{cursor:'pointer', color:'red', marginLeft:'5px'}} onClick={() => removeItem('facilitiesList', i)}></i>
               </li>
             ))}
           </ul>
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
