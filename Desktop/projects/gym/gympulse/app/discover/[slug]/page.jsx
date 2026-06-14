"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useParams } from 'next/navigation';
import { Calendar, MapPin, Flame, Heart, CheckCircle, Users, X, Clock, CreditCard, MessageSquare, Send, Eye } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import AudioPlayer from '../../../components/AudioPlayer';
import CustomAudioPlayer from '../../../components/CustomAudioPlayer';
import ReportButton from '../../../components/ReportButton';
import ContributePhotos from '../../../components/Contributephotos';

const MemorialPage = () => {
  const params = useParams();
  const slug = params.slug;
  const { user } = useUser();

  const visits = useMutation(api.memorials.incrementVisits);

 


  // share feature
  const [shareTooltip, setShareTooltip] = useState("");
  const memorialUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(memorialUrl);
    setShareTooltip("ბმული დაკოპირდა!");
    setTimeout(() => setShareTooltip(""), 2500);
  };
  
  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memorialUrl)}`, "_blank");
  };
  
  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${memorial.firstName} ${memorial.lastName} - მემორიალური გვერდი: ${memorialUrl}`)}`, "_blank");
  };
  
  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(memorialUrl)}&text=${encodeURIComponent(`${memorial.firstName} ${memorial.lastName} - მემორიალური გვერდი`)}`, "_blank");
  };

 
// favorite music
const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

