"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ToastModerator({ memorialId }) {

  const toasts = useQuery(api.services.getToasts, { memorialId });
  const approveToast = useMutation(api.services.approveToast);


  const pendingToasts = toasts?.filter((t) => !t.isApproved);

  if (!pendingToasts || pendingToasts.length === 0) {
    return <p className="text-gray-500 italic">ახალი სადღეგრძელოები არ არის.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[#D4AF37] font-serif">მოდერაცია</h3>
      {pendingToasts.map((toast) => (
        <div key={toast._id} className="border border-[#D4AF37]/30 p-4 rounded-lg bg-black">
          <p className="text-white mb-2">{toast.authorName}</p>
          <button 
            onClick={() => approveToast({ toastId: toast._id })}
            className="bg-[#D4AF37] text-black px-4 py-1 rounded text-sm font-bold"
          >
            დამტკიცება და გამოქვეყნება
          </button>
        </div>
      ))}
    </div>
  );
}