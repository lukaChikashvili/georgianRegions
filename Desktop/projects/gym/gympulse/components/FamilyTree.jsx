"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Crown, Lock, Plus, Trash2, X, UserPlus, Link2 } from "lucide-react";


const ROLES = ["მამა","დედა","შვილი","ქალიშვილი","ძმა","და","ბაბუა","ბებია","მეუღლე","ბიძა","დეიდა","ბიძაშვილი"];

const ROLE_COLORS = {
  მამა:      "#378ADD",
  დედა:      "#D4537E",
  შვილი:     "#1D9E75",
  ქალიშვილი: "#D4AF37",
  ძმა:       "#7F77DD",
  და:        "#D85A30",
  პაპა:      "#378ADD",
  ბებია:     "#D4537E",
  მეუღლე:   "#BA7517",
  ბიძა:      "#888780",
  დეიდა:     "#888780",
  ბიძაშვილი: "#888780",
};

const REL_LABELS = {
  parent: "მშობელი",
  child: "შვილი",
  spouse: "მეუღლე",
  sibling: "და-ძმა",
};


function FamilyNode({ data }) {
  const color = ROLE_COLORS[data.role] ?? "#D4AF37";
  return (
    <div
      className="relative group"
      style={{ minWidth: 140 }}
    >
      <Handle type="target" position={Position.Top} style={{ background: color, border: "none", width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} style={{ background: color, border: "none", width: 8, height: 8 }} />

      <div
        className="rounded-2xl border overflow-hidden shadow-xl transition-all"
        style={{
          background: "#0F0F11",
          borderColor: color + "44",
          boxShadow: `0 0 20px ${color}11`,
        }}
      >
       
        <div
          className="w-full h-20 flex items-center justify-center relative"
          style={{ background: color + "11" }}
        >
          {data.portraitUrl ? (
            <img src={data.portraitUrl} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-serif"
              style={{ background: color + "22", color }}
            >
              {data.name?.[0] ?? "?"}
            </div>
          )}
          
          <div
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-widest whitespace-nowrap"
            style={{ background: color + "22", color, border: `1px solid ${color}44` }}
          >
            {data.role}
          </div>
        </div>

        
        <div className="px-3 py-2.5 text-center">
          <p className="text-[#FFF5D6] text-xs font-medium leading-tight">{data.name}</p>
          {(data.birthYear || data.deathYear) && (
            <p className="text-[10px] mt-0.5" style={{ color: color + "99" }}>
              {data.birthYear ?? "?"} {data.deathYear ? `— ${data.deathYear}` : ""}
            </p>
          )}
        </div>
      </div>

      
      {data.isOwner && (
        <button
          onClick={(e) => { e.stopPropagation(); data.onDelete(data.memberId); }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-900/80 border border-red-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-800"
        >
          <X size={9} className="text-red-300" />
        </button>
      )}
    </div>
  );
}

const nodeTypes = { familyMember: FamilyNode };


function AddMemberModal({ onClose, onAdd, isAdding }) {
  const [form, setForm] = useState({ name: "", role: "მამა", birthYear: "", deathYear: "" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-[#0F0F11] border border-[#D4AF37]/20 rounded-2xl p-6 flex flex-col gap-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent -mt-1 mb-1" />
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-400"><X size={14} /></button>

        <h3 className="text-[#FFF5D6] font-serif text-lg font-light">ოჯახის წევრის დამატება</h3>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-gray-500 uppercase tracking-wider">სახელი *</label>
            <input
              type="text"
              placeholder="სახელი გვარი"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-gray-500 uppercase tracking-wider">ნათესაობა *</label>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => {
                const color = ROLE_COLORS[r] ?? "#D4AF37";
                const selected = form.role === r;
                return (
                  <button
                    key={r}
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className="px-2.5 py-1 rounded-full text-xs border transition"
                    style={selected
                      ? { background: color + "22", borderColor: color, color }
                      : { background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                    }
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-gray-500 uppercase tracking-wider">დაბადება</label>
              <input
                type="text"
                maxLength={4}
                placeholder="1945"
                value={form.birthYear}
                onChange={(e) => setForm((f) => ({ ...f, birthYear: e.target.value }))}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-gray-500 uppercase tracking-wider">გარდაცვალება</label>
              <input
                type="text"
                maxLength={4}
                placeholder="2010"
                value={form.deathYear}
                onChange={(e) => setForm((f) => ({ ...f, deathYear: e.target.value }))}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/40"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onAdd(form)}
          disabled={!form.name.trim() || isAdding}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold text-sm disabled:opacity-50 hover:brightness-110 transition"
        >
          {isAdding ? "ემატება..." : "დამატება"}
        </button>
      </div>
    </div>
  );
}


function UpgradeModal({ onClose, onUpgrade, isUpgrading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-[#0F0F11] border border-[#D4AF37]/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
        <div className="p-7 flex flex-col gap-5">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-400"><X size={14} /></button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-[#1A150F] border border-[#D4AF37]/20 flex items-center justify-center text-2xl">🌳</div>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#AA7C11] to-[#D4AF37] flex items-center justify-center">
                <Crown size={9} className="text-black" />
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70">პრემიუმ ფუნქცია</p>
              <h3 className="text-base font-semibold text-[#FFF5D6] mt-0.5">ოჯახის ხე — ულიმიტო</h3>
            </div>
          </div>
          <p className="text-sm text-gray-400 font-light">უფასო პაკეტში მაქსიმუმ 3 წევრის დამატებაა შესაძლებელი. განაახლეთ ულიმიტო ოჯახის ხისთვის.</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[#D4AF37]">49.99</span>
            <span className="text-sm text-gray-500">₾</span>
            <span className="text-xs text-gray-600 ml-1">ერთჯერადი · სამუდამოდ</span>
          </div>
          <button
            onClick={onUpgrade}
            disabled={isUpgrading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isUpgrading ? "მიმდინარეობს..." : <><Crown size={15} /> განაახლე — 49.99 ₾</>}
          </button>
          <p className="text-center text-[11px] text-gray-600">BOG-ის დაცული გადახდის გვერდზე გადახვალთ</p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>
    </div>
  );
}


function ConnectModal({ members, onClose, onConnect }) {
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");
  const [type, setType] = useState("parent");
  const valid = from && to && from !== to;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-[#0F0F11] border border-[#D4AF37]/20 rounded-2xl p-6 flex flex-col gap-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-400"><X size={14} /></button>
        <h3 className="text-[#FFF5D6] font-serif text-lg font-light">კავშირის დამატება</h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-gray-500 uppercase tracking-wider">პირველი წევრი</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/40">
            <option value="">— აირჩიეთ —</option>
            {members.map((m) => <option key={m._id} value={m._id}>{m.name} ({m.role})</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-gray-500 uppercase tracking-wider">კავშირის ტიპი</label>
          <div className="flex gap-2 flex-wrap">
            {(["parent","child","spouse","sibling"] ).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-3 py-1 rounded-full text-xs border transition"
                style={type === t
                  ? { background: "#D4AF3722", borderColor: "#D4AF37", color: "#D4AF37" }
                  : { background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                }
              >
                {REL_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-gray-500 uppercase tracking-wider">მეორე წევრი</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/40">
            <option value="">— აირჩიეთ —</option>
            {members.filter((m) => m._id !== from).map((m) => <option key={m._id} value={m._id}>{m.name} ({m.role})</option>)}
          </select>
        </div>

        <button
          onClick={() => valid && onConnect(from, to, type)}
          disabled={!valid}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold text-sm disabled:opacity-40 hover:brightness-110 transition"
        >
          კავშირის შექმნა
        </button>
      </div>
    </div>
  );
}


export default function FamilyTree({ memorial, currentUserId, isPremium = false }) {
  const isOwner = memorial.creatorId === currentUserId;
  const tree = useQuery(api.familyTree.getTree, { memorialId: memorial._id });

  const addMemberMutation = useMutation(api.familyTree.addMember);
  const removeMemberMutation = useMutation(api.familyTree.removeMember);
  const addRelMutation = useMutation(api.familyTree.addRelationship);
  const removeRelMutation = useMutation(api.familyTree.removeRelationship);
  const updatePositionMutation= useMutation(api.familyTree.updateMemberPosition);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [showAddModal,     setShowAddModal]  = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isAdding,         setIsAdding] = useState(false);
  const [isUpgrading,      setIsUpgrading] = useState(false);

  const limitReached = !isPremium && (tree?.members.length ?? 0) >= 3;

  
  useEffect(() => {
    if (!tree) return;

    const newNodes = tree.members.map((m, i) => ({
      id: m._id,
      type: "familyMember",
      position: {
        x: m.positionX ?? (i % 4) * 180,
        y: m.positionY ?? Math.floor(i / 4) * 200,
      },
      data: {
        memberId: m._id,
        name: m.name,
        role: m.role,
        birthYear: m.birthYear,
        deathYear: m.deathYear,
        portraitUrl: m.portraitUrl,
        isOwner,
        onDelete: handleDelete,
      },
    }));

    const edgeTypeColors = {
      parent:  "#378ADD",
      child:   "#1D9E75",
      spouse:  "#D4537E",
      sibling: "#7F77DD",
    };

    const newEdges = tree.relationships.map((r) => ({
      id: r._id,
      source: r.fromMemberId,
      target: r.toMemberId,
      label: REL_LABELS[r.type],
      labelStyle: { fill: "#D4AF37", fontSize: 10 },
      labelBgStyle: { fill: "#0F0F11", fillOpacity: 0.8 },
      style: { stroke: edgeTypeColors[r.type] ?? "#D4AF37", strokeWidth: 1.5 },
      animated: r.type === "spouse",
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [tree]);

  const handleDelete = useCallback(async (memberId) => {
    await removeMemberMutation({ id: memberId });
  }, [removeMemberMutation]);

  const handleAdd = async (form) => {
    setIsAdding(true);
    try {
      await addMemberMutation({
        memorialId: memorial._id,
        name: form.name,
        role: form.role,
        birthYear: form.birthYear || undefined,
        deathYear: form.deathYear || undefined,
      });
      setShowAddModal(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleConnect = async (fromId, toId, type) => {
    await addRelMutation({
      memorialId: memorial._id,
      fromMemberId: fromId,
      toMemberId: toId ,
      type,
    });
    setShowConnectModal(false);
  };

  
  const onNodeDragStop = useCallback((_, node) => {
    updatePositionMutation({
      id: node.id ,
      positionX: node.position.x,
      positionY: node.position.y,
    });
  }, [updatePositionMutation]);

  
  const onEdgeClick = useCallback((_, edge) => {
    if (!isOwner) return;
    if (confirm("კავშირი წაიშალოს?")) {
      removeRelMutation({ id: edge.id });
    }
  }, [isOwner, removeRelMutation]);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const { redirectUrl } = await res.json();
      window.location.href = redirectUrl;
    } catch {
      setIsUpgrading(false);
    }
  };

  if (tree === undefined) {
    return <p className="text-[#D4AF37]/50 text-sm animate-pulse">იტვირთება...</p>;
  }

  const controlsStyle = {
    background: "#0F0F11",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: 12,
    padding: 4,
    gap: 2,
  };

  return (
    <div className="flex flex-col gap-4">
      {showAddModal     && <AddMemberModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} isAdding={isAdding} />}
      {showConnectModal && <ConnectModal members={tree.members} onClose={() => setShowConnectModal(false)} onConnect={handleConnect} />}
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} onUpgrade={handleUpgrade} isUpgrading={isUpgrading} />}

      
      {isOwner && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-[#FFF5D6]/50 text-sm">
              {tree.members.length} წევრი
              {!isPremium && <span className="ml-1.5 text-[#D4AF37]/40 text-xs">({tree.members.length}/3 უფასო)</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {tree.members.length >= 2 && (
              <button
                onClick={() => setShowConnectModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 text-xs transition"
              >
                <Link2 size={12} /> კავშირი
              </button>
            )}
            {limitReached ? (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#D4AF37]/20 bg-[#1A150F]/40 text-[#D4AF37]/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 text-xs transition"
              >
                <Lock size={12} /> წევრის დამატება <Crown size={9} className="ml-0.5 opacity-60" />
              </button>
            ) : (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] text-[#0F0F11] rounded-lg text-xs font-bold hover:opacity-85 transition"
              >
                <UserPlus size={12} /> წევრის დამატება
              </button>
            )}
          </div>
        </div>
      )}

   
      <div
        className="rounded-2xl overflow-hidden border border-[#D4AF37]/10"
        style={{ height: 520 }}
      >
        {tree.members.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-black/20">
            <div className="text-4xl opacity-20">🌳</div>
            <p className="text-white/20 font-serif text-base italic">ოჯახის ხე ჯერ ცარიელია</p>
            {isOwner && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 mt-2 bg-[#D4AF37] text-black rounded-lg text-sm font-medium hover:opacity-85"
              >
                <Plus size={14} /> პირველი წევრის დამატება
              </button>
            )}
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={onNodeDragStop}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            nodesDraggable={isOwner}
            nodesConnectable={false}
            fitView
            style={{ background: "#0b0d12" }}
          >
            <Background color="#D4AF3711" gap={24} />
            <Controls
               style={controlsStyle}
               showInteractive={false}
                             />
            <MiniMap
              style={{ background: "#0F0F11", border: "1px solid rgba(212,175,55,0.1)" }}
              nodeColor={(n) => ROLE_COLORS[n.data?.role ] ?? "#D4AF37"}
              maskColor="rgba(0,0,0,0.7)"
            />
          </ReactFlow>
        )}
      </div>

      {isOwner && tree.members.length > 0 && (
        <p className="text-[11px] text-gray-600 text-center">
          კვანძების გადასატანად გამოიყენეთ drag • კავშირის წასაშლელად დააჭირეთ ხაზს
        </p>
      )}
    </div>
  );
}