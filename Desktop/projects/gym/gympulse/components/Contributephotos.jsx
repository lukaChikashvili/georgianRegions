"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Plus, Upload, Loader2 } from "lucide-react";

export default function ContributePhotos({ memorial }) {
  const { user } = useUser();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  const generateUploadUrl = useMutation(api.services.generateUploadUrl);
  const addGalleryPhotos = useMutation(api.memorials.addGalleryPhotos);

  const access = useQuery(
    api.memorials.getMyAccessToMemorial,
    user && memorial?._id ? { memorialId: memorial._id } : "skip"
  );

  if (!user || !memorial?.groupId) return null;
  if (access === undefined) return null;
  if (!access.canContribute || access.isCreator) return null;

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!selected.length) return;
    setError("");
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (idx) => {
    URL.revokeObjectURL(previews[idx]);
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const storageIds = [];
      for (const file of files) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!res.ok) throw new Error(`ფაილის ატვირთვა ვერ მოხერხდა: ${file.name}`);
        const { storageId } = await res.json();
        storageIds.push(storageId);
      }

      await addGalleryPhotos({ memorialId: memorial._id, newStorageIds: storageIds });

      previews.forEach(URL.revokeObjectURL);
      setFiles([]);
      setPreviews([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-6 px-6">
      <div className="bg-[#121214]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="font-serif text-lg text-[#FFF5D6] mb-1 flex items-center gap-3">
          <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
          დაამატეთ ფოტო გალერეას
        </h3>
        <p className="text-xs text-gray-500 font-light mb-4">
          ოჯახის წევრებს შეუძლიათ აქ დაამატონ ფოტოები საერთო გალერეაში.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />

        {previews.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
            {previews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#D4AF37]/20 group">
                <img src={url} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="cursor-pointer absolute top-1 right-1 p-0.5 rounded-full bg-black/70 border border-white/10 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-3">
            <span className="text-red-400 text-xs mt-0.5">⚠</span>
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-3">
            <p className="text-xs text-emerald-400">✓ ფოტოები წარმატებით დაემატა გალერეას</p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/10 text-gray-400 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] text-xs font-light transition"
          >
            <Plus size={13} /> ფოტოს არჩევა
          </button>

          {files.length > 0 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-xs font-semibold disabled:opacity-50 transition hover:brightness-110"
            >
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploading ? "იტვირთება..." : `ატვირთვა (${files.length})`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}