"use client";

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import Image from 'next/image';
import logo from '../public/logo.png';
import { Bell, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';

const Header = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user, isLoaded } = useUser();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const markAsRead = useMutation(api.memorials.markAsRead);
  const notifications = useQuery(
    api.memorials.getMyNotifications, 
    isAuthenticated ? {} : "skip" 
  );

  if (isLoading || !isLoaded) {
    return (
      <div className='w-full h-20 border-b border-[#D4AF37]/10 flex items-center justify-between px-12' style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)' }}>
        <div className="w-32 h-8 bg-white/5 animate-pulse rounded" />
        <div className="w-96 h-4 bg-white/5 animate-pulse rounded hidden md:block" />
        <div className="w-24 h-8 bg-white/5 animate-pulse rounded" />
      </div>
    );
  }

  const links = [
    { id: 1, link: "/", title: "მთავარი" },
    { id: 2, link: "/discover", title: "აღმოაჩინე" },
    { id: 3, link: "/grave", title: "3D სასაფლაო" }, 
    { id: 4, link: "/", title: "მოგონებების მელოდია" },
    { id: 5, link: "/blog", title: "ისტორიები" },
  ];

  return (
    <div 
      className='w-full flex items-center justify-between px-12 -mt-16 py-4 border-b border-[#D4AF37]/10 backdrop-blur-md sticky top-0 z-50 transition-all'
      style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)' }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")" }} />
      
      <div className="relative z-10 group">
        <Link href="/"><Image width={140} src={logo} alt="logo" className="opacity-90 transition-opacity group-hover:opacity-100" /></Link> 
      </div>

      <div className='hidden md:flex items-center gap-8 relative z-10'>
        {links.map((value) => (
          <div key={value.id} className="relative group cursor-pointer">
            <Link href={value.link} className="font-sans text-sm tracking-wide text-gray-400 font-light transition-colors duration-300 group-hover:text-[#FFF5D6]">{value.title}</Link>
            <span className="absolute left-0 -bottom-1 w-0 h-px bg-linear-to-r from-[#D4AF37] to-[#AA7C11] transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>

      <div className='flex items-center gap-6 relative z-10'>
        {!isAuthenticated && (
          <SignInButton mode="modal">
            <button className="group relative px-6 py-2.5 rounded-xl font-medium text-black bg-linear-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 shadow-lg transition-all duration-300 flex items-center gap-2.5 cursor-pointer text-xs uppercase">
              <User className="w-3.5 h-3.5" /> რეგისტრაცია
            </button>
          </SignInButton>
        )}
 
        {isAuthenticated && (
          <div className='flex items-center gap-5 relative z-10'>
            <Link href="/admin" className="p-2 rounded-xl bg-[#121214]/40 border border-white/5 backdrop-blur-md text-gray-400 hover:text-[#D4AF37] transition-all" title="ადმინ პანელი">
              <LayoutDashboard className="w-4 h-4" />
            </Link>

            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-xl bg-[#121214]/40 border border-white/5 backdrop-blur-md text-gray-400 hover:text-[#D4AF37] transition-all" title="შეტყობინებები">
                <Bell className="w-4 h-4" />
                {notifications?.some(n => !n.isRead) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-[#121214]/95 border border-[#D4AF37]/20 backdrop-blur-xl rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                  <h3 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-3 border-b border-white/5 pb-2">შეტყობინებები</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications?.length === 0 ? (
                      <p className="text-gray-500 text-xs text-center py-4">ახალი შეტყობინებები არ არის</p>
                    ) : (
                      notifications?.map((n) => (
                        <div key={n._id} className={`p-3 rounded-lg cursor-pointer transition-colors ${n.isRead ? 'bg-white/[0.02]' : 'bg-[#D4AF37]/10'}`} onClick={() => !n.isRead && markAsRead({ id: n._id })}>
                          <div className="flex items-center gap-2">
                            {n.type === "CANDLE" && <span className="text-[#D4AF37]">🕯️</span>}
                            {n.type === "ATTENDANCE" && <span className="text-[#D4AF37]">👥</span>}
                            {n.type === "REPLY" && <span className="text-[#D4AF37]">💬</span>}
                            {n.type === "CONDOLENCE" && <span className="text-[#D4AF37]">🙏</span>}
                            <p className={`text-xs ${n.isRead ? 'text-gray-400' : 'text-white'}`}>{n.message}</p>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1 ml-6">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <h1 className='text-sm font-serif italic text-[#FFF5D6]/90 hidden lg:block'>გამარჯობა, <span className="text-[#D4AF37] font-sans not-italic">{user?.firstName}</span></h1>
            <div className="p-[1px] rounded-full bg-gradient-to-b from-[#D4AF37]/40 to-transparent"><UserButton afterSwitchSessionUrl='/' /></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;