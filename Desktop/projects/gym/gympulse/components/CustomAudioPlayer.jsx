"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Play, Pause, Volume2 } from "lucide-react";

export default function CustomAudioPlayer({ storageId }) {
  const url = useQuery(api.services.getToastUrl, { storageId });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  if (!url) return <div className="text-xs text-gray-600 animate-pulse">იტვირთება...</div>;

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const updateProgress = () => {
    const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(p);
  };

  return (
    <div className="flex items-center gap-3 bg-[#0D0D0F] border border-white/10 rounded-full px-4 py-2 w-full">
      <audio ref={audioRef} src={url} onTimeUpdate={updateProgress} onEnded={() => setIsPlaying(false)} />
      
   
      <button onClick={togglePlay} className="text-[#D4AF37] hover:text-white transition">
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>


      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] transition-all duration-100" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      
      <Volume2 size={14} className="text-gray-600" />
    </div>
  );
}