import { useMutation, useQuery, useAction } from "convex/react";
import { useState } from "react";
import { api } from "../convex/_generated/api";

function FamilyGroupSection({ user }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [status, setStatus] = useState("");
  const [searchError, setSearchError] = useState("");

  const myGroups = useQuery(api.family.getMyFamilyGroups, user?.id ? { userId: user.id } : "skip");
  const pendingRequests = useQuery(api.family.getPendingRequestsForUser, user?.id ? { userId: user.id } : "skip");

  const searchUserAction = useAction(api.family.searchUserByExact);
  const createGroup = useMutation(api.family.createFamilyGroup);
  const sendRequest = useMutation(api.family.sendConnectionRequest);
  const respond = useMutation(api.family.respondToRequest);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    setStatus("");
    setSearchError("");
    setSearchResult(null);
    try {
      const result = await searchUserAction({ term: searchTerm.trim() });
      setSearchResult(result);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    await createGroup({ userId: user.id, name: newGroupName.trim() });
    setNewGroupName("");
  };

  const handleSendRequest = async () => {
    if (!searchResult || !selectedGroupId) return;
    setStatus("");
    try {
      await sendRequest({
        fromUserId: user.id,
        fromUserName: user.fullName || user.username || "უცნობი",
        toUserId: searchResult.clerkId,
        groupId: selectedGroupId,
      });
      setStatus("მოთხოვნა გაგზავნილია");
      setSearchTerm("");
      setSearchResult(null);
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="mb-12 border-t border-white/10 pt-12">
      <h2 className="font-serif text-2xl text-[#FFF5D6] font-light mb-6">ოჯახის წევრები</h2>

      {pendingRequests && pendingRequests.length > 0 && (
        <div className="mb-6 space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest">მოლოდინში მოთხოვნები</p>
          {pendingRequests.map((req) => (
            <div key={req._id} className="flex items-center justify-between bg-[#121214]/60 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-300">
                <span className="text-[#D4AF37]">{req.fromUserName}</span> გეპატიჟებათ ჯგუფში „{req.groupName}"
              </p>
              <div className="flex gap-2">
                <button onClick={() => respond({ requestId: req._id, accept: true })} className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold">დათანხმება</button>
                <button onClick={() => respond({ requestId: req._id, accept: false })} className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 text-xs">უარყოფა</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">ჩემი ჯგუფები</p>
        {myGroups && myGroups.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {myGroups.map((g) => (
              <button
                key={g._id}
                onClick={() => setSelectedGroupId(g._id)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                  selectedGroupId === g._id
                    ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                {g.name} ({g.memberCount})
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-3">ჯერ არ გაქვთ ოჯახური ჯგუფი.</p>
        )}
        <div className="flex gap-2">
          <input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="ახალი ჯგუფის სახელი (მაგ. ბერიძეების ოჯახი)"
            className="form-input flex-1"
          />
          <button onClick={handleCreateGroup} className="px-4 py-2 rounded-xl border border-white/10 text-xs text-gray-300 hover:bg-white/5 whitespace-nowrap">
            ჯგუფის შექმნა
          </button>
        </div>
      </div>

      {selectedGroupId && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">წევრის მოძიება</p>
          <div className="flex gap-2 mb-2">
            <input
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setSearchResult(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="ზუსტი ემაილი ან სრული სახელი"
              className="form-input flex-1"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !searchTerm.trim()}
              className="px-4 py-2 rounded-xl border border-white/10 text-xs text-gray-300 hover:bg-white/5 whitespace-nowrap disabled:opacity-40"
            >
              {searching ? "იძებნება..." : "ძიება"}
            </button>
          </div>

          {searchResult && (
            <div className="flex items-center justify-between bg-[#121214]/60 border border-white/5 rounded-xl p-3 mb-2">
              <p className="text-xs text-emerald-400">ნაპოვნია: {searchResult.name}</p>
              <button
                onClick={handleSendRequest}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-xs font-semibold"
              >
                მოთხოვნის გაგზავნა
              </button>
            </div>
          )}
          {!searching && searchResult === null && status === "" && searchTerm.trim() && (
            <p className="text-xs text-gray-500">დააწექით "ძიება"-ს</p>
          )}

{searchError && (
  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-2">
    <span className="text-red-400 text-xs mt-0.5">⚠</span>
    <div>
      <p className="text-xs text-red-400 font-medium">ძიება ვერ მოხერხდა</p>
      <p className="text-[11px] text-gray-500 mt-0.5 font-mono break-all">{searchError}</p>
    </div>
  </div>
)}

          {status && <p className="text-xs text-[#D4AF37] mt-1">{status}</p>}
        </div>
      )}
    </div>
  );
}

export default FamilyGroupSection;