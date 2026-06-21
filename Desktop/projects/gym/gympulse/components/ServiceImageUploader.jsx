"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, Loader2, ImagePlus } from "lucide-react";


export default function ServiceImageUploader({ images = [], onChange, maxImages = 6 }) {
  const generateUploadUrl = useMutation(api.services.generateUploadUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    const remaining = maxImages - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of toUpload) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        uploaded.push({ storageId, previewUrl: URL.createObjectURL(file) });
      }
      onChange([...images, ...uploaded]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 group">
            <img
              src={img.previewUrl || img.url}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-lg border border-dashed border-white/15 flex flex-col items-center justify-center gap-1 hover:border-[#D4AF37]/40 transition-colors"
            type="button"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 text-[#D4AF37]/60 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-4 h-4 text-gray-600" />
                <span className="text-[10px] text-gray-600">დამატება</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {images.length > 0 && (
        <p className="text-[11px] text-gray-600 mt-2">{images.length}/{maxImages} ფოტო</p>
      )}
    </div>
  );
}