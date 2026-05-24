"use client";
import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function ToastRecorder({ memorialId }) {
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chunks = useRef([]);
  
  const { user } = useUser();
  const generateUploadUrl = useMutation(api.services.generateUploadUrl);
  const saveToast = useMutation(api.services.saveToast);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8; 
  
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
  
      const updateLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        
      
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setAudioLevel(average); 
        
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
  
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunks.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        setBlob(new Blob(chunks.current, { type: 'audio/webm' }));
        cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setRecording(true);
      setError(null);
    } catch (err) {
      console.error("Recording error:", err);
      setError("მიკროფონზე წვდომა უარყოფილია");
    }
  };

  const upload = async () => {
    try {
      setUploading(true);
      setError(null);

    
      console.log("Generating upload URL...");
      const uploadUrl = await generateUploadUrl();
      console.log("Upload URL:", uploadUrl);

      
      console.log("Uploading blob...");
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();
      console.log("Storage ID:", storageId);

      if (!storageId) {
        throw new Error("No storage ID returned");
      }

    
      console.log("Saving toast...");
      const toastId = await saveToast({
        memorialId,
        audioUrl: storageId,
        authorName: user?.fullName || "ანონიმური",
      });

      console.log("Toast saved with ID:", toastId);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError(`შეცდომა: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <p className="text-[#D4AF37] font-serif text-lg">
          ✓ მადლობა! თქვენი სადღეგრძელო გაიგზავნა ოჯახთან დასამტკიცებლად.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-2 rounded">
          {error}
        </div>
      )}

     
      {recording && (
  <div className="flex items-end gap-1 h-12">
    {[...Array(10)].map((_, i) => {
  
      const variation = Math.random() * 0.3 + 0.85;
      const height = Math.min((audioLevel / 255) * 100 * variation, 100);
      
      return (
        <div 
          key={i}
          className="w-2 bg-[#D4AF37] transition-all duration-100"
          style={{ height: `${Math.max(height, 5)}%` }}
        />
      );
    })}
  </div>
)}


      
      <div className="flex gap-4">
        {!recording ? (
          <button 
            onClick={startRecording} 
            className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b8962d] transition"
          >
            🎤 მიკროფონის ჩართვა
          </button>
        ) : (
          <button 
            onClick={() => { 
              mediaRecorderRef.current.stop(); 
              setRecording(false); 
            }} 
            className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            ⏹ შეჩერება
          </button>
        )}
        
        {blob && !uploading && (
          <button 
            onClick={upload} 
            className="border border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded-lg hover:bg-[#D4AF37]/10 transition"
          >
            📤 გაგზავნა
          </button>
        )}

        {uploading && (
          <button 
            disabled
            className="border border-[#D4AF37]/50 text-[#D4AF37]/50 px-6 py-2 rounded-lg cursor-not-allowed"
          >
            იტვირთება...
          </button>
        )}
      </div>

   
      {blob && !isSubmitted && (
        <audio controls src={URL.createObjectURL(blob)} className="w-full max-w-md" />
      )}
    </div>
  );
}