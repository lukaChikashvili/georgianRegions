import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AudioPlayer({ storageId }) {
    const url = useQuery(api.services.getToastUrl, { storageId });
  
    if (!url) return <span className="text-xs text-gray-500">იტვირთება აუდიო...</span>;
    
    return <audio controls src={url} className="w-full h-8" />;
  }