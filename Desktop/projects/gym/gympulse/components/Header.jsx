"use client";

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useConvexAuth } from 'convex/react';
import Image from 'next/image';
import logo from '../public/logo.png';
import { AppWindow, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div 
        className='w-full h-20 border-b border-[#D4AF37]/10 flex items-center justify-between px-12'
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)',
        }}
      >
        <div className="w-32 h-8 bg-white/5 animate-pulse rounded" />
        <div className="w-96 h-4 bg-white/5 animate-pulse rounded hidden md:block" />
        <div className="w-24 h-8 bg-white/5 animate-pulse rounded" />
      </div>
    );
  }

  const links = [
    { id: 1, link: "/", title: "მთავარი" },
    { id: 2, link: "/discover", title: "აღმოაჩინე" },
    { id: 3, link: "/", title: "3D სასაფლაო" }, 
    { id: 4, link: "/", title: "მოგონებების მელოდია" },
    { id: 5, link: "/blog", title: "ისტორიები" },
  ];

  return (
    <div 
      className='w-full flex items-center justify-between px-12 -mt-16 py-4 border-b border-[#D4AF37]/10 backdrop-blur-md sticky top-0 z-50 transition-all selection:bg-[#D4AF37] selection:text-black'
      style={{
       
        background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)',
      }}
    >
     
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />
      
     
      <div className="absolute top-0 right-1/4 w-40 h-10 bg-[#AA7C11]/5 rounded-full blur-xl pointer-events-none" />

 
      <div className="relative z-10 group">
        <Link href="/">
          <Image 
            width={140} 
            src={logo} 
            alt="logo" 
            className="opacity-90 transition-opacity group-hover:opacity-100 filter brightness-110 contrast-105" 
          />
        </Link> 
      </div>

   
      <div className='hidden md:flex items-center gap-8 relative z-10'>
        {links.map((value) => (
          <div key={value.id} className="relative group cursor-pointer">
            <Link 
              href={value.link} 
              className="font-sans text-sm tracking-wide text-gray-400 font-light transition-colors duration-300 group-hover:text-[#FFF5D6]"
            >
              {value.title}
            </Link>
           
            <span className="absolute left-0 -bottom-1 w-0 h-px bg-linear-to-r from-[#D4AF37] to-[#AA7C11] transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>


      <div className='flex items-center gap-6 relative z-10'>
        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <button className="group relative px-6 py-2.5 rounded-xl font-medium text-black bg-linear-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 shadow-lg hover:shadow-[#D4AF37]/10 transition-all duration-300 flex items-center gap-2.5 cursor-pointer text-xs uppercase tracking-wider ">
              <User className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
              რეგისტრაცია
            </button>
          </SignInButton>
        )}
  
  {isAuthenticated && !isLoading && (
  <div className='flex items-center gap-5 relative z-10'>
    

    <Link 
      href="/admin" 
      className="p-2 rounded-xl bg-[#121214]/40 border border-white/5 backdrop-blur-md text-gray-400 hover:text-[#FFF5D6] hover:border-[#D4AF37]/30 hover:shadow-[0_0_10px_rgba(212,175,55,0.05)] transition-all duration-300 group cursor-pointer"
      title="ადმინ პანელი"
    >
      <LayoutDashboard className="w-4 h-4 transition-transform duration-300 group-hover:scale-105 text-gray-400 group-hover:text-[#D4AF37]" />
    </Link>

   
    <h1 className='text-sm font-serif italic text-[#FFF5D6]/90 font-light tracking-wide hidden lg:block'>
      გამარჯობა, <span className="text-[#D4AF37] font-sans font-normal not-italic">{user?.firstName}</span>
    </h1>
   
    
    <div className="p-[1px] rounded-full bg-gradient-to-b from-[#D4AF37]/40 to-transparent flex items-center justify-center">
      <UserButton afterSwitchSessionUrl='/' />
    </div>
  </div>
)}
      </div>

    </div>
  );
};

export default Header;