const convertYouTube = (url) => {
  if (!url) return "";
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
};

  const memorial = useQuery(api.memorials.getMemorialBySlug, { urlSlug: slug });
  const lightCandleMutation = useMutation(api.memorials.lightCandle);
  const attendFuneralMutation = useMutation(api.memorials.attendFuneral);

  const condolences = useQuery(api.memorials.getCondolences, memorial ? { memorialId: memorial._id } : "skip");
  const addCondolenceMutation = useMutation(api.memorials.addCondolence);

  
  const portraitUrl = useQuery(
    api.services.getStorageUrl,
    memorial?.mainPortraitUrl ? { storageId: memorial.mainPortraitUrl } : "skip"
  );

  const galleryUrls = useQuery(
    api.services.getStorageUrls,
    memorial?.galleryUrls?.length > 0 ? { storageIds: memorial.galleryUrls } : "skip"
  );



  const invitations = useQuery(
    api.services.getInvitationForMemorial, 
    memorial ? { memorialId: memorial._id } : "skip"
  );
  
  const publishedInv = invitations?.find(inv => inv.isPublished === true);


    // gifts
    const sendGiftMutation = useMutation(api.gifts.sendGift);
    const gifts = useQuery(api.gifts.getGiftsForMemorial, 
      memorial ? { memorialId: memorial._id } : "skip"
     );
 
     const GIFT_ITEMS = [
      { id: "rose",    name: "ვარდი",    emoji: "🌹", price: 5  },
      { id: "lily",    name: "შროშანი",  emoji: "🌸", price: 6  },
      { id: "candle",  name: "სანთელი",  emoji: "🕯️", price: 3  },
      { id: "wreath",  name: "გვირგვინი",emoji: "💐", price: 25 },
      { id: "bouquet", name: "თაიგული", emoji: "🌺", price: 15 },
      { id: "dove",    name: "მტრედი",   emoji: "🕊️", price: 10 },
    ];
 
    const [selectedGift, setSelectedGift] = useState(GIFT_ITEMS[0]);
    const [giftDedication, setGiftDedication] = useState("");
    const [isGiftAnonymous, setIsGiftAnonymous] = useState(false);
    const [isSendingGift, setIsSendingGift] = useState(false);
    const [giftSent, setGiftSent] = useState(false);
    
 
    const handleSendGift = async () => {
      if (!memorial || !user) return;
      setIsSendingGift(true);
      try {
       
        await sendGiftMutation({
          memorialId: memorial._id,
          senderName: isGiftAnonymous ? "ანონიმური" : (user.fullName || user.firstName || "სტუმარი"),
          senderId: user.id,
          giftType: selectedGift.id,
          giftEmoji: selectedGift.emoji,
          giftName: selectedGift.name,
          giftPrice: selectedGift.price,
          dedication: giftDedication.trim() || undefined,
          isAnonymous: isGiftAnonymous,
        });
        setGiftSent(true);
        setGiftDedication("");
        setTimeout(() => setGiftSent(false), 4000);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSendingGift(false);
      }
    };
 

  // Edit and delete condolence 
  const deleteCondolenceMutation = useMutation(api.memorials.deleteCondolence);
  const editCondolenceMutation = useMutation(api.memorials.editCondolence);
  const approvedToasts = useQuery(
    api.services.getApprovedToasts, 
    memorial ? { memorialId: memorial._id } : "skip"
  );
  
  const [editingCondolenceId, setEditingCondolenceId] = useState(null);
  const [editText, setEditText] = useState("");


    // timeline feature
    const timelineEntries = useQuery(
      api.timeline.getByMemorial,
      memorial ? { memorialId: memorial._id } : "skip"
    );
  
    const CAT_COLORS = {
      ცხოვრება:        "#D4AF37",
      ოჯახი:      "#1D9E75",
      კარიერა:      "#378ADD",
      მოგზაურობა:      "#D85A30",
      სიყვარული:        "#D4537E",
      რწმენა:       "#7F77DD",
      მიღწევა: "#BA7517",
  };
  

 
  


  useEffect(() => {
    
    if (memorial?._id) {
      visits({ memorialId: memorial._id });
    }
  }, [memorial?._id, visits]);

  
  const [expandedThreads, setExpandedThreads] = useState({});

  const toggleThread = (id) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteCondolence = async (id) => {
    if (!window.confirm("ნამდვილად გსურთ ამ შეტყობინების წაშლა?")) return;
    try {
      await deleteCondolenceMutation({ id, userId: user?.id });
    } catch (err) {
      console.error("წაშლა ვერ მოხერხდა:", err);
    }
  };
  
  const handleSaveEdit = async (e, id) => {
    e.preventDefault();
    if (!editText.trim() || !user) return;
  
    try {
      const keptLive = await editCondolenceMutation({
        id,
        newBody: editText.trim(),
        userId: user.id
      });
      
      setEditingCondolenceId(null);
      setEditText("");
      if (!keptLive) {
        alert("ცვლილება შენახულია. შეტყობინება გამოჩნდება ოჯახის მიერ ხელახალი მოდერაციის შემდეგ.");
      }
    } catch (err) {
      console.error("რედაქტირება ვერ მოხერხდა:", err);
    }
  };

  // Replying to condolences 
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handlePostReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim() || !guestName.trim() || !memorial) return;
  
    setIsSubmittingReply(true);
    try {
      await addCondolenceMutation({
        memorialId: memorial._id,
        body: replyText.trim(),
        authorName: guestName.trim(),
        authorId: user?.id || undefined,
        parentId: parentId, 
      });
      setReplyText("");
      setReplyingToId(null);
    } catch (err) {
      console.error("პასუხის გაგზავნა ვერ მოხერხდა:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const [hasLitCandle, setHasLitCandle] = useState(false);
  const [isLighting, setIsLighting] = useState(false);

  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [isRSVPing, setIsRSVPing] = useState(false);
  
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isNameInputModalOpen, setIsNameInputModalOpen] = useState(false);
  const [attendeeName, setAttendeeName] = useState("");

  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [copied, setCopied] = useState(false);

 
  const [condolenceText, setCondolenceText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isSubmittingCondolence, setIsSubmittingCondolence] = useState(false);
  const [submissionNotice, setSubmissionNotice] = useState("");

  useEffect(() => {
    if (slug) {
      const alreadyLit = localStorage.getItem(`candle_lit_${slug}`);
      if (alreadyLit) setHasLitCandle(true);

      const alreadyRSVPed = localStorage.getItem(`funeral_rsvp_${slug}`);
      if (alreadyRSVPed) setHasRSVPed(true);
    }
  }, [slug]);

  useEffect(() => {
    if (user) {
      setGuestName(user.fullName || user.firstName || "");
    }
  }, [user]);

  const handlePostCondolence = async (e) => {
    e.preventDefault();
    if (!condolenceText.trim() || !guestName.trim() || !memorial) return;

    setIsSubmittingCondolence(true);
    setSubmissionNotice("");

    try {
      const isApprovedImmediately = await addCondolenceMutation({
        memorialId: memorial._id,
        body: condolenceText.trim(),
        authorName: guestName.trim(),
        authorId: user?.id || undefined,
      });

      setCondolenceText("");
      if (!isApprovedImmediately) {
        setSubmissionNotice("თქვენი სამძიმარი გაიგზავნა. იგი გამოჩნდება კედელზე ოჯახის მიერ მოდერაციის დადასტურების შემდეგ.");
      } else {
        setSubmissionNotice("სამძიმარი წარმატებით გამოქვეყნდა.");
      }
      setTimeout(() => setSubmissionNotice(""), 5000);
    } catch (err) {
      console.error("სამძიმრის გაგზავნა ვერ მოხერხდა:", err);
    } finally {
      setIsSubmittingCondolence(false);
    }
  };

  const handleLightCandle = async () => {
    if (hasLitCandle || !memorial) return;
    setIsLighting(true);
    try {
      await lightCandleMutation({ id: memorial._id });
      setHasLitCandle(true);
      localStorage.setItem(`candle_lit_${slug}`, 'true');
    } catch (err) {
      console.error("სანთლის ანთება ვერ მოხერხდა:", err);
    } finally {
      setIsLighting(false);
    }
  };

  const handleAttendButtonClick = () => {
    if (hasRSVPed || isRSVPing) return;
    setIsNameInputModalOpen(true);
  };

  const handleConfirmAttendance = async (e) => {
    e.preventDefault();
    if (!attendeeName.trim() || !memorial) return;

    setIsRSVPing(true);
    setIsNameInputModalOpen(false);
    try {
      await attendFuneralMutation({ 
        id: memorial._id, 
        name: attendeeName.trim() 
      });
      setHasRSVPed(true);
      localStorage.setItem(`funeral_rsvp_${slug}`, 'true');
    } catch (err) {
      console.error("დასწრების დაფიქსირება ვერ მოხერხდა:", err);
    } finally {
      setIsRSVPing(false);
    }
  };

  const handleCopyIban = () => {
    if (!memorial?.bankAccountIban) return;
    navigator.clipboard.writeText(memorial.bankAccountIban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatGeorgianDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString('ka-GE', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return dateString; }
  };

  if (memorial === undefined) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (memorial === null) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-gray-400 flex flex-col items-center justify-center">
        <h2 className="text-xl font-light mb-2">მემორიალური გვერდი ვერ მოიძებნა</h2>
      </div>
    );
  }

  const isCreator = user?.id === memorial.creatorId;
  const visibleCondolences = (condolences || []).filter(c => c.isApproved || isCreator);

 
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-gray-300 font-sans pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#1A150F] to-transparent opacity-40 blur-3xl pointer-events-none" />
 
  

      <header className="relative z-10 pt-28 pb-16 text-center max-w-3xl mx-auto px-6 flex flex-col items-center">
        <div className="relative group mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#AA7C11] via-[#D4AF37] to-transparent opacity-30 blur-md" />
          <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full p-[1.5px] bg-gradient-to-b from-[#FFF5D6] via-[#D4AF37] to-[#1A1A1A]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#121214]">
            {portraitUrl ? (
               <img src={portraitUrl} alt={memorial.firstName} className="w-full h-full object-cover grayscale contrast-110 opacity-90" />
                )  :   (
      <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5">
         <Heart size={32} className="opacity-40" />
      </div>
     )}
            </div>
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] via-[#D4AF37] to-[#AA7C11] tracking-wide mb-3">
          {memorial.firstName} {memorial.lastName}
        </h1>

   
        
        <div className="flex items-center gap-2 text-sm text-gray-500 font-light tracking-widest uppercase">
          <Calendar size={14} className="text-[#D4AF37]/70" />
          <span>{memorial.birthDate.replace(/-/g, '.')}</span>
          <span className="text-[#D4AF37] mx-1">•</span>
          <span>{memorial.deathDate.replace(/-/g, '.')}</span>
        </div>

        <p className="mt-8 font-serif text-lg md:text-xl text-gray-400 italic max-w-xl border-l border-r border-[#D4AF37]/20 px-6">
          "{memorial.epitaph}"
        </p>

        <div className="flex items-center gap-3 mt-4">
  <div className="flex items-center gap-2 text-gray-400 text-sm">
    <Eye size={16} />
    <span>{memorial.visits ?? 0} ნახვა</span>
  </div>


  <ReportButton memorialId={memorial._id} isCreator={isCreator} />
</div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#121214]/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
            <h2 className="font-serif text-xl text-[#FFF5D6] mb-6 flex items-center gap-3">
              <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
              ცხოვრების ისტორია
            </h2>
            <p className="leading-relaxed text-gray-400 font-light text-base whitespace-pre-line">
              {memorial.biography}
            </p>
          </section>

          {timelineEntries && timelineEntries.length > 0 && (
  <section className="bg-[#121214]/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
    <h2 className="font-serif text-xl text-[#FFF5D6] mb-8 flex items-center gap-3">
      <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
      ცხოვრების ქრონიკა
    </h2>

    <div className="relative pl-7">
      
      <div
        className="absolute left-2.5 top-0 bottom-0 w-px"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.25) 8%, rgba(212,175,55,0.25) 92%, transparent)" }}
      />

      <div className="space-y-6">
        {timelineEntries.map((entry, index) => {
          const dotColor = CAT_COLORS[entry.category] ?? "#D4AF37";
          return (
            <div
              key={entry._id}
              className="relative group"
              style={{ animationDelay: `${index * 60}ms` }}
            >
             
              <div
                className="absolute -left-7 top-5 w-2.5 h-2.5 rounded-full border-2 border-[#121214] transition-transform duration-300 group-hover:scale-125"
                style={{ background: dotColor }}
              />

              <div className="bg-black/20 border border-[#D4AF37]/8 rounded-xl p-5 hover:border-[#D4AF37]/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                 
                  <div className="min-w-[72px] shrink-0">
                    {entry.year && (
                      <span
                        className="font-serif text-xl font-light"
                        style={{ color: dotColor }}
                      >
                        {entry.year}
                      </span>
                    )}
                    <div
                      className="text-[10px] uppercase tracking-widest mt-0.5 font-light"
                      style={{ color: dotColor + "80" }}
                    >
                      {entry.category}
                    </div>
                  </div>

                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#FFF5D6] font-medium text-sm leading-snug">
                      {entry.title}
                    </h3>
                    {entry.description && (
                      <p className="text-gray-500 text-xs font-light leading-relaxed mt-1.5 whitespace-pre-line">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
)}



         
{galleryUrls && galleryUrls.length > 0 && (
  <section className="bg-[#121214]/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl space-y-6">
    <h2 className="font-serif text-xl text-[#FFF5D6] flex items-center gap-3">
      <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
      ფოტოგალერეა
    </h2>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {galleryUrls.map((url, index) => (
        <div 
          key={index}
          onClick={() => setActiveLightboxImage(url)}
          className="cursor-pointer aspect-square rounded-xl overflow-hidden border border-white/5 bg-[#0D0D0F] group relative"
        >
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
            <span className="text-[11px] text-[#D4AF37] font-light tracking-wider uppercase border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-xs">
              გადიდება
            </span>
          </div>
          <img 
            src={url} 
            alt={`გალერეა - ${index + 1}`}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 contrast-105 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      ))}
    </div>
  </section>
)}

<ContributePhotos memorial={memorial} />
        </div>

        <div className="space-y-8">
          {memorial.enableCandle && (
            <section className="bg-gradient-to-b from-[#161619]/60 to-[#0F0F12]/80 border border-[#D4AF37]/15 rounded-2xl p-6 text-center">
              <h3 className="font-serif text-base text-[#FFF5D6] mb-4 tracking-wide">ვირტუალური პანაშვიდი</h3>
              <div className="flex flex-col items-center justify-center my-6 space-y-2">
                <div className={`p-4 rounded-full border transition-all duration-500 ${hasLitCandle ? 'bg-[#1A150F] border-[#D4AF37]/40 text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.2)] animate-pulse' : 'bg-[#121214] border-white/5 text-gray-600'}`}>
                  <Flame size={32} />
                </div>
                <span className="font-sans text-2xl font-light text-gray-200">{memorial.candleCount}</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-light">ანთებული სანთელი</span>
              </div>
              <button onClick={handleLightCandle} disabled={hasLitCandle || isLighting} className={`w-full py-3 px-4 rounded-xl font-medium text-xs uppercase tracking-wider transition-all duration-300 ${hasLitCandle ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold hover:brightness-110 cursor-pointer active:scale-[0.98]'}`}>
                {isLighting ? 'ინთება...' : hasLitCandle ? 'სანთელი ანთებულია' : 'აანთე სანთელი'}
              </button>
            </section>
          )}

<section className="bg-[#121214]/30 border border-white/5 rounded-2xl p-6 space-y-6">
  <h3 className="font-serif text-base text-[#FFF5D6] border-b border-white/5 pb-3 tracking-wide">საორგანიზაციო ინფორმაცია</h3>
  <div className="space-y-5">

    {memorial.location && (
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-[#161619] text-[#D4AF37]/80 shrink-0"><MapPin size={16} /></div>
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-light">ცხოვრების ადგილი</h4>
          <p className="text-sm text-gray-300 font-light mt-0.5">{memorial.location}</p>
        </div>
      </div>
    )}

    {memorial.funeralLocation && (
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-[#161619] text-[#D4AF37]/80 shrink-0"><MapPin size={16} /></div>
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-light">სამძიმრის ადგილი</h4>
          <p className="text-sm text-gray-300 font-light mt-0.5">{memorial.funeralLocation}</p>
        </div>
      </div>
    )}

    {memorial.funeralTime && (
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-[#161619] text-[#D4AF37]/80 shrink-0"><Calendar size={16} /></div>
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-light">გამოსვენების დრო</h4>
          <p className="text-sm text-gray-300 font-light mt-0.5">{formatGeorgianDate(memorial.funeralTime)}</p>
        </div>
      </div>
    )}

    {memorial.cemeteryLocation && (
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-[#161619] text-[#D4AF37]/80 shrink-0"><MapPin size={16} /></div>
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-light">საფლავის / ქელეხის ლოკაცია</h4>
          <p className="text-sm text-gray-300 font-light mt-0.5">{memorial.cemeteryLocation}</p>
        </div>
      </div>
    )}

    {!memorial.location && !memorial.funeralLocation && !memorial.funeralTime && !memorial.cemeteryLocation && (
      <p className="text-sm text-gray-600 font-light italic">ინფორმაცია არ არის მითითებული.</p>
    )}

  </div>
</section>

          {memorial.enableDonations && memorial.bankAccountIban && (
            <section className="bg-gradient-to-b from-[#1A150F]/50 to-[#121214]/60 border border-[#D4AF37]/20 rounded-2xl p-6 relative overflow-hidden space-y-4 animate-fade-in">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 blur-xl rounded-full pointer-events-none" />
              <div>
                <h3 className="font-serif text-base text-[#FFF5D6] tracking-wide flex items-center gap-2">
                  <CreditCard size={18} className="text-[#D4AF37]" /> ფინანსური დახმარება (ფულის დაწერა)
                </h3>
                <p className="text-[11px] text-gray-400 font-light mt-1 leading-relaxed">
                  თუ გსურთ თანადგომა გამოუცხადოთ ოჯახს სარიტუალო ხარჯების დასაფარად, შეგიძლიათ თანხა პირდაპირ მითითებულ ანგარიშზე გადარიცხოთ.
                </p>
              </div>

              <div className="bg-[#0D0D0F]/70 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-light">
                  <span className="text-gray-500">მიმღები ბანკი:</span>
                  <span className="text-gray-200 font-medium">
                    {memorial.bankName === 'tbc' ? 'თიბისი ბანკი (TBC)' : 'საქართველოს ბანკი (BOG)'}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-1 pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-light">ანგარიშის ნომერი (IBAN)</span>
                  <span className="font-mono text-xs text-gray-200 font-medium tracking-wider select-all break-all mt-0.5">
                    {memorial.bankAccountIban}
                  </span>
                </div>
              </div>

              <button onClick={handleCopyIban} className="cursor-pointer w-full py-2.5 px-4 rounded-xl text-xs font-medium border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all active:scale-[0.99]">
                {copied ? <span className="text-green-400 font-semibold animate-pulse">✓ ანგარიში დაკოპირდა</span> : 'ანგარიშის ნომრის კოპირება'}
              </button>
            </section>
          )}


{(memorial.funeralLocation || memorial.funeralTime) && (
  <section className="bg-gradient-to-br from-[#121214]/80 to-[#1A150F]/40 border border-[#D4AF37]/10 rounded-2xl p-5 flex flex-col items-center text-center space-y-4">
    <div className="space-y-1">
      <h4 className="text-xs font-serif text-[#FFF5D6] tracking-wide">პანაშვიდსა და დაკრძალვაზე დასწრება</h4>
      <p className="text-[11px] text-gray-500 max-w-xs font-light">დაადასტურეთ თქვენი მოსვლა, რათა დაეხმაროთ ორგანიზატორებს საორგანიზაციო დეტალების დაგეგმვაში.</p>
    </div>

    <button 
      onClick={() => setIsListModalOpen(true)}
      className="group cursor-pointer bg-[#0D0D0F]/60 hover:bg-[#121215] border border-white/5 hover:border-[#D4AF37]/30 rounded-xl px-4 py-2 flex items-center gap-3 transition-all duration-200"
    >
      <Users size={14} className="text-gray-500 group-hover:text-[#D4AF37] transition-colors" />
      <span className="text-sm font-light text-gray-400">დასწრებას ადასტურებს:</span>
      <span className="text-base font-medium text-[#D4AF37] underline decoration-dotted underline-offset-4">
        {memorial.attendeesCount || 0} ადამიანი
      </span>
    </button>

    <button 
      onClick={handleAttendButtonClick}
      disabled={hasRSVPed || isRSVPing}
      className={`w-full py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 ${
        hasRSVPed ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' : 'cursor-pointer bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black hover:brightness-110 shadow-md'
      }`}
    >
      {isRSVPing ? 'ფიქსირდება...' : hasRSVPed ? <><CheckCircle size={14} className="text-gray-500" /> დასწრება დადასტურებულია</> : 'დავესწრები პანაშვიდს'}
    </button>
  </section>
)}

          {publishedInv && (
  <div className="my-12 p-6 bg-[#121214]/50 border border-[#D4AF37]/20 rounded-2xl">
    <h3 className="font-serif text-[#FFF5D6] text-xl mb-6">სამგლოვიარო მოსაწვევი</h3>
    <img src={publishedInv.url} className="w-full max-w-md mx-auto rounded-lg" />
  </div>
)}

        </div>
      </main>


      {memorial.favoriteSongUrl && (
  <section className="max-w-4xl  mx-auto  mt-20 px-6 bg-[#121214]/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl flex flex-col items-center gap-4">
    <h2 className="font-serif text-xl text-[#FFF5D6] self-start flex items-center gap-3">
      <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
      მუსიკალური მოგონება
    </h2>

    <button
      onClick={() => setIsMusicModalOpen(true)}
      className="cursor-pointer relative group mt-2"
    >
      
      <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-xl opacity-40 group-hover:opacity-70 transition duration-500" />
      
      
      <div className="relative w-44 h-44 rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-2xl flex items-center justify-center animate-[spin_8s_linear_infinite] group-hover:[animation-play-state:paused] transition-all duration-300">
        <div className="w-[92%] h-[92%] rounded-full border border-zinc-700/40" />
        <div className="absolute w-[70%] h-[70%] rounded-full border border-zinc-700/30" />
        
        <div className="absolute w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-black rounded-full" />
        </div>
      </div>

     
      <p className="text-[11px] uppercase tracking-widest text-[#D4AF37]/70 text-center mt-4">
        დააჭირეთ მოსასმენად
      </p>
    </button>
  </section>
)}

{isMusicModalOpen && memorial.favoriteSongUrl && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
    onClick={() => setIsMusicModalOpen(false)}
  >
    <div
      className="bg-[#121214] border border-white/10 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl space-y-4"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setIsMusicModalOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
      >
        <X size={18} />
      </button>

      <h3 className="font-serif text-lg text-[#FFF5D6] flex items-center gap-2">
        🎵 მუსიკალური მოგონება
      </h3>

   
      <div className="flex justify-center py-2">
        <div className="relative w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-xl flex items-center justify-center animate-[spin_8s_linear_infinite]">
          <div className="w-[92%] h-[92%] rounded-full border border-zinc-700/40" />
          <div className="absolute w-[70%] h-[70%] rounded-full border border-zinc-700/30" />
          <div className="absolute w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>
        </div>
      </div>

      
      <div className="w-full overflow-hidden rounded-xl border border-white/10 shadow-xl">
        <iframe
          className="w-full aspect-video"
          src={convertYouTube(memorial.favoriteSongUrl)}
          title="მუსიკალური მოგონება"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="text-[11px] uppercase tracking-widest text-[#D4AF37]/70 text-center">
        მუსიკა, რომელიც დარჩა
      </p>
    </div>
  </div>
)}
     

  
    

      <section className="max-w-4xl mx-auto mt-20 px-6">

      <h2 className="font-serif text-xl text-[#FFF5D6] mb-6 flex items-center gap-3">
              <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
              სადღეგრძელოები
            </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {approvedToasts && approvedToasts.length > 0 ? (
    approvedToasts.map((toast) => (
      <div 
        key={toast._id} 
        className="group relative bg-[#0D0D0F]/40 border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 rounded-2xl p-6 backdrop-blur-md overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1A150F] border border-[#D4AF37]/20 flex items-center justify-center shadow-inner">
                <span className="text-[11px] text-[#D4AF37] font-bold">
                  {toast.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#FFF5D6]">{toast.authorName}</h4>
                <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em]">სადღეგრძელო</p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <CustomAudioPlayer storageId={toast.audioUrl} />
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-full text-center p-12 border border-white/5 rounded-2xl bg-[#0D0D0F]/20">
      <p className="text-sm text-gray-500 font-light italic">ამ მემორიალზე ჯერ არ არის დამატებული სადღეგრძელოები.</p>
    </div>
  )}
</div>
</section>

<section className="max-w-4xl mx-auto mt-20 px-6">
  <div className="bg-[#121214]/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl space-y-6">
    <h2 className="font-serif text-xl text-[#FFF5D6] flex items-center gap-3">
      <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
      ყვავილი და საჩუქარი
    </h2>

  
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {GIFT_ITEMS.map((gift) => (
        <button
          key={gift.id}
          onClick={() => setSelectedGift(gift)}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
            selectedGift.id === gift.id
              ? 'border-[#D4AF37]/60 bg-[#1A150F]/60'
              : 'border-white/5 bg-[#0D0D0F]/40 hover:border-white/10'
          }`}
        >
          <span className="text-2xl">{gift.emoji}</span>
          <span className="text-[11px] text-gray-400">{gift.name}</span>
          <span className="text-[11px] font-medium text-[#D4AF37]">{gift.price} ₾</span>
        </button>
      ))}
    </div>

   
    <div className="bg-[#0D0D0F]/40 border border-white/5 rounded-xl p-5 space-y-4">
      <textarea
        rows={3}
        placeholder="მიძღვნა (არასავალდებულო)..."
        value={giftDedication}
        onChange={(e) => setGiftDedication(e.target.value)}
        className="w-full bg-[#0D0D0F] border border-white/5 rounded-xl p-3 text-sm text-gray-200 focus:border-[#D4AF37] outline-none resize-none"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isGiftAnonymous}
            onChange={(e) => setIsGiftAnonymous(e.target.checked)}
            className="accent-[#D4AF37] w-3.5 h-3.5"
          />
          ანონიმურად გაგზავნა
        </label>
        <button
          onClick={handleSendGift}
          disabled={isSendingGift || !user}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
        >
          {giftSent ? '✓ გაგზავნილია!' : isSendingGift ? 'იგზავნება...' : `${selectedGift.emoji} გაგზავნე — ${selectedGift.price} ₾`}
        </button>
      </div>
      {!user && (
        <p className="text-xs text-gray-600 text-right">საჩუქრის გასაგზავნად საჭიროა ავტორიზაცია.</p>
      )}
    </div>

    
    {gifts && gifts.length > 0 && (
      <div className="space-y-3 pt-2 border-t border-white/5">
        <p className="text-[11px] uppercase tracking-widest text-gray-500">
          {gifts.length} ადამიანმა გამოხატა პატივისცემა
        </p>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {gifts.map((g) => (
            <div key={g._id} className="flex items-start gap-3 p-4 rounded-xl bg-[#0D0D0F]/40 border border-white/5">
              <span className="text-xl mt-0.5 shrink-0">{g.giftEmoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-200">{g.isAnonymous ? 'ანონიმური' : g.senderName}</span>
                  <span className="text-[10px] text-[#D4AF37]/70 bg-[#D4AF37]/10 border border-[#D4AF37]/15 rounded-full px-2 py-0.5">{g.giftName}</span>
                </div>
                {g.dedication && (
                  <p className="text-xs text-gray-500 font-light mt-1 leading-relaxed italic">"{g.dedication}"</p>
                )}
                <p className="text-[10px] text-gray-600 mt-1">
                  {new Date(g.createdAt).toLocaleDateString('ka-GE')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</section>


<section className="max-w-4xl mx-auto mt-12 px-6">
  <div className="bg-[#121214]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
    <h2 className="font-serif text-xl text-[#FFF5D6] mb-6 flex items-center gap-3">
      <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
      მემორიალის გაზიარება
    </h2>

    <div className="flex flex-wrap gap-3">
      
      <button
        onClick={handleCopyLink}
        className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-[#0D0D0F]/60 hover:border-[#D4AF37]/30 text-sm text-gray-300 hover:text-[#D4AF37] transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        {shareTooltip || "ბმულის კოპირება"}
      </button>

     
      <button
        onClick={shareToFacebook}
        className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 hover:border-[#1877F2]/40 text-sm text-[#1877F2] transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        Facebook
      </button>

      
      <button
        onClick={shareToWhatsApp}
        className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-[#25D366]/10 hover:bg-[#25D366]/20 hover:border-[#25D366]/40 text-sm text-[#25D366] transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.528 5.859L.057 23.928l6.232-1.635A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.188-1.432l-.372-.221-3.862 1.013 1.033-3.77-.242-.389A9.936 9.936 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        WhatsApp
      </button>

     
      <button
        onClick={shareToTelegram}
        className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 hover:border-[#229ED9]/40 text-sm text-[#229ED9] transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        Telegram
      </button>
    </div>
  </div>
</section>

<section className="max-w-4xl mx-auto mt-12 bg-[#121214]/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl space-y-6">
        <h2 className="font-serif text-xl text-[#FFF5D6] flex items-center gap-3">
          <MessageSquare size={20} className="text-[#D4AF37]" /> სამძიმრის კედელი
        </h2>

        <form onSubmit={handlePostCondolence} className="space-y-4 bg-[#0D0D0F]/40 p-5 border border-white/5 rounded-xl">
          {submissionNotice && (
            <div className="p-3 text-xs text-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 animate-fade-in">
              {submissionNotice}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <input 
                type="text" 
                required
                placeholder="თქვენი სახელი" 
                value={guestName}
                disabled={!!user} 
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-[#0D0D0F] border border-white/5 rounded-xl p-3 text-sm text-gray-200 focus:border-[#D4AF37] outline-none disabled:opacity-50"
              />
            </div>
            <div className="sm:col-span-2 relative flex items-center">
              <input 
                type="text" 
                required
                placeholder="დატოვეთ სამძიმრის სიტყვა..." 
                value={condolenceText}
                onChange={(e) => setCondolenceText(e.target.value)}
                className="w-full bg-[#0D0D0F] border border-white/5 rounded-xl p-3 pr-12 text-sm text-gray-200 focus:border-[#D4AF37] outline-none"
              />
              <button 
                type="submit" 
                disabled={isSubmittingCondolence}
                className="absolute right-2 p-2 rounded-lg text-[#D4AF37] hover:bg-white/5 transition disabled:opacity-40 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {visibleCondolences.length > 0 ? (
            visibleCondolences
              .filter((c) => !c.parentId)
              .map((condolence) => {
                const isCommentAuthor = user?.id && condolence.authorId === user.id;
                const isPageOwner = user?.id && memorial.creatorId === user.id;
                const isCurrentlyEditing = editingCondolenceId === condolence._id;
                const isCurrentlyReplying = replyingToId === condolence._id;

                const messageReplies = visibleCondolences.filter((r) => r.parentId === condolence._id);
                const hasReplies = messageReplies.length > 0;
                
                
                const isThreadExpanded = !!expandedThreads[condolence._id];

                return (
                  <div key={condolence._id} className="p-5 rounded-xl bg-[#0D0D0F]/40 border border-white/5 space-y-4 relative group transition hover:border-white/10 animate-fade-in">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-200">{condolence.authorName}</span>
                        {!condolence.isApproved && isPageOwner && (
                          <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            ელოდება დასტურს
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] text-gray-500 font-light flex items-center gap-1.5">
                          <Clock size={12} />
                          {new Date(condolence.createdAt).toLocaleDateString('ka-GE')}
                        </span>

                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {!isCurrentlyEditing && (
                            <button 
                              onClick={() => {
                                setReplyingToId(isCurrentlyReplying ? null : condolence._id);
                                if (!isCurrentlyReplying) {
                                  setExpandedThreads(prev => ({ ...prev, [condolence._id]: true }));
                                }
                              }}
                              className="cursor-pointer text-xs text-gray-500 hover:text-[#D4AF37] transition font-light"
                            >
                              პასუხი
                            </button>
                          )}
                          {!isCurrentlyEditing && (isCommentAuthor || isPageOwner) && (
                            <>
                              {isCommentAuthor && (
                                <button 
                                  onClick={() => {
                                    setEditingCondolenceId(condolence._id);
                                    setEditText(condolence.body);
                                  }}
                                  className="cursor-pointer text-xs text-gray-500 hover:text-[#D4AF37] transition font-light"
                                >
                                  შეცვლა
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteCondolence(condolence._id)}
                                className="cursor-pointer text-xs text-gray-500 hover:text-red-400 transition font-light"
                              >
                                წაშლა
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {isCurrentlyEditing ? (
                      <form onSubmit={(e) => handleSaveEdit(e, condolence._id)} className="space-y-3 pt-1">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          className="w-full bg-[#0D0D0F] border border-[#D4AF37]/30 rounded-xl p-3 text-sm text-gray-200 focus:border-[#D4AF37] outline-none resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setEditingCondolenceId(null)} className="px-3 py-1.5 rounded-lg border border-white/5 text-xs text-gray-500 hover:text-white transition">გაუქმება</button>
                          <button type="submit" className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-medium text-xs shadow-md transition hover:brightness-110">შენახვა</button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm text-gray-400 font-light leading-relaxed whitespace-pre-line mt-1">
                        {condolence.body}
                      </p>
                    )}

                    {hasReplies && (
                      <div className="pt-2 border-t border-white/5 flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleThread(condolence._id)}
                          className="cursor-pointer text-xs font-medium text-[#D4AF37] hover:underline flex items-center gap-1"
                        >
                          {isThreadExpanded ? '▲ პასუხების დამალვა' : `▼ პასუხების ნახვა (${messageReplies.length})`}
                        </button>
                      </div>
                    )}

                    {isThreadExpanded && (
                      <div className="space-y-2 pl-4 border-l border-white/5 mt-2 animate-fade-in">
                        {messageReplies.map((reply) => {
                          const isReplyAuthor = user?.id && reply.authorId === user.id;
                          const isReplyFromOwner = reply.authorId === memorial.creatorId;

                          return (
                            <div 
                              key={reply._id} 
                              className={`p-4 rounded-xl border relative group transition-all duration-200 ${
                                isReplyFromOwner ? 'bg-[#1A150F]/10 border-[#D4AF37]/10' : 'bg-[#121214]/20 border-white/5'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-medium text-gray-200">{reply.authorName}</span>
                                  {isReplyFromOwner && (
                                    <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-1.5 py-0.5 rounded-md">
                                      ოჯახი
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-gray-500 font-light flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(reply.createdAt).toLocaleDateString('ka-GE')}
                                  </span>
                                  {(isReplyAuthor || isPageOwner) && (
                                    <button 
                                      onClick={() => handleDeleteCondolence(reply._id)}
                                      className="cursor-pointer opacity-0 group-hover:opacity-100 text-[10px] text-gray-500 hover:text-red-400 transition font-light duration-200"
                                    >
                                      წაშლა
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 font-light leading-relaxed mt-1 whitespace-pre-line">
                                {reply.body}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {isCurrentlyReplying && (
                      <form onSubmit={(e) => handlePostReply(e, condolence._id)} className="flex gap-2 items-center pt-2 animate-fade-in pl-4 border-l border-white/5">
                        <input 
                          type="text"
                          required
                          placeholder="დაწერეთ პასუხი..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-[#0D0D0F] border border-white/10 rounded-xl p-2.5 text-xs text-gray-200 focus:border-[#D4AF37] outline-none"
                        />
                        <button 
                          type="submit"
                          disabled={isSubmittingReply}
                          className="cursor-pointer bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-xs font-semibold px-4 py-2.5 rounded-xl transition hover:brightness-110 disabled:opacity-40"
                        >
                          გაგზავნა
                        </button>
                      </form>
                    )}

                  </div>
                );
              })
          ) : (
            <div className="text-center py-10 text-gray-600 text-sm font-light">
              სამძიმრის სიტყვები ჯერ არ დაწერილა. იყავით პირველი, ვინც ანუგეშებს ოჯახს.
            </div>
          )}
        </div>
      </section>
   
      {isNameInputModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#121214] border border-white/10 w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            <button onClick={() => setIsNameInputModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"><X size={18} /></button>
            <h3 className="font-serif text-lg text-[#FFF5D6] mb-2">დაადასტურეთ დასწრება</h3>
            <p className="text-xs text-gray-400 mb-4 font-light">გთხოვთ მიუთითოთ თქვენი სახელი და გვარი, რათა ოჯახმა იცოდეს თქვენი მოსვლის შესახებ.</p>
            <form onSubmit={handleConfirmAttendance} className="space-y-4">
              <input 
                type="text" 
                required
                placeholder="მაგ: გიორგი კალანდაძე"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl p-3 text-sm text-gray-200 focus:border-[#D4AF37] outline-none"
              />
              <button type="submit" className="cursor-pointer w-full py-3 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:brightness-110 transition-all">დადასტურება</button>
            </form>
          </div>
        </div>
      )}




     
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#121214] border border-white/10 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl flex flex-col max-h-[80vh]">
            <button onClick={() => setIsListModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"><X size={18} /></button>
            <div className="mb-4">
              <h3 className="font-serif text-xl text-[#FFF5D6] flex items-center gap-2">
                <Users size={20} className="text-[#D4AF37]" /> ვინ ესწრება
              </h3>
              <p className="text-xs text-gray-500 font-light mt-0.5">სულ დადასტურებულია: {memorial.attendeesCount || 0} ადამიანის მოსვლა</p>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 space-y-2 custom-scrollbar">
              {memorial.attendeesList && memorial.attendeesList.length > 0 ? (
                memorial.attendeesList.map((attendee, idx) => (
                  <div key={idx} className="bg-[#0D0D0F]/60 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-200">{attendee.name}</span>
                    <span className="text-[11px] text-gray-500 font-light flex items-center gap-1.5">
                      <Clock size={12} />
                      {new Date(attendee.timestamp).toLocaleDateString('ka-GE')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-600 text-sm font-light">ჯერჯერობით დასწრება არავის დაუდასტურებია.</div>
              )}
            </div>
          </div>
        </div>
      )}

     
      {activeLightboxImage && (
        <div 
          onClick={() => setActiveLightboxImage(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <button 
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white cursor-pointer bg-white/5 p-2 rounded-full border border-white/10"
          >
            <X size={20} />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-black" onClick={(e) => e.stopPropagation()}>
            <img src={activeLightboxImage} alt="გადიდებული ფოტო" className="max-w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}

    </div>
  );
};

export default MemorialPage;