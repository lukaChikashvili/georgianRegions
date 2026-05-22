"use client";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function ToastRecorder({ memorialId }) {
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); 
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chunks = useRef([]);
  
  const { user } = useUser();
  const generateUploadUrl = useMutation(api.toasts.generateUploadUrl);
  const saveToast = useMutation(api.toasts.saveToast);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
  
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 256;

    const updateLevel = () => {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      setAudioLevel(sum / dataArray.length); 
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    updateLevel();

    mediaRecorderRef.current = new MediaRecorder(stream);
    chunks.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      setBlob(new Blob(chunks.current, { type: 'audio/webm' }));
      cancelAnimationFrame(animationFrameRef.current);
      stream.getTracks().forEach(track => track.stop());
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const upload = async () => {
    const url = await generateUploadUrl();
    const res = await fetch(url, { method: "POST", body: blob });
    const { storageId } = await res.json();
    await saveToast({ memorialId, audioUrl: storageId, authorName: user?.fullName || "ანონიმური" });
    setIsSubmitted(true);
  };

  if (isSubmitted) return <p className="text-[#D4AF37] font-serif">მადლობა! თქვენი ტოსტი გაიგზავნა ოჯახთან დასამტკიცებლად.</p>;

  return (
    <div className="flex flex-col items-center gap-6">
   
      {recording && (
        <div className="flex items-end gap-1 h-12">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="w-2 bg-[#D4AF37] transition-all duration-75"
              style={{ height: `${Math.min(audioLevel * 1.5 + 5, 100)}%` }}
            />
          ))}
        </div>
      )}

      <div className="flex gap-4">
        {!recording ? (
          <button onClick={startRecording} className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b8962d]">მიკროფონის ჩართვა</button>
        ) : (
          <button onClick={() => { mediaRecorderRef.current.stop(); setRecording(false); }} className="bg-red-700 text-white px-6 py-2 rounded-lg">შეჩერება</button>
        )}
        {blob && <button onClick={upload} className="border border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded-lg">გაგზავნა</button>}
      </div>
    </div>
  );
}