"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function InvitationDisplay({ memorialId }) {
  const [selectedInv, setSelectedInv] = useState(null); 
  const invitations = useQuery(api.services.getInvitationForMemorial, { memorialId });
  const publishInvitation = useMutation(api.services.publishInvitation);

  if (invitations === undefined) return <div className="text-[10px] text-gray-500">იტვირთება...</div>;
  if (!invitations || invitations.length === 0) return null;

 
  return (
    <>
     
      <div className="flex flex-wrap gap-6">
        {invitations.map((inv) => (
          <div key={inv._id} className="flex-1 min-w-[200px] max-w-[250px] space-y-3">
            <button 
              onClick={() => setSelectedInv(inv)} 
              className="relative border border-white/10 rounded-xl overflow-hidden w-full transition hover:scale-[1.02]"
            >
              <img src={inv.url} className="w-full h-auto" alt="Invitation" />
              {inv.isPublished ? (
                <div className="absolute top-2 right-2 bg-emerald-500/80 text-[10px] px-2 py-0.5 rounded text-white font-bold">გამოქვეყნებულია</div>
              ) : (
                <div className="absolute top-2 right-2 bg-gray-500/80 text-[10px] px-2 py-0.5 rounded text-white">Draft</div>
              )}
            </button>
          </div>
        ))}
      </div>

     
      {selectedInv && (
        <div className="fixed mt-32 inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl max-w-sm w-full">
            <h3 className="text-[#FFF5D6] mb-4">
              {selectedInv.isPublished ? "მოსაწვევი გამოქვეყნებულია" : "გსურთ მოსაწვევის გამოქვეყნება?"}
            </h3>
            <img src={selectedInv.url} className="w-full rounded mb-4" alt="Preview" />
            
            <div className="flex gap-2">
              <button onClick={() => setSelectedInv(null)} className="flex-1 py-2 text-xs border border-white/10 rounded">დახურვა</button>
              
              {!selectedInv.isPublished && (
                <button 
                onClick={async () => {
                    try {
                   
                      await publishInvitation({ invitationId: selectedInv._id });
                      
                      
                      alert("მოსაწვევი წარმატებით გამოქვეყნდა!");
                      
                     
                      
                      setSelectedInv(null);
                      
                     
                    } catch (error) {
                      console.error("Publish failed:", error);
                      alert("გამოქვეყნება ვერ მოხერხდა.");
                    }
                  }}
                  className="flex-1 py-2 text-xs bg-[#c1a362] text-black font-bold rounded"
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