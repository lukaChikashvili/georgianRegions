"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Inbox, TrendingUp, Clock, CheckCircle2, XCircle, Phone, Mail,
  Calendar, Banknote, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Loader2
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "მოლოდინში", color: "#D4AF37", bg: "bg-[#D4AF37]/10", border: "border-[#D4AF37]/20" },
  confirmed: { label: "დადასტურებული", color: "#4ADE80", bg: "bg-green-500/10", border: "border-green-500/20" },
  completed: { label: "დასრულებული", color: "#9CA3AF", bg: "bg-white/5", border: "border-white/10" },
  cancelled: { label: "გაუქმებული", color: "#F87171", bg: "bg-red-500/10", border: "border-red-500/20" },
};

const FILTERS = [
  { key: "all", label: "ყველა" },
  { key: "pending", label: "მოლოდინში" },
  { key: "confirmed", label: "დადასტურებული" },
  { key: "completed", label: "დასრულებული" },
  { key: "cancelled", label: "გაუქმებული" },
];

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "ახლახანს";
  if (hrs < 24) return `${hrs} სთ წინ`;
  return `${Math.floor(hrs / 24)} დღის წინ`;
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${cfg.bg} ${cfg.border}`} style={{ color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function BookingCard({ booking, onConfirm, onDecline, onComplete, actingId }) {
  const isActing = actingId === booking._id;
  return (
    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[#FFF5D6]/90 text-sm font-medium">{booking.customerName}</h3>
            <StatusBadge status={booking.status} />
          </div>
          <p className="text-gray-500 text-xs">{booking.serviceName}</p>
        </div>
        <div className="text-right shrink-0">
          {booking.servicePrice !== undefined && (
            <p className="text-[#D4AF37] text-sm font-medium">{booking.servicePrice} ₾</p>
          )}
          <p className="text-gray-600 text-[11px] mt-0.5">{timeAgo(booking._creationTime)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-xs text-gray-500">
        <a href={`tel:${booking.customerPhone}`} className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
          <Phone className="w-3.5 h-3.5" /> {booking.customerPhone}
        </a>
        <a href={`mailto:${booking.customerEmail}`} className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
          <Mail className="w-3.5 h-3.5" /> {booking.customerEmail}
        </a>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(booking.requestedDate).toLocaleDateString("ka-GE", { day: "numeric", month: "long" })}
        </span>
        <span className="flex items-center gap-1.5">
          {booking.paymentMethod === "online" ? (
            <><CreditCard className="w-3.5 h-3.5" /> ონლაინ გადახდილი</>
          ) : (
            <><Banknote className="w-3.5 h-3.5" /> ნაღდი/გადარიცხვა</>
          )}
        </span>
      </div>

      {booking.note && <p className="text-xs text-gray-500 mb-4 italic">"{booking.note}"</p>}

      {booking.status === "pending" && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onConfirm(booking._id)}
            disabled={isActing}
            className="button flex items-center gap-1.5 px-4 py-2 rounded-lg   text-black text-xs font-medium hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} დადასტურება
          </button>
          <button
            onClick={() => onDecline(booking._id)}
            disabled={isActing}
            className="button4 flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-gray-400 text-xs hover:text-red-400 hover:border-red-400/30 transition-all disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" /> უარყოფა
          </button>
        </div>
      )}

      {booking.status === "confirmed" && (
        <button
          onClick={() => onComplete(booking._id)}
          disabled={isActing}
          className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors"
        >
          მონიშნე როგორც დასრულებული
        </button>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, trend }) {
  return (
    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#D4AF37]" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-[11px] ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-serif text-[#FFF5D6]">{value}</p>
      <p className="text-gray-500 text-xs mt-1">{label}</p>
      {sub && <p className="text-gray-600 text-[11px] mt-2">{sub}</p>}
    </div>
  );
}

function RevenueChart({ byMonth }) {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({
      key,
      label: d.toLocaleDateString("ka-GE", { month: "short" }),
      amount: byMonth[key] || 0,
    });
  }
  const max = Math.max(1, ...months.map(m => m.amount));

  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
      <h3 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-6">შემოსავალი თვეების მიხედვით</h3>
      <div className="flex items-end justify-between gap-3 h-40">
        {months.map((m) => (
          <div key={m.key} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[10px] text-gray-500">{m.amount > 0 ? `${m.amount}₾` : ""}</span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-[#AA7C11] to-[#D4AF37] transition-all duration-500"
              style={{ height: `${(m.amount / max) * 100}%`, minHeight: m.amount > 0 ? "4px" : "0" }}
            />
            <span className="text-[10px] text-gray-600">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BookingsRevenuePage() {
  const { isAuthenticated } = useConvexAuth();
  const myFuneralHome = useQuery(
    api.funeralHomes.getMyFuneralHome,
    isAuthenticated ? {} : "skip"
  );

  const [tab, setTab] = useState("bookings");
  const [filter, setFilter] = useState("all");
  const [actingId, setActingId] = useState(null);

  const funeralHomeId = myFuneralHome?._id;

  const bookings = useQuery(
    api.bookings.getFuneralHomeBookings,
    funeralHomeId ? { funeralHomeId, status: filter === "all" ? undefined : filter } : "skip"
  );

  const stats = useQuery(
    api.bookings.getRevenueStats,
    funeralHomeId ? { funeralHomeId } : "skip"
  );

  const confirmBooking = useMutation(api.bookings.confirmBooking);
  const declineBooking = useMutation(api.bookings.declineBooking);
  const completeBooking = useMutation(api.bookings.completeBooking);

  const handleConfirm = async (id) => {
    setActingId(id);
    try {
      await confirmBooking({ bookingId: id });
    } finally {
      setActingId(null);
    }
  };

  const handleDecline = async (id) => {
    setActingId(id);
    try {
      await declineBooking({ bookingId: id });
    } finally {
      setActingId(null);
    }
  };

  const handleComplete = async (id) => {
    setActingId(id);
    try {
      await completeBooking({ bookingId: id });
    } finally {
      setActingId(null);
    }
  };

  const pendingCount = useMemo(
    () => bookings?.filter(b => b.status === "pending").length ?? 0,
    [bookings]
  );

  if (!funeralHomeId) return null; 

  return (
    <div>
    
      <div className="flex items-center gap-4 mb-6 p-1 rounded-xl border border-white/5 bg-white/[0.02] w-fit">
        <button
          onClick={() => setTab("bookings")}
          className={`button flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            tab === "bookings" ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Inbox className="w-3.5 h-3.5" /> ჯავშნები
          {pendingCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
        </button>
        <button
          onClick={() => setTab("revenue")}
          className={`button flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            tab === "revenue" ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> შემოსავალი
        </button>
      </div>

      {tab === "bookings" && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs transition-all border ${
                  filter === f.key
                    ? "bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]"
                    : "border-white/10 text-gray-500 hover:text-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {bookings === undefined ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-6 h-6 text-[#D4AF37]/50 animate-spin" />
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map(b => (
                <BookingCard
                  key={b._id}
                  booking={b}
                  onConfirm={handleConfirm}
                  onDecline={handleDecline}
                  onComplete={handleComplete}
                  actingId={actingId}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Inbox className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">ჯავშნები არ მოიძებნა</p>
            </div>
          )}
        </div>
      )}

      {tab === "revenue" && (
        stats === undefined ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-6 h-6 text-[#D4AF37]/50 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={Wallet} label="სულ შემოსავალი" value={`${stats.totalRevenue} ₾`} />
              <StatCard icon={Clock} label="მოლოდინში" value={`${stats.pendingRevenue} ₾`} sub="დასადასტურებელი" />
              <StatCard icon={TrendingUp} label="საშ. ჯავშნის ღირებულება" value={`${stats.avgBooking} ₾`} />
              <StatCard icon={CreditCard} label="ონლაინ გადახდები" value={stats.onlineCount} sub={`სულ ${stats.totalBookings} ჯავშნიდან`} />
            </div>

            <RevenueChart byMonth={stats.byMonth} />

            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <h3 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-5">სერვისების მიხედვით</h3>
              <div className="space-y-3">
                {Object.entries(stats.byService).length > 0 ? (
                  Object.entries(stats.byService).map(([name, amount]) => (
                    <div key={name} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                      <span className="text-sm text-gray-400">{name}</span>
                      <span className="text-sm text-[#D4AF37]">{amount} ₾</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">ჯერ არ არის შემოსავალი</p>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}