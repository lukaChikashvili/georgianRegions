"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Flag, X, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { createPortal } from 'react-dom';

const REASONS = [
  { value: "fake_memorial", label: "ყალბი მემორიალი", description: "პიროვნება გარდაცვლილი არ არის" },
  { value: "wrong_person", label: "პიროვნების ვინაობა არასწორია", description: "ფოტო ან სახელი არ ემთხვევა" },
  { value: "inappropriate_content", label: "შეუფერებელი კონტენტი", description: "შეუსაბამო ფოტო ან ტექსტი" },
  { value: "spam_or_scam", label: "სპამი / თაღლითობა", description: "ყალბი IBAN ან სხვა თაღლითობა" },
  { value: "family_objects", label: "ოჯახის პროტესტი", description: "ოჯახი ეწინააღმდეგება ამ გვერდს" },
  { value: "other", label: "სხვა", description: "სხვა მიზეზი" },
];

export default function ReportButton({ memorialId, isCreator }) {
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [step, setStep] = useState("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReport = useMutation(api.reports.submitReport);
  const alreadyReported = useQuery(
    api.reports.hasUserReported,
    memorialId ? { memorialId } : "skip"
  );

  if (isCreator) return null;

  const handleOpen = () => {
    setIsOpen(true);
    setStep("form");
    setSelectedReason("");
    setDetails("");
    setErrorMsg("");
  };

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) return;
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await submitReport({
        memorialId,
        reason: selectedReason,
        details: details.trim() || undefined,
        reporterId: user?.id || undefined,
        reporterName: user?.fullName || user?.firstName || undefined,
      });
      setStep("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "შეცდომა. სცადეთ ხელახლა.");
      setStep("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      
      <div className="relative z-10 w-full max-w-md bg-[#0F0F11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">

        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

        <div className="p-6">

          
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Flag size={14} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FFF5D6]">მემორიალის მოხსენება</h3>
                <p className="text-[11px] text-gray-500">გვეხმარება კონტენტის მოდერაციაში</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/5 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

        
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-light">აირჩიეთ მოხსენების მიზეზი</p>
                <div className="space-y-2">
                  {REASONS.map((reason) => (
                    <label
                      key={reason.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                        selectedReason === reason.value
                          ? "bg-red-500/10 border-red-500/30"
                          : "bg-[#121214]/40 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={() => setSelectedReason(reason.value)}
                        className="mt-0.5 accent-red-400 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-200">{reason.label}</p>
                        <p className="text-[11px] text-gray-500 font-light mt-0.5">{reason.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {selectedReason && (
                <div className="animate-fade-in">
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    placeholder={
                      selectedReason === "other"
                        ? "გთხოვთ, დაწვრილებით აღწეროთ პრობლემა..."
                        : "დამატებითი დეტალები (სურვილისამებრ)..."
                    }
                    className="w-full bg-[#0D0D0F] border border-white/5 rounded-xl p-3 text-xs text-gray-300 focus:border-red-500/30 outline-none resize-none placeholder:text-gray-600 transition"
                  />
                </div>
              )}

              {errorMsg && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                  {errorMsg}
                </p>
              )}

              {!user && (
                <p className="text-[11px] text-gray-600 font-light flex items-center gap-1.5">
                  <AlertTriangle size={10} className="text-yellow-600 shrink-0" />
                  ანონიმური მოხსენება — ავტორიზაცია გაზრდის სანდოობას
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl border border-white/5 text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition cursor-pointer"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason || isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting
                    ? <><Loader2 size={13} className="animate-spin" /> იგზავნება...</>
                    : <><Flag size={13} /> გაგზავნა</>
                  }
                </button>
              </div>
            </form>
          )}

         
          {step === "success" && (
            <div className="flex flex-col items-center text-center gap-4 py-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle size={26} className="text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#FFF5D6] mb-1">მოხსენება გაიგზავნა</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs">
                  გმადლობთ. ჩვენი გუნდი განიხილავს საჩივარს მოკლე დროში.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition cursor-pointer"
              >
                დახურვა
              </button>
            </div>
          )}

          
          {step === "error" && (
            <div className="flex flex-col items-center text-center gap-4 py-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={26} className="text-red-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#FFF5D6] mb-1">შეცდომა</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">{errorMsg}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition cursor-pointer"
                >
                  დახურვა
                </button>
                <button
                  onClick={() => setStep("form")}
                  className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-xs text-red-400 hover:bg-red-500/30 transition cursor-pointer"
                >
                  ხელახლა ცდა
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );

  return (
    <>
      
      <button
        onClick={handleOpen}
        disabled={alreadyReported}
        title={alreadyReported ? "უკვე მოხსენებულია" : "მოხსენება"}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-light transition-all duration-200 ${
          alreadyReported
            ? "border-white/5 text-gray-600 cursor-not-allowed"
            : "border-white/5 text-gray-500 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5 cursor-pointer"
        }`}
      >
        <Flag size={12} />
        {alreadyReported ? "მოხსენებულია" : "მოხსენება"}
      </button>

    
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}