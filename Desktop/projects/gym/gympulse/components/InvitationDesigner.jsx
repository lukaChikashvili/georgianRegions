import React, { useState } from 'react';
import floralBg from '../public/invitation.png'; 
import blackGoldBg from '../public/invitation1.png'; 
import invitation2 from '../public/invitation2.png';
import * as htmlToImage from 'html-to-image';

const TEMPLATES = [
  { id: 1, name: 'Elegant Floral', bg: floralBg },
  { id: 2, name: 'Black & Gold', bg: blackGoldBg },
  { id: 3, name: 'Classic Gold', bg: invitation2 },
  { id: 4, name: 'Minimalist Gold', bg: invitation2 },
];

const InvitationDesigner = () => {
  const [view, setView] = useState('selector');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({ 
    name: 'გარდაცვლილის სახელი', 
    date: 'თარიღი და დრო', 
    location: 'მისამართი' 
  });

  const handleDownload = () => {
    const cardElement = document.getElementById('invitation-card');
    
    htmlToImage.toPng(cardElement, { pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'funeral-invitation.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      });
  };

  const goldTextStyle = {
    background: 'linear-gradient(to bottom, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    margin: '20px 0'
  };

  if (view === 'selector') {
    return (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#D4AF37', marginBottom: '2rem' }}>აირჩიეთ დიზაინი</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {TEMPLATES.map((t) => (
            <div 
              key={t.id} 
              onClick={() => { setSelectedTemplate(t); setView('editor'); }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              style={{ 
                height: '240px', cursor: 'pointer', borderRadius: '12px', 
                backgroundImage: `url(${t.bg.src})`, backgroundSize: 'cover', backgroundPosition: 'center',
                border: '2px solid #D4AF37', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <div style={{ background: 'rgba(0,0,0,0.7)', padding: '12px 24px', borderRadius: '8px', border: '1px solid #D4AF37', color: '#D4AF37', fontWeight: 'bold' }}>
                {t.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '40px', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'nowrap', color: '#D4AF37', maxWidth: '1200px', margin: '0 auto' }}>
      
      
      <div style={{ flex: '1', minWidth: '350px' }}>
        <button onClick={() => setView('selector')} style={{ marginBottom: '20px', cursor: 'pointer', background: '#D4AF37', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold' }}>← უკან</button>
        <h3>შეცვალეთ ინფორმაცია</h3>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>{key === 'name' ? 'გარდაცვლილის სახელი' : key === 'date' ? 'თარიღი და დრო' : 'მისამართი'}</label>
            <input value={value} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #D4AF37', background: '#111', color: '#D4AF37' }} />
          </div>
        ))}
        
        
        <button onClick={handleDownload} style={{ marginTop: '20px', cursor: 'pointer', background: '#D4AF37', color: '#000', border: 'none', padding: '12px 20px', borderRadius: '4px', fontWeight: 'bold', width: '100%' }}>
          სურათის ჩამოტვირთვა
        </button>
      </div>

      {/* Preview Card */}
      <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
        <div id="invitation-card" style={{ 
          width: '350px', height: '500px', padding: '40px', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.2)',
          backgroundImage: `url(${selectedTemplate.bg.src})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          borderRadius: '12px', backgroundColor: '#000', border: '1px solid #D4AF37'
        }}>
          <h4 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>In Loving Memory</h4>
          <h2 style={{ fontSize: '2.2rem', ...goldTextStyle }}>{formData.name}</h2>
          <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0' }}>{formData.date}</p>
            <p style={{ fontSize: '1rem', opacity: '0.9' }}>{formData.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationDesigner;