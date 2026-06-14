"use client";

import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { Trash2, Edit3, Eye, MapPin, Calendar, X, Check, Bell, Upload, Plus, Loader2, Flag, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import InvitationDisplay from '../../components/InvitationDisplay';
import FamilyGroupSection from '../../components/FamilyGroupSection';



const REASON_LABELS = {
  fake_memorial: "ყალბი მემორიალი",
  wrong_person: "პიროვნების ვინაობა არასწორია",
  inappropriate_content: "შეუფერებელი კონტენტი",
  spam_or_scam: "სპამი / თაღლითობა",
  family_objects: "ოჯახის პროტესტი",
  other: "სხვა",
};


function AudioPlayer({ storageId }) {
  const url = useQuery(api.services.getToastUrl, { storageId });
  if (!url) return <div className="text-gray-500 text-xs">იტვირთება...</div>;
  return (
    <audio controls src={url} className="w-full h-9 rounded-lg" style={{ filter: 'invert(0.85) hue-rotate(180deg)' }} />
  );
}


function ToastNotificationCard({ toast, memorial, onApprove, onReject }) {
  const [isApproving, setIsApproving] = useState(false);
  const handleApprove = async () => {
    setIsApproving(true);
    await onApprove(toast._id);
    setIsApproving(false);
  };
  return (
    <div className="bg-[#121214]/60 border border-yellow-500/30 rounded-xl p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[#FFF5D6] font-medium text-sm">ახალი სადღეგრძელო: {memorial.firstName} {memorial.lastName}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {toast.authorName} • {new Date(toast.createdAt).toLocaleDateString('ka-GE', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">მოლოდინში</span>
      </div>
      <div className="mb-4"><AudioPlayer storageId={toast.audioUrl} /></div>
      <div className="flex gap-2">
        <button onClick={handleApprove} disabled={isApproving} className="flex-1 px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#b8962d] transition disabled:opacity-50 flex items-center justify-center gap-2">
          <Check size={14} />
          {isApproving ? 'იტვირთება...' : 'დამტკიცება და გამოქვეყნება'}
        </button>
        <button onClick={() => onReject(toast._id)} className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 text-xs hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}


function StorageImage({ storageId, className }) {
  const url = useQuery(api.services.getStorageUrl, storageId ? { storageId } : "skip");
  if (!url) return <div className={`${className} bg-white/5 animate-pulse rounded-xl`} />;
  return <img src={url} className={className} />;
}


function ReportCard({ report, onDismiss, onAction }) {
  const memorial = useQuery(api.memorials.getMemorialBySlug,
    report.memorialId ? { urlSlug: "_lookup_by_id" } : "skip"
  );

  const [isDismissing, setIsDismissing] = useState(false);
  const [isActioning, setIsActioning] = useState(false);

  const handleDismiss = async () => {
    setIsDismissing(true);
    await onDismiss(report._id);
    setIsDismissing(false);
  };

  const handleAction = async () => {
    if (!confirm("ნამდვილად გსურთ მემორიალის დახურვა? ის გახდება პირადი და დაიმალება საჯარო ჩამონათვალიდან.")) return;
    setIsActioning(true);
    await onAction(report._id, report.memorialId);
    setIsActioning(false);
  };

  const statusConfig = {
    pending: { label: "მოლოდინში", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
    reviewed: { label: "განხილული", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    dismissed: { label: "უარყოფილი", color: "text-gray-400 bg-white/5 border-white/10" },
    actioned: { label: "დახურულია", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  };

  const status = statusConfig[report.status] || statusConfig.pending;

  return (
    <div className={`bg-[#121214]/60 border rounded-xl p-5 backdrop-blur-sm space-y-4 transition ${
      report.status === "pending" ? "border-red-500/20" : "border-white/5 opacity-60"
    }`}>
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <Flag size={13} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#FFF5D6]">
              {REASON_LABELS[report.reason] || report.reason}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
              <Clock size={10} />
              {new Date(report.createdAt).toLocaleDateString('ka-GE', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border shrink-0 ${status.color}`}>
          {status.label}
        </span>
      </div>

     
      <div className="bg-[#0D0D0F]/60 rounded-xl p-3 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">მომხსენებელი:</span>
          <span className="text-gray-300">{report.reporterName || "ანონიმური"}</span>
        </div>
        {report.details && (
          <div className="pt-1.5 border-t border-white/5">
            <p className="text-gray-500 mb-1">დეტალები:</p>
            <p className="text-gray-300 font-light leading-relaxed">{report.details}</p>
          </div>
        )}
      </div>

     
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">მემორიალი:</span>
        <Link
          href={`/discover/${report.memorialSlug || ""}`}
          className="text-[#D4AF37] hover:underline flex items-center gap-1"
          target="_blank"
        >
          <Eye size={11} /> გახსნა
        </Link>
      </div>

      
      {report.status === "pending" && (
        <div className="flex gap-2 pt-1 border-t border-white/5">
          <button
            onClick={handleDismiss}
            disabled={isDismissing}
            className="flex-1 py-2 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isDismissing ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
            უარყოფა
          </button>
          <button
            onClick={handleAction}
            disabled={isActioning}
            className="flex-1 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-xs text-red-400 font-semibold transition disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isActioning ? <Loader2 size={12} className="animate-spin" /> : <AlertTriangle size={12} />}
            მემორიალის დახურვა
          </button>
        </div>
      )}
    </div>
  );
}


const AdminDashboard = () => {
  const { user, isLoaded } = useUser();

  const myMemorials = useQuery(api.memorials.getMyMemorials, user?.id ? { creatorId: user.id } : "skip");
  const deleteMemorialMutation = useMutation(api.memorials.deleteMemorial);
  const updateMemorialMutation = useMutation(api.memorials.updateMemorial);
  const generateUploadUrl = useMutation(api.services.generateUploadUrl);

  const allPendingToasts = useQuery(api.services.getAllPendingToastsForUser, user?.id ? { userId: user.id } : "skip");
  const approveToast = useMutation(api.services.approveToast);
  const rejectToast = useMutation(api.services.rejectToast);

  const pendingReports = useQuery(api.reports.getPendingReports);
  const dismissReportMutation = useMutation(api.reports.dismissReport);
  const actionReportMutation = useMutation(api.reports.actionReport);

  const [reportsFilter, setReportsFilter] = useState("pending"); 

  const [editingMemorial, setEditingMemorial] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [newPortraitFile, setNewPortraitFile] = useState(null);
  const [newPortraitPreview, setNewPortraitPreview] = useState('');
  const portraitInputRef = useRef(null);

  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
  const galleryInputRef = useRef(null);

  const openEditModal = (memorial) => {
    setEditingMemorial(memorial);
    setNewPortraitFile(null);
    setNewPortraitPreview('');
    setNewGalleryFiles([]);
    setNewGalleryPreviews([]);
  };

  const closeEditModal = () => {
    if (newPortraitPreview) URL.revokeObjectURL(newPortraitPreview);
    newGalleryPreviews.forEach(URL.revokeObjectURL);
    setEditingMemorial(null);
    setNewPortraitFile(null);
    setNewPortraitPreview('');
    setNewGalleryFiles([]);
    setNewGalleryPreviews([]);
  };

  const handlePortraitUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (newPortraitPreview) URL.revokeObjectURL(newPortraitPreview);
    setNewPortraitFile(file);
    setNewPortraitPreview(URL.createObjectURL(file));
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    const previews = files.map(f => URL.createObjectURL(f));
    setNewGalleryFiles(prev => [...prev, ...files]);
    setNewGalleryPreviews(prev => [...prev, ...previews]);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleRemoveNewGallery = (idx) => {
    URL.revokeObjectURL(newGalleryPreviews[idx]);
    setNewGalleryFiles(prev => prev.filter((_, i) => i !== idx));
    setNewGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadFile = async (file) => {
    const uploadUrl = await generateUploadUrl();
    const result = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!result.ok) throw new Error(`ფაილის ატვირთვა ვერ მოხერხდა: ${file.name}`);
    const { storageId } = await result.json();
    return storageId;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      let portraitId = editingMemorial.mainPortraitUrl;
      if (newPortraitFile) portraitId = await uploadFile(newPortraitFile);

      const newGalleryIds = [];
      for (const file of newGalleryFiles) newGalleryIds.push(await uploadFile(file));
      const mergedGallery = [...(editingMemorial.galleryUrls || []), ...newGalleryIds];

      await updateMemorialMutation({
        id: editingMemorial._id,
        firstName: editingMemorial.firstName,
        lastName: editingMemorial.lastName,
        epitaph: editingMemorial.epitaph,
        biography: editingMemorial.biography,
        location: editingMemorial.location,
        mainPortraitUrl: portraitId || undefined,
        galleryUrls: mergedGallery.length > 0 ? mergedGallery : undefined,
        privacyType: editingMemorial.privacyType,
      });
      closeEditModal();
    } catch (err) {
      alert("განახლება ვერ მოხერხდა: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("ნამდვილად გსურთ ამ მემორიალის სამუდამოდ წაშლა?")) return;
    try {
      await deleteMemorialMutation({ id });
    } catch (err) {
      alert("წაშლა ვერ მოხერხდა: " + err.message);
    }
  };

  const handleApproveToast = async (toastId) => { await approveToast({ toastId }); };
  const handleRejectToast = async (toastId) => {
    if (!confirm("ნამდვილად გსურთ ამ სადღეგრძელოს უარყოფა?")) return;
    await rejectToast({ toastId });
  };

  const handleDismissReport = async (reportId) => {
    await dismissReportMutation({ reportId });
  };

  const handleActionReport = async (reportId, memorialId) => {
    await actionReportMutation({ reportId, memorialId });
  };

  if (!isLoaded || myMemorials === undefined) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
      </div>
    );
  }

  const pendingCount = pendingReports?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-gray-300 font-sans py-20 px-6 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#1A150F] to-transparent opacity-30 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 mt-12">
          <h1 className="font-serif text-3xl md:text-4xl font-light text-[#FFF5D6] tracking-wide">მართვის პანელი</h1>
          <p className="text-xs text-gray-500 mt-1">თქვენს მიერ შექმნილი ციფრული მემორიალების სრული სია.</p>
        </div>

        
        {allPendingToasts && allPendingToasts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={20} className="text-[#D4AF37]" />
              <h2 className="font-serif text-2xl text-[#FFF5D6] font-light">ახალი სადღეგრძელოები ({allPendingToasts.length})</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {allPendingToasts.map((item) => (
                <ToastNotificationCard key={item.toast._id} toast={item.toast} memorial={item.memorial} onApprove={handleApproveToast} onReject={handleRejectToast} />
              ))}
            </div>
          </div>
        )}


           <FamilyGroupSection user={user} /> 

        
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Flag size={20} className="text-red-400" />
              <h2 className="font-serif text-2xl text-[#FFF5D6] font-light">
                მოხსენებები
                {pendingCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
                    {pendingCount}
                  </span>
                )}
              </h2>
            </div>
          </div>

          {pendingReports === undefined ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
            </div>
          ) : pendingReports.length === 0 ? (
            <div className="bg-[#121214]/40 border border-white/5 rounded-2xl p-8 text-center">
              <CheckCircle size={32} className="text-green-400/40 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-light">განსახილველი მოხსენებები არ არის.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingReports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  onDismiss={handleDismissReport}
                  onAction={handleActionReport}
                />
              ))}
            </div>
          )}
        </div>

       
        {myMemorials.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-12">
            <h2 className="font-serif text-2xl text-[#FFF5D6] font-light mb-8">გენერირებული მოსაწვევები</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {myMemorials.map((memorial) => (
                <div key={`inv-${memorial._id}`} className="bg-[#121214]/40 border border-white/5 p-6 rounded-2xl hover:border-[#D4AF37]/30 transition group">
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-[#FFF5D6] text-lg font-serif font-medium truncate">{memorial.firstName} {memorial.lastName}</p>
                    <Link href={`/discover/${memorial.urlSlug}`} className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] transition border border-white/5 px-3 py-1 rounded-full">ნახვა</Link>
                  </div>
                  <div className="w-full"><InvitationDisplay memorialId={memorial._id} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

       
        {myMemorials.length === 0 ? (
          <div className="text-center py-20 bg-[#121214]/20 border border-white/5 rounded-2xl max-w-xl">
            <p className="text-gray-500 text-sm font-light mb-4">თქვენ ჯერ არ შეგიქმნიათ არცერთი მემორიალი.</p>
            <Link href="/memorial" className="text-xs uppercase tracking-wider text-[#D4AF37] hover:underline">შექმენი პირველი მემორიალი →</Link>
          </div>
        ) : (
          <div className='mt-12'>
            <h2 className="font-serif text-2xl text-[#FFF5D6] font-light mb-6">ჩემი მემორიალები</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myMemorials.map((memorial) => (
                <div key={memorial._id} className="bg-[#121214]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between h-72 shadow-xl group hover:border-white/10 transition">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${memorial.privacyType === 'public' ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' : 'bg-amber-950/20 border-amber-500/20 text-amber-400'}`}>
                          {memorial.privacyType === 'public' ? 'საჯარო' : 'პირადი'}
                        </span>
                        {memorial.isFlagged && (
                          <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border bg-red-950/20 border-red-500/20 text-red-400 flex items-center gap-1">
                            <Flag size={8} /> მოხსენებული
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-light">
                        <Calendar size={12} className="text-[#D4AF37]/50" />
                        <span>{memorial.birthDate.split('-')[0]} - {memorial.deathDate.split('-')[0]}</span>
                      </div>
                    </div>
                    <h2 className="font-serif text-xl text-[#FFF5D6] tracking-wide mb-1">{memorial.firstName} {memorial.lastName}</h2>
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-light mb-3">
                      <MapPin size={12} className="text-gray-600" />
                      <span>{memorial.location}</span>
                    </div>
                    <p className="text-xs text-gray-400 italic line-clamp-2 border-l border-[#D4AF37]/20 pl-2 font-serif">"{memorial.epitaph}"</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between gap-2">
                    <Link href={`/discover/${memorial.urlSlug}`} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-[#FFF5D6] hover:border-[#D4AF37]/20 transition flex items-center justify-center cursor-pointer" title="ნახვა">
                      <Eye size={14} />
                    </Link>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(memorial)} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-amber-400 hover:border-amber-500/20 transition flex items-center justify-center cursor-pointer" title="რედაქტირება">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(memorial._id)} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-red-400 hover:border-red-500/20 transition flex items-center justify-center cursor-pointer" title="წაშლა">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

    
        {editingMemorial && (
          <div className="mt-36 fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
              <button onClick={closeEditModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition"><X size={18} /></button>
              <h2 className="font-serif text-2xl text-[#FFF5D6] mb-6 font-light">მემორიალის რედაქტირება</h2>

              <form onSubmit={handleUpdateSubmit} className="space-y-5">
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

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] text-gray-400">მთავარი პორტრეტი</label>
                  <input ref={portraitInputRef} type="file" accept="image/*" onChange={handlePortraitUpload} className="hidden" />
                  {newPortraitPreview ? (
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#D4AF37]/20 shrink-0">
                        <img src={newPortraitPreview} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-xs text-gray-400">ახალი ფოტო არჩეულია</p>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => portraitInputRef.current?.click()} className="cursor-pointer text-xs text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1 rounded-lg hover:border-[#D4AF37]/40 transition">შეცვლა</button>
                          <button type="button" onClick={() => { URL.revokeObjectURL(newPortraitPreview); setNewPortraitFile(null); setNewPortraitPreview(''); }} className="cursor-pointer text-xs text-gray-500 border border-white/5 px-3 py-1 rounded-lg hover:text-red-400 transition">გაუქმება</button>
                        </div>
                      </div>
                    </div>
                  ) : editingMemorial.mainPortraitUrl ? (
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <StorageImage storageId={editingMemorial.mainPortraitUrl} className="w-full h-full object-cover grayscale opacity-80" />
                      </div>
                      <button type="button" onClick={() => portraitInputRef.current?.click()} className="cursor-pointer text-xs text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1.5 rounded-lg hover:border-[#D4AF37]/40 transition">
                        ფოტოს შეცვლა
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => portraitInputRef.current?.click()} className="cursor-pointer w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border border-dashed border-white/10 hover:border-[#D4AF37]/30 hover:bg-[#1A150F]/20 transition text-gray-500 hover:text-[#D4AF37]">
                      <Upload size={18} />
                      <span className="text-xs font-light">პორტრეტის ატვირთვა</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] text-gray-400">გალერეა</label>
                  <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                  {editingMemorial.galleryUrls && editingMemorial.galleryUrls.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-gray-500">არსებული ფოტოები ({editingMemorial.galleryUrls.length})</p>
                      <div className="grid grid-cols-4 gap-2">
                        {editingMemorial.galleryUrls.map((id, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group">
                            <StorageImage storageId={id} className="w-full h-full object-cover grayscale opacity-70" />
                            <button type="button" onClick={() => setEditingMemorial(prev => ({ ...prev, galleryUrls: prev.galleryUrls.filter((_, i) => i !== idx) }))} className="cursor-pointer absolute top-1 right-1 p-0.5 rounded-full bg-black/70 border border-white/10 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {newGalleryPreviews.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-gray-500">ახალი ფოტოები ({newGalleryPreviews.length})</p>
                      <div className="grid grid-cols-4 gap-2">
                        {newGalleryPreviews.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#D4AF37]/20 group">
                            <img src={url} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => handleRemoveNewGallery(idx)} className="cursor-pointer absolute top-1 right-1 p-0.5 rounded-full bg-black/70 border border-white/10 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button type="button" onClick={() => galleryInputRef.current?.click()} className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 hover:border-[#D4AF37]/30 hover:bg-[#1A150F]/20 transition text-gray-500 hover:text-[#D4AF37] text-xs font-light">
                    <Plus size={13} /> ფოტოების დამატება
                  </button>
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
                  <button type="button" onClick={closeEditModal} className="px-4 py-2 rounded-xl border border-white/5 text-xs uppercase tracking-wider font-medium hover:bg-white/5 transition">გაუქმება</button>
                  <button type="submit" disabled={isUpdating} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider transition hover:brightness-110 shadow-lg shadow-[#D4AF37]/5 disabled:opacity-50 flex items-center gap-2">
                    {isUpdating ? <><Loader2 size={13} className="animate-spin" /> ინახება...</> : 'ცვლილებების შენახვა'}
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