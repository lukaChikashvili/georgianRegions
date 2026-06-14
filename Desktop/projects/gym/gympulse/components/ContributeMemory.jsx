"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Send, Loader2 } from "lucide-react";

export default function ContributeMemory({ memorial }) {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addContribution = useMutation(api.memorials.addBiographyContribution);

  const access = useQuery(
    api.memorials.getMyAccessToMemorial,
    user && memorial?._id ? { memorialId: memorial._id } : "skip"
  );

  if (!user || !memorial?.groupId) return null;
  if (access === undefined) return null;
  if (!access.canContribute || access.isCreator) return null;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await addContribution({
        memorialId: memorial._id,
        text: text.trim(),
        authorName: user.fullName || user.username || "ოჯახის წევრი",
      });
      setText("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-6 px-6">
      <div className="bg-[#121214]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="font-serif text-lg text-[#FFF5D6] mb-1 flex items-center gap-3">
          <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
          დაამატეთ მოგონება
        </h3>
        <p className="text-xs text-gray-500 font-light mb-4">
          თქვენი მოგონება დაემატება ცხოვრების ისტორიას, თქვენი სახელით.
        </p>

        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="გაგვიზიარეთ მოგონება..."
          className="w-full bg-[#0D0D0F] border border-white/5 rounded-xl p-3 text-sm text-gray-200 focus:border-[#D4AF37] outline-none resize-none mb-3"
        />

        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-3">
            <span className="text-red-400 text-xs mt-0.5">⚠</span>
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-3">
            <p className="text-xs text-emerald-400">✓ მოგონება დაემატა ცხოვრების ისტორიას</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-xs font-semibold disabled:opacity-40 transition hover:brightness-110"
        >
          {submitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          {submitting ? "ემატება..." : "დამატება"}
        </button>
      </div>
    </section>
  );
}