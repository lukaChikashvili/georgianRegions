"use client";

import React, { useState, Suspense } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import dynamic from 'next/dynamic';


const ToastRecorder = dynamic(() => import('@/components/ToastRecorder'), {
  ssr: false,
  loading: () => <p className="text-gray-500 italic">იტვირთება ჩამწერი...</p>
});


function ServicesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemorial, setSelectedMemorial] = useState(null);

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
        <div className="bg-[#121214]/50 p-8 border border-[#D4AF37]/20 rounded-2xl animate-in fade-in">
          <button onClick={() => setSelectedMemorial(null)} className="text-sm text-gray-500 mb-4 hover:text-[#D4AF37]">← უკან დაბრუნება</button>
          <h2 className="text-xl text-[#FFF5D6] mb-6">სადღეგრძელო: {selectedMemorial.firstName} {selectedMemorial.lastName}-სთვის</h2>
          <ToastRecorder memorialId={selectedMemorial._id} />
        </div>
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