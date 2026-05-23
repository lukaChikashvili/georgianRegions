"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function InvitationDisplay({ memorialId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const invitationData = useQuery(api.services.getInvitationForMemorial, { memorialId });
  const publishInvitation = useMutation(api.services.publishInvitation); 


  if (invitationData === undefined) return <div className="text-[10px] text-gray-500">იტვირთება...</div>;
  if (!invitationData || !invitationData.url) return null;

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="w-full text-left">
      
        <img src={invitationData.url} alt="Invitation" className="w-full h-auto rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37] transition" />
      </button>

      {isModalOpen && (
        <div className="mt-28 fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl max-w-sm w-full">
            <h3 className="text-[#FFF5D6] mb-4">
             
               {invitationData.isPublished ? "მოსაწვევი გამოქვეყნებულია" : "გამოაქვეყნეთ მოსაწვევი"}
            </h3>
            <img src={invitationData.url} className="w-full rounded mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-xs border border-white/10 rounded">დახურვა</button>
              
              {!invitationData.isPublished && (
                <button 
                  onClick={async () => {
                    await publishInvitation({ memorialId });
                    setIsModalOpen(false);
                    alert("მოსაწვევი წარმატებით გამოქვეყნდა!");
                  }}
                  className="flex-1 py-2 text-xs bg-[#D4AF37] text-black font-bold rounded"
                >
                  გამოქვეყნება
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}