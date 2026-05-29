import React, { useState, useRef } from 'react';
import floralBg from '../public/invitation.png'; 
import blackGoldBg from '../public/invitation1.png'; 
import invitation2 from '../public/invitation2.png';
import * as htmlToImage from 'html-to-image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

const TEMPLATES = [
  { id: 1, name: 'Elegant Floral', bg: floralBg },
  { id: 2, name: 'Black & Gold', bg: blackGoldBg },
  { id: 3, name: 'Classic Gold', bg: invitation2 },
  { id: 4, name: 'Minimalist Gold', bg: invitation2 },
];

const InvitationDesigner = ({ memorial }) => {
  const router = useRouter();

  const [view, setView] = useState('selector');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({ 
    name: 'გარდაცვლილის სახელი', 
    date: 'თარიღი და დრო', 
    location: 'მისამართი' 
  });

 
  const [portraitFile, setPortraitFile] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState('');
  const portraitInputRef = useRef(null);

  const generateUploadUrl = useMutation(api.services.generateUploadUrl); 
  const saveInvitation = useMutation(api.services.saveInvitationImage); 

  const handlePortraitUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (portraitPreview) URL.revokeObjectURL(portraitPreview);
    setPortraitFile(file);
    setPortraitPreview(URL.createObjectURL(file));
  };

  const handleRemovePortrait = () => {
    if (portraitPreview) URL.revokeObjectURL(portraitPreview);
    setPortraitFile(null);
    setPortraitPreview('');
    if (portraitInputRef.current) portraitInputRef.current.value = '';
  };

  const handleSaveToDatabase = async () => {
    const cardElement = document.getElementById('invitation-card');
    
    const dataUrl = await htmlToImage.toPng(cardElement, { 
      pixelRatio: 2,
      skipFonts: true, 
      filter: (node) => {
        if (node.tagName === 'LINK') return false; 
        return true;
      }
    });
    
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    const uploadUrl = await generateUploadUrl();
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": blob.type },
      body: blob,
    });
    const { storageId } = await result.json();
    
    await saveInvitation({ 
      memorialId: memorial._id,
      storageId 
    });
    
    alert("მოწვევა წარმატებით შეინახა მემორიალურ გვერდზე!");
    router.push('/admin');
  };

  const goldTextStyle = {
    background: 'linear-gradient(to bottom, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    margin: '12px 0'
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
        <button 
          onClick={() => setView('selector')} 
          style={{ marginBottom: '20px', cursor: 'pointer', background: '#D4AF37', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold' }}
        >
          ← უკან
        </button>

        <h3 style={{ marginBottom: '20px' }}>შეცვალეთ ინფორმაცია</h3>

       
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              {key === 'name' ? 'გარდაცვლილის სახელი' : key === 'date' ? 'თარიღი და დრო' : 'მისამართი'}
            </label>
            <input 
              value={value} 
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} 
              style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #D4AF37', background: '#111', color: '#D4AF37', boxSizing: 'border-box' }} 
            />
          </div>
        ))}

      
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>პორტრეტი (სურვილისამებრ)</label>
          <input 
            ref={portraitInputRef}
            type="file" 
            accept="image/*" 
            onChange={handlePortraitUpload} 
            style={{ display: 'none' }} 
          />

          {portraitPreview ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={portraitPreview} 
                style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #D4AF37' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => portraitInputRef.current?.click()}
                  style={{ cursor: 'pointer', background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '6px 14px', borderRadius: '4px', fontSize: '12px' }}
                >
                  შეცვლა
                </button>
                <button 
                  onClick={handleRemovePortrait}
                  style={{ cursor: 'pointer', background: 'transparent', border: '1px solid #555', color: '#888', padding: '6px 14px', borderRadius: '4px', fontSize: '12px' }}
                >
                  წაშლა
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => portraitInputRef.current?.click()}
              style={{ 
                width: '100%', padding: '16px', cursor: 'pointer', background: 'transparent', 
                border: '1px dashed #D4AF37', borderRadius: '6px', color: '#D4AF37', 
                fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              + პორტრეტის ატვირთვა
            </button>
          )}
        </div>

        <button 
          onClick={handleSaveToDatabase} 
          style={{ marginTop: '8px', cursor: 'pointer', background: '#D4AF37', color: '#000', border: 'none', padding: '12px 20px', borderRadius: '4px', fontWeight: 'bold', width: '100%' }}
        >
          შენახვა მემორიალურ გვერდზე
        </button>
      </div>

    
      <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
        <div 
          id="invitation-card" 
          style={{ 
            width: '350px', height: '520px', padding: '36px 40px', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.2)',
            backgroundImage: `url(${selectedTemplate.bg.src})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            borderRadius: '12px', backgroundColor: '#000', border: '1px solid #D4AF37'
          }}
        >
          <h4 style={{ margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '2px', color: '#D4AF37', fontSize: '11px' }}>
            In Loving Memory
          </h4>

       
          {portraitPreview && (
            <div style={{ 
              width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', 
              border: '2px solid #D4AF37', margin: '12px 0',
              boxShadow: '0 0 16px rgba(212,175,55,0.3)'
            }}>
              <img 
                src={portraitPreview} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)' }} 
              />
            </div>
          )}

          <h2 style={{ fontSize: '1.8rem', ...goldTextStyle }}>{formData.name}</h2>

          <div style={{ marginTop: 'auto', marginBottom: '16px' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '5px 0', color: '#fff' }}>{formData.date}</p>
            <p style={{ fontSize: '0.95rem', opacity: '0.85', color: '#ddd' }}>{formData.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationDesigner;