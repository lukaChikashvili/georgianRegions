"use client";

import { useState } from "react";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser, SignInButton } from "@clerk/nextjs";
import { X, Calendar, Loader2, CheckCircle2 } from "lucide-react";

export default function BookingModal({ funeralHomeId, service, onClose }) {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const createBooking = useMutation(api.bookings.createBooking);

  const [form, setForm] = useState({
    customerName: user?.fullName || "",
    customerPhone: "",
    customerEmail: user?.primaryEmailAddress?.emailAddress || "",
    requestedDate: "",
    note: "",
    paymentMethod: "manual",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.customerName || !form.customerPhone || !form.customerEmail || !form.requestedDate) {
      setError("გთხოვთ შეავსოთ ყველა სავალდებულო ველი");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createBooking({
        funeralHomeId,
        serviceName: service.name,
        serviceDescription: service.description,
        servicePrice: service.price,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        requestedDate: form.requestedDate,
        note: form.note || undefined,
        paymentMethod: form.paymentMethod,
      });
      setDone(true);
    } catch (e) {
      setError(e.data ?? e.message ?? "დაფიქსირდა შეცდომა");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#D4AF37]/15 p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: '#111114' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#FFF5D6] font-serif italic text-lg">{service.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <p className="text-[#FFF5D6]/90 text-sm mb-2">თქვენი ჯავშანი გაიგზავნა</p>
            <p className="text-gray-500 text-xs">დამკრძალავი ბიურო დაგიკავშირდებათ მალე</p>
            <button
              onClick={onClose}
              className="button mt-6 px-6 py-2.5 rounded-xl  text-black text-sm font-medium"
            >
              დახურვა
            </button>
          </div>
        ) : !isAuthenticated ? (
          <div className="py-6 text-center">
            <p className="text-gray-400 text-sm mb-5">ჯავშნისთვის გთხოვთ შეხვიდეთ სისტემაში</p>
            <SignInButton mode="modal">
              <button className="button px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-sm font-medium">
                შესვლა
              </button>
            </SignInButton>
          </div>
        ) : (
          <div className="space-y-4">
            {service.price !== undefined && (
              <div className="px-4 py-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15 flex items-center justify-between">
                <span className="text-gray-400 text-xs">ფასი</span>
                <span className="text-[#D4AF37] text-sm font-medium">{service.price} ₾</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-2">სახელი და გვარი *</label>
              <input
                value={form.customerName}
                onChange={(e) => update("customerName", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-2">ტელეფონი *</label>
                <input
                  value={form.customerPhone}
                  onChange={(e) => update("customerPhone", e.target.value)}
                  placeholder="+995 5XX XXX XXX"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">ელ-ფოსტა *</label>
                <input
                  value={form.customerEmail}
                  onChange={(e) => update("customerEmail", e.target.value)}
                  type="email"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">სასურველი თარიღი *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="date"
                  value={form.requestedDate}
                  onChange={(e) => update("requestedDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">დამატებითი შენიშვნა</label>
              <textarea
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                rows={2}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40 resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="button w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl   text-black text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              ჯავშნის გაგზავნა
            </button>
          </div>
        )}
      </div>
    </div>
  );
}