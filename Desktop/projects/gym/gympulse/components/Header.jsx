"use client";

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import Image from 'next/image';
import logo from '../public/logo.png';
import { Bell, Crown, Menu, User, X, ChevronDown, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { UserStatusBadge } from '../components/UserStatusBadge';
import  HeaderGlowLine  from '../components/HeaderGlowLine'

const Header = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user, isLoaded } = useUser();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const markAsRead = useMutation(api.memorials.markAsRead);
  const notifications = useQuery(
    api.memorials.getMyNotifications,
    isAuthenticated ? {} : "skip"
  );

  const hasUnread = notifications?.some(n => !n.isRead);

  if (isLoading || !isLoaded) {
    return (
      <div className='w-full h-16 border-b border-[#C1A362]/10 flex items-center justify-between px-6 md:px-12'
        style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)' }}>
        <div className="w-32 h-7 bg-white/5 animate-pulse rounded" />
        <div className="w-64 h-4 bg-white/5 animate-pulse rounded hidden md:block" />
        <div className="w-20 h-8 bg-white/5 animate-pulse rounded" />
      </div>
    );
  }


  const primaryLinks = [
    { id: 1, link: "/", title: "მთავარი" },
    { id: 2, link: "/discover", title: "აღმოაჩინე" },
    { id: 3, link: "/funeral-homes", title: "დამკრძალავი ბიუროები" },
    { id: 4, link: "/services", title: "სამგლოვიარო სერვისები" }
  ];


  const secondaryLinks = [
    { id: 5, link: "/grave", title: "3D სასაფლაო" },
    { id: 6, link: "/blog", title: "ისტორიები" },
  ];

  const allLinks = [...primaryLinks, ...secondaryLinks];

  return (
    <div
      className='w-full flex items-center justify-between px-6 md:px-12 -mt-16 py-3 border-b border-[#C1A362]/10 backdrop-blur-md sticky top-0 z-50'
      style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)' }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")" }}
      />

      <button className="md:hidden text-white relative z-10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="relative z-10 group">
        <Link href="/">
          <Image width={75} src={logo} alt="logo" className="opacity-0 md:opacity-90 transition-opacity group-hover:opacity-100" />
        </Link>
      </div>

      <nav className='hidden md:flex items-center gap-6 relative z-10'>
        {primaryLinks.map((value) => (
          <div key={value.id} className="relative group cursor-pointer">
            <Link href={value.link} className="font-sans text-sm tracking-wide text-gray-400 font-light transition-colors duration-300 group-hover:text-[#C1A362]">
              {value.title}
            </Link>
            <span className="absolute left-0 -bottom-1 w-0 h-px bg-[#C1A362] transition-all duration-300 group-hover:w-full" />
          </div>
        ))}

        <div className="relative">
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            onBlur={() => setTimeout(() => setIsMoreOpen(false), 150)}
            className="cursor-pointer flex items-center gap-1 font-sans text-sm tracking-wide text-gray-400 font-light hover:text-[#C1A362] transition-colors duration-300"
          >
            მეტი <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMoreOpen && (
            <div className="absolute top-8 left-0 w-52 bg-[#111114]/95 border border-[#C1A362]/10 backdrop-blur-xl rounded-xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              {secondaryLinks.map(link => (
                <Link
                  key={link.id}
                  href={link.link}
                  onClick={() => setIsMoreOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-[#c1a362] hover:bg-white/[0.04] transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className='flex items-center gap-6 relative z-10'>
        {!isAuthenticated && (
          <SignInButton mode="modal">
            <button className="button flex gap-4 items-center">
              <User size={17} />
              შესვლა
            </button>
          </SignInButton>
        )}

        {isAuthenticated && (
          <div className='flex items-center gap-4'>

            <Link
              href="/admin"
              title="ადმინ პანელი"
              className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-[#C1A362] hover:border-[#C1A362]/20 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="შეტყობინებები"
                className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-[#C1A362] hover:border-[#C1A362]/20 transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C1A362] rounded-full animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 top-11 w-80 bg-[#111114]/95 border border-[#C1A362]/15 backdrop-blur-xl rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <h3 className="text-[#C1A362] text-[10px] uppercase tracking-widest mb-3 border-b border-white/5 pb-2">შეტყობინებები</h3>
                  <div className="max-h-56 overflow-y-auto space-y-1.5">
                    {notifications?.length === 0 ? (
                      <p className="text-gray-600 text-xs text-center py-6">შეტყობინება არ არის</p>
                    ) : (
                      notifications?.map((n) => (
                        <div
                          key={n._id}
                          className={`p-2.5 rounded-lg cursor-pointer transition-colors ${n.isRead ? 'bg-white/[0.02]' : 'bg-[#C1A362]/8'}`}
                          onClick={() => !n.isRead && markAsRead({ id: n._id })}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {n.type === "CANDLE" && "🕯️"}
                              {n.type === "ATTENDANCE" && "👥"}
                              {n.type === "REPLY" && "💬"}
                              {n.type === "CONDOLENCE" && "🙏"}
                            </span>
                            <p className={`text-xs leading-snug ${n.isRead ? 'text-gray-500' : 'text-gray-300'}`}>{n.message}</p>
                          </div>
                          <p className="text-[10px] text-gray-600 mt-1 ml-6">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <UserStatusBadge />

            <div className="p-[1px] rounded-full bg-gradient-to-b from-[#C1A362]/30 to-transparent ml-1">
              <UserButton afterSwitchSessionUrl='/' />
            </div>
          </div>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#111114]/98 border-b border-[#C1A362]/10 p-5 md:hidden flex flex-col gap-1 animate-in slide-in-from-top-3 duration-200">
          {allLinks.map((value) => (
            <Link
              key={value.id}
              href={value.link}
              className="text-base text-gray-400 py-2.5 px-3 rounded-lg hover:text-[#C1A362] hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] last:border-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {value.title}
            </Link>
          ))}
        </div>
      )}

<div className="absolute bottom-0 left-0 w-full">
  <HeaderGlowLine />
</div>
    </div>
  );
};

export default Header;