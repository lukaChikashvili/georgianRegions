"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";


const CATEGORIES = ["ცხოვრება","ოჯახი","კარიერა","მოგზაურობა","სიყვარული","რწმენა","მიღწევა"];


const CAT_COLORS = {
    ცხოვრება:        "#D4AF37",
    ოჯახი:      "#1D9E75",
    კარიერა:      "#378ADD",
    მოგზაურობა:      "#D85A30",
    სიყვარული:        "#D4537E",
    რწმენა:       "#7F77DD",
    მიღწევა: "#BA7517",
};



export default function LifeTimeline({ memorial, currentUserId }) {
  const isOwner = memorial.creatorId === currentUserId;
  const entries = useQuery(api.timeline.getByMemorial, { memorialId: memorial._id });
  const addEntry    = useMutation(api.timeline.add);
  const updateEntry = useMutation(api.timeline.update);
  const removeEntry = useMutation(api.timeline.remove);

 
  const [draft, setDraft] = useState({ year: "", title: "", description: "", category: "Life" });
  const [adding, setAdding] = useState(false);


  const [editing, setEditing] = useState({});

  const handleAdd = async () => {
    if (!draft.title.trim()) return;
    await addEntry({
      memorialId: memorial._id,
      creatorId: currentUserId,
      year: draft.year,
      title: draft.title,
      description: draft.description || undefined,
      category: draft.category,
    });
    setDraft({ year: "", title: "", description: "", category: "Life" });
    setAdding(false);
  };

  const handleFieldChange = (id, field, value) => {
    setEditing((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  
  const handleBlurSave = async (id, field) => {
    const val = editing[id]?.[field];
    if (val !== undefined) {
      await updateEntry({ id, [field]: val });
    }
  };

  const getVal = (entry, field) => {
    const local = editing[entry._id]?.[field];
    return local !== undefined ? local : entry[field] ?? "";
  };

  if (entries === undefined) {
    return <p className="text-[#D4AF37]/50 text-sm">იტვირთება...</p>;
  }

  return (
    <div className="space-y-6">
   
      <div className="flex items-center justify-between">
        <p className="text-[#FFF5D6]/60 text-sm font-light tracking-wide">
          {entries.length === 0
            ? "ჯერ არ არის მომენტები"
            : `${entries.length} მომენტი`}
        </p>
        {isOwner && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#1a1208] rounded-lg text-sm font-medium hover:opacity-85 transition"
          >
            + მომენტის დამატება
          </button>
        )}
      </div>

      
      {adding && isOwner && (
        <div className="bg-black/30 border border-[#D4AF37]/30 rounded-xl p-5 space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              maxLength={4}
              placeholder="წელი"
              value={draft.year}
              onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value }))}
              className="w-20 bg-black/40 border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-[#D4AF37] placeholder-white/20 text-sm outline-none focus:border-[#D4AF37]/50"
            />
            <input
              type="text"
              placeholder="სათაური *"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="flex-1 bg-black/40 border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white placeholder-white/20 text-sm outline-none focus:border-[#D4AF37]/50"
            />
          </div>
          <textarea
            placeholder="აღწერა (სურვილისამებრ)"
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            rows={2}
            className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white/80 placeholder-white/20 text-sm outline-none resize-none focus:border-[#D4AF37]/50"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setDraft((d) => ({ ...d, category: c }))}
                className="px-3 py-1 rounded-full text-xs border transition"
                style={
                  draft.category === c
                    ? { background: CAT_COLORS[c] + "33", borderColor: CAT_COLORS[c], color: CAT_COLORS[c] }
                    : { background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                }
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleAdd} className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg text-sm font-medium hover:opacity-85">
              შენახვა
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-white/40 text-sm hover:text-white/70">
              გაუქმება
            </button>
          </div>
        </div>
      )}

      
      {entries.length === 0 && !adding ? (
        <div className="text-center py-16 text-white/20 text-sm font-light">
          <div className="text-3xl mb-3 opacity-30">⧖</div>
          <p className="font-serif text-base text-white/30 italic mb-1">ყოველი ცხოვრება ათასი მომენტს შეიცავს</p>
          <p>დაიწყეთ პირველი მოგონების დამატებით</p>
        </div>
      ) : (
        <div className="relative pl-7">
        
          <div
            className="absolute left-2.5 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, #D4AF3740 8%, #D4AF3740 92%, transparent)" }}
          />

          <div className="space-y-5">
            {entries.map((entry) => {
              const cat = (entry.category ) || "Life";
              const dotColor = CAT_COLORS[cat] ?? "#D4AF37";
              return (
                <div key={entry._id} className="relative group">
                  
                  <div
                    className="absolute -left-7 top-5 w-2.5 h-2.5 rounded-full border-2 border-[#121214] transition-transform group-hover:scale-125"
                    style={{ background: dotColor }}
                  />

                  <div className="bg-black/20 border border-[#D4AF37]/10 rounded-xl p-4 hover:border-[#D4AF37]/25 transition">
                    <div className="flex items-start gap-3">
                      
                      <div className="min-w-[72px]">
                        {isOwner ? (
                          <input
                            type="text"
                            maxLength={4}
                            value={getVal(entry, "year")}
                            onChange={(e) => handleFieldChange(entry._id, "year", e.target.value)}
                            onBlur={() => handleBlurSave(entry._id, "year")}
                            className="w-16 bg-transparent text-[#D4AF37] font-serif text-lg border-b border-transparent focus:border-[#D4AF37]/40 outline-none"
                          />
                        ) : (
                          <span className="text-[#D4AF37] font-serif text-lg">{entry.year}</span>
                        )}
                        <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: dotColor + "99" }}>
                          {cat}
                        </div>
                      </div>

                    
                      <div className="flex-1 space-y-1.5">
                        {isOwner ? (
                          <input
                            type="text"
                            value={getVal(entry, "title")}
                            onChange={(e) => handleFieldChange(entry._id, "title", e.target.value)}
                            onBlur={() => handleBlurSave(entry._id , "title")}
                            className="w-full bg-transparent text-[#FFF5D6] font-medium text-sm border-b border-transparent focus:border-white/20 outline-none"
                          />
                        ) : (
                          <p className="text-[#FFF5D6] font-medium text-sm">{entry.title}</p>
                        )}
                        {isOwner ? (
                          <textarea
                            value={getVal(entry, "description")}
                            onChange={(e) => handleFieldChange(entry._id, "description", e.target.value)}
                            onBlur={() => handleBlurSave(entry._id , "description")}
                            rows={1}
                            className="w-full bg-transparent text-white/50 text-xs font-light border-b border-transparent focus:border-white/10 outline-none resize-none"
                            placeholder="აღწერა..."
                          />
                        ) : (
                          entry.description && (
                            <p className="text-white/50 text-xs font-light leading-relaxed">{entry.description}</p>
                          )
                        )}

                        
                        {isOwner && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {CATEGORIES.map((c) => (
                              <button
                                key={c}
                                onClick={() => {
                                  handleFieldChange(entry._id, "category", c);
                                  updateEntry({ id: entry._id , category: c });
                                }}
                                className="px-2 py-0.5 rounded-full text-[10px] border transition"
                                style={
                                  cat === c
                                    ? { background: CAT_COLORS[c] + "22", borderColor: CAT_COLORS[c], color: CAT_COLORS[c] }
                                    : { background: "transparent", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)" }
                                }
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                  
                      {isOwner && (
                        <button
                          onClick={() => removeEntry({ id: entry._id  })}
                          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition text-sm pt-0.5"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}