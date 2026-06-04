"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const UserStatusBadge = () => {
  const isPremium = useQuery(api.pricing.isPremium);

 
  if (isPremium === false) {
    return (
      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 uppercase tracking-wider">
        უფასო
      </span>
    );
  }


  return (
    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
      ★ პრემიუმი
    </span>
  );
};