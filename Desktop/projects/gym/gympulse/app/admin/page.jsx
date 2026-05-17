"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { Trash2, Edit3, Eye, MapPin, Calendar, X, Check } from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();
  
  
  const myMemorials = useQuery(api.memorials.getMyMemorials, user?.id ? { creatorId: user.id } : "skip");
  const deleteMemorialMutation = useMutation(api.memorials.deleteMemorial);
  const updateMemorialMutation = useMutation(api.memorials.updateMemorial);

  const [editingMemorial, setEditingMemorial] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async (id) => {
    if (!confirm("ნამდვილად გსურთ ამ მემორიალის სამუდამოდ წაშლა?")) return;
    try {
      await deleteMemorialMutation({ id });
    } catch (err) {
      alert("წაშლა ვერ მოხერხდა: " + err.message);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateMemorialMutation({
        id: editingMemorial._id,
        firstName: editingMemorial.firstName,
        lastName: editingMemorial.lastName,
        epitaph: editingMemorial.epitaph,
        biography: editingMemorial.biography,
        location: editingMemorial.location,
        mainPortraitUrl: editingMemorial.mainPortraitUrl || undefined,
        privacyType: editingMemorial.privacyType,
      });
      setEditingMemorial(null); 
    } catch (err) {
      alert("განახლება ვერ მოხერხდა: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded || myMemorials === undefined) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-gray-300 font-sans py-20 px-6 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#1A150F] to-transparent opacity-30 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
       
        <div className="mb-12 mt-12">
          <h1 className="font-serif text-3xl md:text-4xl font-light text-[#FFF5D6] tracking-wide">
            მართვის პანელი
          </h1>
          <p className="text-xs text-gray-500 mt-1">თქვენს მიერ შექმნილი ციფრული მემორიალების სრული სია.</p>
        </div>

     
        {myMemorials.length === 0 ? (
          <div className="text-center py-20 bg-[#121214]/20 border border-white/5 rounded-2xl max-w-xl">
            <p className="text-gray-500 text-sm font-light mb-4">თქვენ ჯერ არ შეგიქმნიათ არცერთი მემორიალი.</p>
            <Link href="/memorial" className="text-xs uppercase tracking-wider text-[#D4AF37] hover:underline">
              შექმენი პირველი მემორიალი →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myMemorials.map((memorial) => (
              <div key={memorial._id} className="bg-[#121214]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between h-72 shadow-xl group hover:border-white/10 transition">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                      memorial.privacyType === 'public' 
                        ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                    }`}>
                      {memorial.privacyType === 'public' ? 'საჯარო' : 'პირადი'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-light">
                      <Calendar size={12} className="text-[#D4AF37]/50" />
                      <span>{memorial.birthDate.split('-')[0]} - {memorial.deathDate.split('-')[0]}</span>
                    </div>
                  </div>

                  <h2 className="font-serif text-xl text-[#FFF5D6] tracking-wide mb-1">
                    {memorial.firstName} {memorial.lastName}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-light mb-3">
                    <MapPin size={12} className="text-gray-600" />
                    <span>{memorial.location}</span>
                  </div>
                  <p className="text-xs text-gray-400 italic line-clamp-2 border-l border-[#D4AF37]/20 pl-2 font-serif">
                    "{memorial.epitaph}"
                  </p>
                </div>

                
                <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between gap-2">
                  <Link 
                    href={`/discover/${memorial.urlSlug}`}
                    className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-[#FFF5D6] hover:border-[#D4AF37]/20 transition flex items-center justify-center cursor-pointer"
                    title="ნახვა"
                  >
                    <Eye size={14} />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingMemorial(memorial)}
                      className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-amber-400 hover:border-amber-500/20 transition flex items-center justify-center cursor-pointer"
                      title="რედაქტირება"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(memorial._id)}
                      className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-red-400 hover:border-red-500/20 transition flex items-center justify-center cursor-pointer"
                      title="წაშლა"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

 
        {editingMemorial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 mt-36 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
              <button 
                onClick={() => setEditingMemorial(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
              >
                <X size={18} />
              </button>

              <h2 className="font-serif text-2xl text-[#FFF5D6] mb-6 font-light">მემორიალის რედაქტირება</h2>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-gray-400">სახელი</label>
                    <input type="text" className="form-input" value={editingMemorial.firstName} onChange={(e) => setEditingMemorial({...editingMemorial, firstName: e.target.value})} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-gray-400">გვარი</label>
                    <input type="text" className="form-input" value={editingMemorial.lastName} onChange={(e) => setEditingMemorial({...editingMemorial, lastName: e.target.value})} required />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-gray-400">ცხოვრების ადგილი</label>
                  <input type="text" className="form-input" value={editingMemorial.location} onChange={(e) => setEditingMemorial({...editingMemorial, location: e.target.value})} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-gray-400">პორტრეტის URL</label>
                  <input type="url" className="form-input" value={editingMemorial.mainPortraitUrl || ''} onChange={(e) => setEditingMemorial({...editingMemorial, mainPortraitUrl: e.target.value})} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-gray-400">მოკლე ეპიტაფია</label>
                  <input type="text" className="form-input" value={editingMemorial.epitaph} onChange={(e) => setEditingMemorial({...editingMemorial, epitaph: e.target.value})} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-gray-400">ბიოგრაფია</label>
                  <textarea rows={4} className="form-input resize-none py-2" value={editingMemorial.biography} onChange={(e) => setEditingMemorial({...editingMemorial, biography: e.target.value})} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-gray-400">წვდომის ტიპი</label>
                  <select className="form-input bg-[#0D0D0F]" value={editingMemorial.privacyType} onChange={(e) => setEditingMemorial({...editingMemorial, privacyType: e.target.value})}>
                    <option value="public">საჯარო (Public)</option>
                    <option value="private">პირადი (Private)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button type="button" onClick={() => setEditingMemorial(null)} className="px-4 py-2 rounded-xl border border-white/5 text-xs uppercase tracking-wider font-medium hover:bg-white/5 transition">
                    გაუქმება
                  </button>
                  <button type="submit" disabled={isUpdating} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider transition hover:brightness-110 shadow-lg shadow-[#D4AF37]/5">
                    {isUpdating ? 'ინახება...' : 'ცვლილებების შენახვა'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          background-color: rgba(18, 18, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          padding: 0.55rem 0.85rem;
          font-size: 0.85rem;
          color: #e5e7eb;
          outline: none;
          transition: all 0.3s;
        }
        .form-input:focus {
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.03);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;