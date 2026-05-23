import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function InvitationDisplay({ memorialId }) {
 
  const imageUrl = useQuery(api.services.getInvitationForMemorial, { memorialId });

  if (imageUrl === undefined) return <div className="text-[10px] text-gray-500">იტვირთება...</div>;
  if (!imageUrl) return null; 

  return (
    <div className="mt-2">
      <img 
        src={imageUrl} 
        alt="Funeral Invitation" 
        className="w-full h-auto rounded-lg border border-[#D4AF37]/20 shadow-lg hover:scale-[1.02] transition-transform"
      />
    </div>
  );
}