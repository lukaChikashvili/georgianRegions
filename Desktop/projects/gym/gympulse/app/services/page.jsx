"use client";

import React, { useState, Suspense } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import dynamic from 'next/dynamic';
import { useUser } from '@clerk/nextjs';


const ToastRecorder = dynamic(() => import('@/components/ToastRecorder'), { ssr: false });
const InvitationDesigner = dynamic(() => import('@/components/InvitationDesigner'), { ssr: false });
const QRCodeGenerator = dynamic(() => import('@/components/QRCodeGenerator'), { ssr: false });

function ServicesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemorial, setSelectedMemorial] = useState(null);
  const [activeTab, setActiveTab] = useState('record');

  const { user } = useUser();

  const memorials = useQuery(api.memorials.getAllPublicMemorials);

  const filteredMemorials = memorials?.filter((memorial) => {
    const fullName = `${memorial.firstName} ${memorial.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 text-white">
      <h1 className="text-3xl font-serif text-[#FFF5D6] mb-8">სამგლოვიარო სერვისები</h1>
      
      {!selectedMemorial ? (
   
        <div className="bg-[#121214]/50 p-8 border border-[#D4AF37]/20 rounded-2xl">
          <h2 className="text-[#D4AF37] mb-4">მოძებნეთ მემორიალი:</h2>
          <input 
            type="text" 
            className="w-full bg-black border border-[#D4AF37]/30 p-3 rounded-lg text-white"
            placeholder="ჩაწერეთ სახელი ან გვარი..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="mt-4 space-y-2">
            {searchQuery.length > 0 && filteredMemorials?.map((m) => (
              <button 
                key={m._id}
                onClick={() => setSelectedMemorial(m)}
                className="block w-full text-left p-3 hover:bg-[#D4AF37]/10 rounded border border-transparent hover:border-[#D4AF37]/20 transition"
              >
                {m.firstName} {m.lastName}
              </button>
            ))}
          </div>
        </div>
      ) : (
      
        <>
          <button 
            onClick={() => setSelectedMemorial(null)} 
            className="text-sm text-gray-500 mb-4 hover:text-[#D4AF37]"
          >
            ← უკან დაბრუნება
          </button>
          
          <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
            {['record', 'invite', 'qr'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-4 py-2 rounded-full text-sm transition ${
                  activeTab === tab 
                    ? 'bg-[#D4AF37] text-black font-bold' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab === 'record' ? 'აუდიო' : tab === 'invite' ? 'მოსაწვევი' : 'QR კოდი'}
              </button>
            ))}
          </div>

          <div className="bg-[#121214]/50 p-8 border border-[#D4AF37]/20 rounded-2xl min-h-[400px]">
             <h2 className="text-xl text-[#FFF5D6] mb-6">
                {activeTab === 'record' ? 'აუდიო სადღეგრძელო' : 
                 activeTab === 'invite' ? 'მოსაწვევი ბარათი' : 'QR კოდის გენერაცია'}
             </h2>
             
            
             {activeTab === 'record' && <ToastRecorder memorialId={selectedMemorial._id} />}
             {activeTab === 'invite' && selectedMemorial?.creatorId === user?.id && (
  <InvitationDesigner memorial={selectedMemorial} />
)}

{activeTab === 'invite' && selectedMemorial?.creatorId !== user?.id && (
  <p className="text-gray-500">მხოლოდ მემორიალის შემქმნელს შეუძლია მოსაწვევის დიზაინის შექმნა.</p>
)}
             {activeTab === 'qr' && <QRCodeGenerator memorial={selectedMemorial} />}
          </div>
        </>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="text-[#D4AF37] p-20">იტვირთება გვერდი...</div>}>
      <ServicesContent />
    </Suspense>
  );
}