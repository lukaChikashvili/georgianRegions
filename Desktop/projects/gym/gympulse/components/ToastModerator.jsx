"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";


function AudioPlayer({ storageId }) {
  const url = useQuery(api.services.getToastUrl, { storageId });
  
  if (!url) {
    return <div className="text-gray-400 text-sm">ხმოვანი ფაილი იტვირთება...</div>;
  }
  
  return (
    <audio 
      controls 
      src={url} 
      className="w-full h-10 mb-3"
      style={{ filter: 'invert(0.9) hue-rotate(180deg)' }}
    />
  );
}

export default function ToastModerator({ memorialId }) {
  const toasts = useQuery(api.services.getToasts, { memorialId });
  const approveToast = useMutation(api.services.approveToast);


  if (toasts === undefined) {
    return <p className="text-gray-400">იტვირთება...</p>;
  }

  const pendingToasts = toasts.filter((t) => !t.isApproved);
  const approvedToasts = toasts.filter((t) => t.isApproved);

  return (
    <div className="space-y-8">
      
      <div>
        <h3 className="text-[#c1a362] font-serif text-xl mb-4">
          შემოსული სადღეგრძელოები ({pendingToasts.length})
        </h3>
        
        {pendingToasts.length === 0 ? (
          <p className="text-gray-500 italic bg-[#121214]/50 border border-[#D4AF37]/10 rounded-lg p-6 text-center">
            ახალი სადღეგრძელოები არ არის
          </p>
        ) : (
          <div className="space-y-4">
            {pendingToasts.map((toast) => (
              <div 
                key={toast._id} 
                className="border border-yellow-500/40 p-6 rounded-lg bg-[#121214]/70"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{toast.authorName}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(toast.createdAt).toLocaleString('ka-GE')}
                    </p>
                  </div>
                  <span className="text-yellow-500 text-sm bg-yellow-500/10 px-3 py-1 rounded-full">
                    ⏳ მოლოდინში
                  </span>
                </div>

            
                <AudioPlayer storageId={toast.audioUrl} />

                
                <button 
                  onClick={() => approveToast({ toastId: toast._id })}
                  className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#b8962d] transition w-full"
                >
                  ✓ დამტკიცება და გამოქვეყნება
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

 
      {approvedToasts.length > 0 && (
        <div>
          <h3 className="text-green-500 font-serif text-xl mb-4">
            დამტკიცებული სადღეგრძელოები ({approvedToasts.length})
          </h3>
          
          <div className="space-y-4">
            {approvedToasts.map((toast) => (
              <div 
                key={toast._id} 
                className="border border-green-500/20 p-6 rounded-lg bg-[#121214]/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{toast.authorName}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(toast.createdAt).toLocaleString('ka-GE')}
                    </p>
                  </div>
                  <span className="text-green-500 text-sm bg-green-500/10 px-3 py-1 rounded-full">
                    ✓ გამოქვეყნებული
                  </span>
                </div>

               
                <AudioPlayer storageId={toast.audioUrl} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}