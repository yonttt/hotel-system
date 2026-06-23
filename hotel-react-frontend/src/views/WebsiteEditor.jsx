import { useState, useEffect } from 'react';
import Layout from '../ui/Layout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const WebsiteEditor = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState({
    hero_title: '',
    hero_subtitle: '',
    about_title: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cms/content`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedData = {};
        data.forEach(item => {
          mappedData[item.setting_key] = item.setting_value || '';
        });
        setContent(prev => ({...prev, ...mappedData}));
      }
    } catch (error) {
      console.error('Error fetching website content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/cms/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(content)
      });
      
      if (response.ok) {
        setMessage('Website content updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update content - you may not have permission.');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      setMessage('Error updating content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div style={{padding: '20px'}}>Loading Editor...</div></Layout>;

  return (
    <Layout>
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Website Content Editor</h1>
        
        {message && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '20px', 
            backgroundColor: message.includes('success') ? '#d4edda' : '#fee2e2',
            color: message.includes('success') ? '#155724' : '#991b1b',
            borderRadius: '4px'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '24px', minHeight: '600px' }}>
          {/* Inner Sidebar for 4 Menus */}
          <div style={{ width: '250px', borderRight: '1px solid #e5e7eb', paddingRight: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => setActiveTab('hero')}
                style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'hero' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'hero' ? '#1d4ed8' : '#374151',
                  fontWeight: activeTab === 'hero' ? 'bold' : 'normal',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background-color 0.2s'
                }}
              >
                1. Hero Banner
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('rooms')}
                style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'rooms' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'rooms' ? '#1d4ed8' : '#374151',
                  fontWeight: activeTab === 'rooms' ? 'bold' : 'normal',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background-color 0.2s'
                }}
              >
                2. Rooms & Offers
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('gallery')}
                style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'gallery' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'gallery' ? '#1d4ed8' : '#374151',
                  fontWeight: activeTab === 'gallery' ? 'bold' : 'normal',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background-color 0.2s'
                }}
              >
                3. Gallery Images
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('about')}
                style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'about' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'about' ? '#1d4ed8' : '#374151',
                  fontWeight: activeTab === 'about' ? 'bold' : 'normal',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background-color 0.2s'
                }}
              >
                4. About & Contact
              </button>
            </div>
          </div>

          {/* Form Content Area */}
          <div style={{ flex: 1 }}>
            <form onSubmit={handleSave}>
              {activeTab === 'hero' && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Homepage Hero Settings</h3>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Website Main Heading (Hero Title)</label>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>This is the large text that greets users when they first open the website.</p>
                    <input 
                      type="text" 
                      value={content.hero_title || ''} 
                      onChange={(e) => setContent({...content, hero_title: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Website Subheading (Hero Subtitle)</label>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>The smaller description text located right beneath the main heading.</p>
                    <input 
                      type="text" 
                      value={content.hero_subtitle || ''} 
                      onChange={(e) => setContent({...content, hero_subtitle: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Homepage Banner Image 1 (Paste Image Link)</label>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Paste the web link (URL) of the primary background image.</p>
                    <input 
                      type="text" 
                      value={content.hero_image_1 || ''} 
                      onChange={(e) => setContent({...content, hero_image_1: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                      placeholder="https://images.unsplash.com/..."
                    />
                    {content.hero_image_1 && <img src={content.hero_image_1} alt="Preview 1" style={{ marginTop: '10px', maxHeight: '100px', borderRadius: '4px' }} />}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Homepage Banner Image 2 (Paste Image Link)</label>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Paste the web link for the second sliding banner image.</p>
                    <input 
                      type="text" 
                      value={content.hero_image_2 || ''} 
                      onChange={(e) => setContent({...content, hero_image_2: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                      placeholder="https://images.unsplash.com/..."
                    />
                    {content.hero_image_2 && <img src={content.hero_image_2} alt="Preview 2" style={{ marginTop: '10px', maxHeight: '100px', borderRadius: '4px' }} />}
                  </div>
                </div>
              )}

              {activeTab === 'rooms' && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Rooms & Offers Setup</h3>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Executive Room Preview Image Link</label>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>The picture shown for the Executive Suite listing.</p>
                    <input 
                      type="text" 
                      value={content.room_image_executive || ''} 
                      onChange={(e) => setContent({...content, room_image_executive: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                      placeholder="https://images.unsplash.com/..."
                    />
                    {content.room_image_executive && <img src={content.room_image_executive} alt="Exe Room Preview" style={{ marginTop: '10px', maxHeight: '100px', borderRadius: '4px' }} />}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Deluxe Room Preview Image Link</label>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>The picture shown for the Deluxe Room listing.</p>
                    <input 
                      type="text" 
                      value={content.room_image_deluxe || ''} 
                      onChange={(e) => setContent({...content, room_image_deluxe: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                      placeholder="https://images.unsplash.com/..."
                    />
                    {content.room_image_deluxe && <img src={content.room_image_deluxe} alt="Deluxe Room Preview" style={{ marginTop: '10px', maxHeight: '100px', borderRadius: '4px' }} />}
                  </div>
                  
                  <div style={{ marginTop: '25px', marginBottom: '15px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px dashed #eee', paddingBottom: '5px', marginBottom: '10px' }}>Special Offers</h4>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Special Offer Title</label>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>The main headline for your current promotional offer.</p>
                    <input 
                      type="text" 
                      value={content.offer_title_1 || ''} 
                      onChange={(e) => setContent({...content, offer_title_1: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Special Offer Description</label>
                    <input 
                      type="text" 
                      value={content.offer_desc_1 || ''} 
                      onChange={(e) => setContent({...content, offer_desc_1: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Gallery Images</h3>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Gallery Image 1 Link</label>
                    <input 
                      type="text" 
                      value={content.gallery_img_1 || ''} 
                      onChange={(e) => setContent({...content, gallery_img_1: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                      placeholder="https://images.unsplash.com/..."
                    />
                    {content.gallery_img_1 && <img src={content.gallery_img_1} alt="Gallery 1" style={{ marginTop: '10px', maxHeight: '100px', borderRadius: '4px' }} />}
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Gallery Image 2 Link</label>
                    <input 
                      type="text" 
                      value={content.gallery_img_2 || ''} 
                      onChange={(e) => setContent({...content, gallery_img_2: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                      placeholder="https://images.unsplash.com/..."
                    />
                    {content.gallery_img_2 && <img src={content.gallery_img_2} alt="Gallery 2" style={{ marginTop: '10px', maxHeight: '100px', borderRadius: '4px' }} />}
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>About & Contact Settings</h3>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>About Us Title</label>
                    <input 
                      type="text" 
                      value={content.about_title || ''} 
                      onChange={(e) => setContent({...content, about_title: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px dashed #eee', paddingBottom: '5px', marginBottom: '10px' }}>Contact Information</h4>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
                    <input 
                      type="text" 
                      value={content.phone_number || ''} 
                      onChange={(e) => setContent({...content, phone_number: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
                    <input 
                      type="text" 
                      value={content.contact_email || ''} 
                      onChange={(e) => setContent({...content, contact_email: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Physical Address</label>
                    <input 
                      type="text" 
                      value={content.contact_address || ''} 
                      onChange={(e) => setContent({...content, contact_address: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{ 
                    padding: '12px 24px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    width: '100%'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Website Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WebsiteEditor;
