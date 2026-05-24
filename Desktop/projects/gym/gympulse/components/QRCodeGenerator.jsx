
"use client";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGenerator({ memorial }) {

  
  const memorialUrl = `${window.location.origin}/discover/${memorial.urlSlug}`;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#121214]/40 border border-white/10 rounded-3xl">
      <h3 className="text-[#FFF5D6] font-serif text-xl mb-6">
        QR კოდი: {memorial.firstName} {memorial.lastName}
      </h3>
      
     
      <div className="p-4 bg-white rounded-xl">
        <QRCodeCanvas 
          value={memorialUrl} 
          size={256}
          level={"H"}
          includeMargin={true}
        />
      </div>

      <p className="text-gray-500 text-xs mt-6 text-center max-w-[200px]">
        დაასკანერეთ კოდი მემორიალზე გადასასვლელად
      </p>

      
      <button 
        onClick={() => {
          const canvas = document.querySelector("canvas");
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `${memorial.firstName}_QR.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }}
        className="mt-6 px-6 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#b8962d] transition"
      >
        ჩამოტვირთვა
      </button>
    </div>
  );
}