import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import ImageUploader from '../components/ImageUploader';
import NewsForm from './components/NewsForm';
import { fetchNewsItems, createNewsItem, updateNewsItem, deleteNewsItem } from '../services/newsService';
import { fetchScheduledTours, updateBookingInAPI } from '../services/tourService';
import { fetchCareEnquiries } from '../services/enquiryService';
import { fetchHomes, updateHome } from '../services/homeService';
import HomeForm from './components/HomeForm';
import './AdminConsole.css';

const AdminConsole = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('update-home');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedHome, setSelectedHome] = useState(null);
  const [homes, setHomes] = useState([]);
  const [newsForm, setNewsForm] = useState({
    id: '',
    title: '',
    excerpt: '',
    fullDescription: '',
    image: '',
    category: 'events',
    date: '',
    location: 'All Locations',
    author: 'Bellavista Team',
    badge: '',
    important: false,
    gallery: [],
    videoUrl: ''
  });
  const MAX_EXCERPT = 180;
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqs, setFaqs] = useState([]);

  const loadHomes = async () => {
    const data = await fetchHomes();
    setHomes(data);
  };

  const handleSaveHome = async (homeData) => {
    try {
      await updateHome(homeData.id, homeData);
      alert('Home updated successfully!');
      setSelectedHome(null);
      loadHomes();
    } catch (error) {
      console.error(error);
      alert('Failed to update home.');
    }
  };

  const [bookings, setBookings] = useState([]);
  const [bookingSearch, setBookingSearch] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const downloadExcel = (data, filename) => {
    if (!data.length) {
      alert('No data to download');
      return;
    }
    
    // Format data for Excel
    const formattedData = data.map(row => ({
      'Name': row.name || '',
      'Phone': row.phone || '',
      'Email': row.email || '',
      'Location': row.location || '',
      'Preferred Date': row.preferredDate || '',
      'Preferred Time': row.preferredTime || '',
      'Created At': new Date(row.createdAt).toLocaleString(),
      'Status': row.status || 'requested',
      'Message': row.message || ''
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Auto-size columns (simple estimation)
    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 15 }, // Phone
      { wch: 25 }, // Email
      { wch: 25 }, // Location
      { wch: 15 }, // Date
      { wch: 15 }, // Time
      { wch: 20 }, // Created
      { wch: 12 }, // Status
      { wch: 40 }  // Message
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Write file
    XLSX.writeFile(workbook, filename);
  };

  const handleDownload = (type) => {
    const filename = type === 'all' 
      ? `All_Bookings_${new Date().toISOString().split('T')[0]}.xlsx`
      : `Visited_Bookings_${new Date().toISOString().split('T')[0]}.xlsx`;

    if (type === 'all') {
      downloadExcel(bookings, filename);
    } else if (type === 'visited') {
      const visited = bookings.filter(b => b.status === 'visited');
      downloadExcel(visited, filename);
    }
    setShowDownloadModal(false);
  };
  
  const loadBookings = async () => {
    try {
      const data = await fetchScheduledTours();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await updateBookingInAPI(id, { status });
      // Update local state to reflect change immediately
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update status');
    }
  };

  const [enquiries, setEnquiries] = useState([]);
  const [enquirySearch, setEnquirySearch] = useState('');
  
  const loadEnquiries = async () => {
    try {
      const data = await fetchCareEnquiries();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch {
      setEnquiries([]);
    }
  };

  const [applications, setApplications] = useState([]);
  const [applicationSearch, setApplicationSearch] = useState('');
  
  const loadApplications = () => {
    try {
      const key = 'career_applications';
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      setApplications([]);
    }
  };

  const loadNews = async () => {
    const items = await fetchNewsItems();
    setNewsList(items);
  };

  useEffect(() => {
    if (activeView === 'scheduled-tours') {
      loadBookings();
      const interval = setInterval(loadBookings, 10000);
      return () => clearInterval(interval);
    }
    if (activeView === 'care-enquiries') {
      loadEnquiries();
      const interval = setInterval(loadEnquiries, 10000);
      return () => clearInterval(interval);
    }
    if (activeView === 'career-applications') {
      loadApplications();
      const interval = setInterval(loadApplications, 5000);
      const onStorage = (e) => {
        if (e.key === 'career_applications') loadApplications();
      };
      window.addEventListener('storage', onStorage);
      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', onStorage);
      };
    }
    if (activeView === 'update-news') {
      loadNews();
    }
    if (activeView === 'update-home') {
      loadHomes();
    }
  }, [activeView]);

  // Add news
  const addNews = async () => {
    if (!newsForm.title || !newsForm.date || !newsForm.excerpt) {
      alert('Please fill in at least title, date, and summary');
      return;
    }
    
    // Auto-generate ID if empty (though backend handles it usually)
    const id = (newsForm.id || newsForm.title).toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50);
    
    const payload = {
      ...newsForm,
      id
    };

    try {
      await createNewsItem(payload);
      alert('News saved successfully!');
      
      // Reset form
      setNewsForm({
        id: '',
        title: '',
        excerpt: '',
        fullDescription: '',
        image: '',
        category: 'events',
        date: '',
        location: 'All Locations',
        author: 'Bellavista Team',
        badge: '',
        important: false,
        gallery: [],
        videoUrl: ''
      });
      
      // If we were viewing list, refresh it
      if (activeView === 'update-news') {
        loadNews();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save news. See console.');
    }
  };

  const updateNews = async () => {
    if (!selectedNews) return;
    if (!newsForm.title || !newsForm.date || !newsForm.excerpt) {
      alert('Please fill in at least title, date, and summary');
      return;
    }
    
    const payload = {
      ...newsForm,
      id: selectedNews.id // Ensure we keep the original ID
    };

    try {
      await updateNewsItem(payload);
      alert('News updated successfully!');
      
      // Refresh list
      loadNews();
      
      setSelectedNews(null);
      setNewsForm({
        id: '',
        title: '',
        excerpt: '',
        fullDescription: '',
        image: '',
        category: 'events',
        date: '',
        location: 'All Locations',
        author: 'Bellavista Team',
        badge: '',
        important: false,
        gallery: [],
        videoUrl: ''
      });
    } catch (e) {
      console.error(e);
      alert('Failed to update news. See console.');
    }
  };

  const handleNewsChange = (field, value) => {
    setNewsForm(prev => ({ ...prev, [field]: value }));
  };

  const startEditNews = (news) => {
    setSelectedNews(news);
    setActiveView('update-news');
    setNewsForm({
      id: news.id,
      title: news.title || '',
      excerpt: news.excerpt || '',
      fullDescription: news.fullDescription || '',
      image: news.image || '',
      category: news.category || 'events',
      date: news.date || '',
      location: news.location || 'All Locations',
      author: news.author || 'Bellavista Team',
      badge: news.badge || '',
      important: !!news.important,
      gallery: Array.isArray(news.gallery) ? news.gallery : [],
      videoUrl: news.videoUrl || ''
    });
  };
  
  // Initial load if we start on update-news
  useEffect(() => {
    if (activeView === 'update-news') loadNews();
  }, []);

  const addFaq = () => {
    if (!faqQuestion || !faqAnswer) {
      alert('Please enter question and answer');
      return;
    }
    setFaqs(prev => [...prev, { question: faqQuestion, answer: faqAnswer }]);
    setFaqQuestion('');
    setFaqAnswer('');
  };
  const copyFaqs = async () => {
    const json = JSON.stringify(faqs, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      alert('FAQs JSON copied to clipboard');
    } catch {
      alert(json);
    }
  };

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    }
  };
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Admin' });
  const handleUserChange = (field, value) => setUserForm(prev => ({ ...prev, [field]: value }));
  const copyUserJson = async () => {
    if (!userForm.name || !userForm.email) {
      alert('Enter name and email');
      return;
    }
    const payload = { id: `${Date.now()}`, name: userForm.name, email: userForm.email, role: userForm.role, createdAt: new Date().toISOString() };
    const json = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      alert('User JSON copied to clipboard');
    } catch {
      alert(json);
    }
    setUserForm({ name: '', email: '', role: 'Viewer' });
  };

  return (
    <div className="app">
      <header>
        <div className="brand">
          <i className="fa-solid fa-hospital-user"></i>
          <h1>Bellavista Admin</h1>
          <span className="admin-badge">Dashboard</span>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={logout}>
            <i className="fa-solid fa-sign-out-alt"></i>&nbsp;Logout
          </button>
        </div>
      </header>

      <aside>
        <div className="search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input 
            id="globalSearch" 
            placeholder="Quick search…" 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
        <div className="nav">
          <div className="group-title">Homes</div>
          <button 
            className="disabled"
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
            title="Temporarily Disabled"
          >
            <i className="fa-solid fa-house-medical"></i><span>Add Home (Disabled)</span>
          </button>
          <button 
            className={activeView === 'update-home' ? 'active' : ''}
            onClick={() => setActiveView('update-home')}
          >
            <i className="fa-solid fa-pen-to-square"></i><span>Update Home</span>
          </button>
          <div className="group-title">News</div>
          <button 
            className={activeView === 'add-news' ? 'active' : ''}
            onClick={() => setActiveView('add-news')}
          >
            <i className="fa-solid fa-newspaper"></i><span>Add News</span>
          </button>
          <button 
            className={activeView === 'update-news' ? 'active' : ''}
            onClick={() => setActiveView('update-news')}
          >
            <i className="fa-solid fa-rectangle-list"></i><span>Update News</span>
          </button>
          <div className="group-title">Content</div>
          <button 
            className={activeView === 'manage-faqs' ? 'active' : ''}
            onClick={() => setActiveView('manage-faqs')}
          >
            <i className="fa-solid fa-circle-question"></i><span>Manage FAQs</span>
          </button>
          <div className="group-title">Users</div>
          <button 
            className={activeView === 'manage-users' ? 'active' : ''}
            onClick={() => setActiveView('manage-users')}
          >
            <i className="fa-solid fa-users-gear"></i><span>Manage Users</span>
          </button>
          <div className="group-title">Enquiries</div>
          <button 
            className={activeView === 'kiosk-links' ? 'active' : ''}
            onClick={() => setActiveView('kiosk-links')}
          >
            <i className="fa-solid fa-tablet-screen-button"></i><span>Reception Kiosks</span>
          </button>
          <button 
            className={activeView === 'scheduled-tours' ? 'active' : ''}
            onClick={() => setActiveView('scheduled-tours')}
          >
            <i className="fa-solid fa-calendar-check"></i><span>Scheduled Tours</span>
          </button>
          <button 
            className={activeView === 'care-enquiries' ? 'active' : ''}
            onClick={() => setActiveView('care-enquiries')}
          >
            <i className="fa-solid fa-heart"></i><span>Care Enquiries</span>
          </button>
          <button 
            className={activeView === 'career-applications' ? 'active' : ''}
            onClick={() => setActiveView('career-applications')}
          >
            <i className="fa-solid fa-briefcase"></i><span>Career Applications</span>
          </button>
        </div>
      </aside>

      <main>
        {activeView === 'add-home' && (
          <HomeForm mode="add" />
        )}

        {activeView === 'update-home' && (
          selectedHome ? (
            <HomeForm 
              mode="edit" 
              initialData={selectedHome} 
              onCancel={() => setSelectedHome(null)}
              onSave={handleSaveHome}
            />
          ) : (
            <section className="panel">
              <h2>Update Home</h2>
              <div className="toolbar">
                <input id="homeSearch" placeholder="Search homes…" style={{flex:1}} />
                <button className="btn ghost small" style={{opacity: 0.5, cursor: 'not-allowed'}} title="Disabled">
                  <i className="fa-solid fa-plus"></i>&nbsp;New
                </button>
              </div>
              <div style={{marginTop:'20px'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px'}}>
                  {homes.map(home => (
                    <div key={home.id} style={{border:'1px solid #e0e0e0', borderRadius:'10px', overflow:'hidden', background:'white'}}>
                      <div style={{height:'140px', background:`url(${home.homeImage}) center/cover`}}></div>
                      <div style={{padding:'15px'}}>
                        <h3 style={{margin:'0 0 5px 0'}}>{home.homeName}</h3>
                        <p style={{color:'#666', fontSize:'13px', marginBottom:'15px'}}>{home.homeLocation}</p>
                        <button className="btn small" onClick={() => setSelectedHome(home)}>
                          <i className="fa-solid fa-pen"></i> Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        )}

        {activeView === 'add-news' && (
          <NewsForm 
            mode="add"
            onSave={async (newsData) => {
              try {
                await createNewsItem(newsData);
                alert('News published successfully!');
                // Reset form after successful save
                setNewsForm({
                  id: '',
                  title: '',
                  excerpt: '',
                  fullDescription: '',
                  image: '',
                  category: 'events',
                  date: '',
                  location: 'All Locations',
                  author: 'Bellavista Team',
                  badge: '',
                  important: false,
                  gallery: [],
                  videoUrl: '',
                  videoDescription: ''
                });
              } catch (error) {
                console.error('Failed to publish news:', error);
                alert('Failed to publish news. Please try again.');
              }
            }}
          />
        )}

        {activeView === 'update-news' && (
          <section className="panel">
            <h2>Update News</h2>
            {!selectedNews && (
              <>
                <div className="toolbar">
                  <input placeholder="Search news…" style={{flex:1}} />
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'16px',marginTop:'16px'}}>
                  {newsList.map(item=>(
                    <div key={item.id} style={{border:'1px solid #e0e0e0',borderRadius:'10px',overflow:'hidden',background:'white'}}>
                      <div style={{height:'140px',background:`url(${item.image}) center/cover`}}></div>
                      <div style={{padding:'12px'}}>
                        <h3 style={{margin:'0 0 4px 0', fontSize:'16px'}}>{item.title}</h3>
                        <p className="muted" style={{fontSize:'12px'}}>{item.date} • {item.location}</p>
                        <button className="btn small" style={{marginTop:'8px'}} onClick={()=>startEditNews(item)}><i className="fa-solid fa-pen"></i> Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {selectedNews && (
              <NewsForm 
                mode="edit"
                initialData={selectedNews}
                onCancel={()=>{
                  setSelectedNews(null); 
                  setNewsForm({id:'',title:'',excerpt:'',fullDescription:'',image:'',category:'events',date:'',location:'All Locations',author:'Bellavista Team',badge:'',important:false,gallery:[],videoUrl:'',videoDescription:''});
                }}
                onSave={async (newsData) => {
                  try {
                    await updateNewsItem(newsData);
                    alert('News updated successfully!');
                    setSelectedNews(null);
                    setNewsForm({id:'',title:'',excerpt:'',fullDescription:'',image:'',category:'events',date:'',location:'All Locations',author:'Bellavista Team',badge:'',important:false,gallery:[],videoUrl:'',videoDescription:''});
                    loadNews();
                  } catch (error) {
                    console.error('Failed to update news:', error);
                    alert('Failed to update news. Please try again.');
                  }
                }}
                onDelete={async (id) => {
                  try {
                    await deleteNewsItem(id);
                    alert('News deleted successfully!');
                    setSelectedNews(null);
                    setNewsForm({id:'',title:'',excerpt:'',fullDescription:'',image:'',category:'events',date:'',location:'All Locations',author:'Bellavista Team',badge:'',important:false,gallery:[],videoUrl:'',videoDescription:''});
                    loadNews();
                  } catch (error) {
                    console.error('Failed to delete news:', error);
                    alert('Failed to delete news. Please try again.');
                  }
                }}
              />
            )}
          </section>
        )}

        {activeView === 'manage-faqs' && (
          <section className="panel">
            <h2>Manage FAQs</h2>
            <div className="grid cols-2">
              <div className="field"><label>Question</label><input value={faqQuestion} onChange={e=>setFaqQuestion(e.target.value)} type="text" placeholder="What types of care do you provide?"/></div>
              <div className="field" style={{gridColumn:'1/-1'}}>
                <label>Answer</label>
                <textarea value={faqAnswer} onChange={e=>setFaqAnswer(e.target.value)} placeholder="We provide residential, nursing, dementia, respite, and palliative care…"></textarea>
              </div>
            </div>
            <div className="toolbar">
              <div className="right"></div>
              <button className="btn" onClick={addFaq}>
                <i className="fa-solid fa-plus"></i>&nbsp;Add FAQ
              </button>
            </div>
            <div style={{marginTop:'10px'}}>
              {faqs.map((f,i)=>(
                <div key={i} style={{background:'#f0f4f8', padding:'8px', borderRadius:'8px', marginBottom:'6px'}}>
                  <strong>{f.question}</strong>
                  <div className="muted" style={{fontSize:'13px'}}>{f.answer}</div>
                </div>
              ))}
            </div>
            <div className="toolbar">
              <div className="right"></div>
              <button className="btn" onClick={copyFaqs}>
                <i className="fa-solid fa-copy"></i>&nbsp;Copy JSON
              </button>
            </div>
          </section>
        )}

        {activeView === 'kiosk-links' && (
          <section className="panel">
            <h2>Reception Kiosk Links</h2>
            <p>Open these links on the tablet/device at each reception desk.</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px', marginTop:'20px'}}>
              {[
                {id: 'barry', name: 'Bellavista Barry'},
                {id: 'cardiff', name: 'Bellavista Cardiff'},
                {id: 'waverley', name: 'Waverley Care Centre'},
                {id: 'college-fields', name: 'College Fields'},
                {id: 'baltimore', name: 'Baltimore Care Home'},
                {id: 'meadow-vale', name: 'Meadow Vale Cwtch'}
              ].map(home => (
                <div key={home.id} style={{border:'1px solid #e0e0e0', borderRadius:'10px', padding:'20px', background:'white'}}>
                  <h3>{home.name}</h3>
                  <div style={{marginTop:'15px'}}>
                    <a 
                      href={`/kiosk/${home.id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn"
                      style={{display:'block', textAlign:'center', textDecoration:'none'}}
                    >
                      <i className="fa-solid fa-external-link-alt"></i> Open Kiosk
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeView === 'scheduled-tours' && (
          <section className="panel">
            <h2>Scheduled Tours</h2>
            <div className="toolbar">
              <input placeholder="Search by name, location, phone..." style={{flex:1}} value={bookingSearch} onChange={e=>setBookingSearch(e.target.value)}/>
              <button className="btn small" onClick={() => setShowDownloadModal(true)} style={{marginRight:'8px'}}>
                <i className="fa-solid fa-download"></i>&nbsp;Download Excel
              </button>
              <button className="btn ghost small" onClick={loadBookings}><i className="fa-solid fa-rotate"></i>&nbsp;Refresh</button>
            </div>
            
            {showDownloadModal && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}>
                <div style={{background: 'white', padding: '20px', borderRadius: '8px', width: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}}>
                  <h3 style={{marginTop: 0, marginBottom: '20px'}}>Download Bookings</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <button className="btn" onClick={() => handleDownload('all')}>
                      <i className="fa-solid fa-file-csv"></i>&nbsp;Download All Requests
                    </button>
                    <button className="btn" style={{background: '#28a745', color: 'white', border: 'none'}} onClick={() => handleDownload('visited')}>
                      <i className="fa-solid fa-check-double"></i>&nbsp;Download Visited Only
                    </button>
                    <button className="btn ghost" onClick={() => setShowDownloadModal(false)} style={{marginTop: '10px'}}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{marginTop:'16px', overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f7f9fc'}}>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Name</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Phone</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Email</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Location</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Preferred</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Created</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Status</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Visited?</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter(b => {
                      const q = bookingSearch.trim().toLowerCase();
                      if (!q) return true;
                      return [
                        b.name, b.phone, b.email, b.location, b.preferredDate, b.preferredTime
                      ].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
                    })
                    .map(b => (
                      <tr key={b.id}>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.name}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.phone}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.email}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.location}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.preferredDate} • {b.preferredTime}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{new Date(b.createdAt).toLocaleString()}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>
                          <span style={{
                            background: b.status === 'visited' ? '#d4edda' : (b.status === 'cancelled' ? '#f8d7da' : '#eaf6ff'), 
                            color: b.status === 'visited' ? '#155724' : (b.status === 'cancelled' ? '#721c24' : '#0366d6'), 
                            padding:'4px 8px', borderRadius:'12px', fontSize:'12px'
                          }}>
                            {b.status || 'requested'}
                          </span>
                        </td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>
                          <button 
                            className="btn small" 
                            style={{marginRight:'5px', background: b.status === 'visited' ? '#28a745' : '#eee', color: b.status === 'visited' ? 'white' : '#333'}}
                            onClick={() => updateBookingStatus(b.id, 'visited')}
                            title="Mark as Visited"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button 
                            className="btn small"
                            style={{background: b.status === 'cancelled' ? '#dc3545' : '#eee', color: b.status === 'cancelled' ? 'white' : '#333'}}
                            onClick={() => updateBookingStatus(b.id, 'cancelled')}
                            title="Mark as Cancelled"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{padding:'20px', textAlign:'center', color:'#666'}}>No tour requests yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === 'care-enquiries' && (
          <section className="panel">
            <h2>Care Enquiries</h2>
            <div className="toolbar">
              <input placeholder="Search by name, phone, type, location..." style={{flex:1}} value={enquirySearch} onChange={e=>setEnquirySearch(e.target.value)} />
              <button className="btn ghost small" onClick={loadEnquiries}><i className="fa-solid fa-rotate"></i>&nbsp;Refresh</button>
            </div>
            <div style={{marginTop:'16px', overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f7f9fc'}}>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Name</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Phone</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Email</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Type</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Location</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Message</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Created</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries
                    .filter(e => {
                      const q = enquirySearch.trim().toLowerCase();
                      if (!q) return true;
                      return [e.name, e.phone, e.email, e.enquiryType, e.location, e.message]
                        .filter(Boolean).some(v => String(v).toLowerCase().includes(q));
                    })
                    .map(e => (
                      <tr key={e.id}>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.name}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.phone}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.email}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.enquiryType}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.location}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.message}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{new Date(e.createdAt).toLocaleString()}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}><span style={{background:'#fff4e5', color:'#a15c00', padding:'4px 8px', borderRadius:'12px', fontSize:'12px'}}>{e.status || 'received'}</span></td>
                      </tr>
                    ))}
                  {enquiries.length === 0 && (
                    <tr><td colSpan="8" style={{padding:'20px', textAlign:'center', color:'#666'}}>No enquiries yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === 'career-applications' && (
          <section className="panel">
            <h2>Career Applications</h2>
            <div className="toolbar">
              <input placeholder="Search by name, phone, position..." style={{flex:1}} value={applicationSearch} onChange={e=>setApplicationSearch(e.target.value)} />
              <button className="btn ghost small" onClick={loadApplications}><i className="fa-solid fa-rotate"></i>&nbsp;Refresh</button>
            </div>
            <div style={{marginTop:'16px', overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f7f9fc'}}>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Name</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Phone</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Position</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Message</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Created</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications
                    .filter(a => {
                      const q = applicationSearch.trim().toLowerCase();
                      if (!q) return true;
                      return [a.name, a.phone, a.position, a.message]
                        .filter(Boolean).some(v => String(v).toLowerCase().includes(q));
                    })
                    .map(a => (
                      <tr key={a.id}>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{a.name}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{a.phone}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{a.position}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{a.message}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{new Date(a.createdAt).toLocaleString()}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}><span style={{background:'#eaf6ff', color:'#0366d6', padding:'4px 8px', borderRadius:'12px', fontSize:'12px'}}>{a.status || 'submitted'}</span></td>
                      </tr>
                    ))}
                  {applications.length === 0 && (
                    <tr><td colSpan="6" style={{padding:'20px', textAlign:'center', color:'#666'}}>No applications yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === 'manage-users' && (
          <section className="panel">
            <h2>Manage Users</h2>
            <div className="grid cols-3">
              <div className="field"><label>Full Name</label><input type="text" placeholder="Jane Doe" value={userForm.name} onChange={e=>handleUserChange('name', e.target.value)} /></div>
              <div className="field"><label>Email</label><input type="email" placeholder="jane@bellavista.co.uk" value={userForm.email} onChange={e=>handleUserChange('email', e.target.value)} /></div>
              <div className="field">
                <label>Role</label>
                <select value={userForm.role} onChange={e=>handleUserChange('role', e.target.value)}>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
            <div className="toolbar">
              <div className="right"></div>
              <button className="btn" onClick={copyUserJson}>
                <i className="fa-solid fa-user-plus"></i>&nbsp;Copy JSON
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminConsole;
