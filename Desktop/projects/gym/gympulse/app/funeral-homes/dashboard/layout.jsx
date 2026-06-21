"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Inbox, ExternalLink, Loader2, Plus } from "lucide-react";

const TABS = [
  { href: "/funeral-homes/dashboard", label: "პროფილი", exact: true },
  { href: "/funeral-homes/dashboard/bookings", label: "ჯავშნები & შემოსავალი" },
];

export default function DashboardLayout({ children }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const myFuneralHome = useQuery(
    api.funeralHomes.getMyFuneralHome,
    isAuthenticated ? {} : "skip"
  );
  const pathname = usePathname();

  if (isLoading || (isAuthenticated && myFuneralHome === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <Loader2 className="w-8 h-8 text-[#c1a362] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0A' }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-[#c1a362]" />
          </div>
          <h1 className="text-2xl font-serif italic text-[#FFF5D6] mb-3">საჭიროა ავტორიზაცია</h1>
          <SignInButton mode="modal">
            <button className="mt-4 px-8 py-3 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-medium rounded-xl hover:brightness-110 transition-all">
              შესვლა
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (!myFuneralHome) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0A' }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-[#c1a362]" />
          </div>
          <h1 className="text-2xl font-serif italic text-[#FFF5D6] mb-3">თქვენ არ გაქვთ რეგისტრირებული სამგლოვიარო სახლი</h1>
          <p className="text-gray-500 text-sm mb-8">დაარეგისტრირეთ თქვენი სამგლოვიარო სახლი და დაიწყეთ მუშაობა</p>
          <Link
            href="/funeral-homes/create"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-medium rounded-xl hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" /> რეგისტრაცია
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = myFuneralHome.subscriptionExpiresAt
    ? Math.max(0, Math.ceil((myFuneralHome.subscriptionExpiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="min-h-screen py-16 px-6 mt-16" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)' }}>
      <div className="max-w-4xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[#c1a362] text-xs uppercase tracking-widest mb-2">მართვის პანელი</p>
            <h1 className="text-2xl font-serif italic text-[#FFF5D6]">{myFuneralHome.name}</h1>
          </div>
          <Link
            href={`/funeral-homes/${myFuneralHome._id}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 text-sm transition-all w-fit"
          >
            <ExternalLink className="w-3.5 h-3.5" /> ნახვა
          </Link>
        </div>

       
        <div className="flex items-center gap-2 mb-8 p-1 rounded-xl border border-white/5 bg-white/[0.02] w-fit">
          {TABS.map(tab => {
            const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  active ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label.includes("ჯავშნები") ? <Inbox className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                {tab.label}
              </Link>
            );
          })}
        </div>

      
        <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
          myFuneralHome.subscriptionStatus === "trial"
            ? "bg-[#D4AF37]/5 border-[#D4AF37]/15"
            : myFuneralHome.subscriptionStatus === "active"
            ? "bg-green-500/5 border-green-500/15"
            : "bg-red-500/5 border-red-500/15"
        }`}>
          <div className="flex-1">
            {myFuneralHome.subscriptionStatus === "trial" && (
              <p className="text-sm text-gray-300">
                საცდელი პერიოდი — დარჩენილია <span className="text-[#D4AF37] font-medium">{daysLeft} დღე</span>
              </p>
            )}
            {myFuneralHome.subscriptionStatus === "active" && (
              <p className="text-sm text-gray-300">გამოწერა აქტიურია</p>
            )}
            {myFuneralHome.subscriptionStatus === "expired" && (
              <p className="text-sm text-gray-300">გამოწერა ამოიწურა — გაანახლეთ რომ თქვენი გვერდი დარჩეს აქტიური</p>
            )}
          </div>
          {myFuneralHome.subscriptionStatus !== "active" && (
            <button className="px-4 py-2 rounded-lg bg-[#D4AF37]/15 text-[#c1a362] text-xs font-medium hover:bg-[#D4AF37]/25 transition-colors shrink-0">
              გამოწერის შეძენა
            </button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}