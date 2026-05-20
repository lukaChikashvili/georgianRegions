import Link from "next/link";


export const Footer = () => {
    return (
      <footer className="bg-[#0A0A0C] border-t border-white/5 py-12 font-sans">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          
      
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-serif text-base tracking-wider text-[#FFF5D6] font-light">
              Golden<span className="text-[#D4AF37]">Memory</span>
            </span>
            <span className="text-[10px] text-gray-500 font-light">
              სამუდამო ციფრული ხსოვნის სივრცე
            </span>
          </div>
  
         
          <div className="flex flex-wrap justify-center gap-8 text-xs font-light text-gray-500">
            <Link href="/discover" className="hover:text-[#D4AF37] transition-colors">არქივი</Link>
            <Link href="/grave" className="hover:text-[#D4AF37] transition-colors">3D მემორიალი</Link>
            <Link href="#how-it-works" className="hover:text-[#D4AF37] transition-colors">ინსტრუქცია</Link>
            <span className="cursor-pointer hover:text-[#D4AF37] transition-colors">კონფიდენციალურობა</span>
          </div>
  
          
          <div className="text-[10px] text-gray-600 tracking-wide font-light text-center md:text-right">
            &copy; 2026 GoldenMemory. ყველა უფლება დაცულია.
          </div>
  
        </div>
      </footer>
    );
  };