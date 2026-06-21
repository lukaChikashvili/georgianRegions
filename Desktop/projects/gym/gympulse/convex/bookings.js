import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";


async function requireFuneralHomeOwner(ctx, funeralHomeId) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("ავტორიზაცია საჭიროა");
    }
    const fh = await ctx.db.get(funeralHomeId);
    if (!fh) {
      throw new ConvexError("დამკრძალავი ბიურო ვერ მოიძებნა");
    }
    if (fh.ownerId !== identity.subject) {
      throw new ConvexError("არ გაქვთ წვდომა ამ რესურსზე");
    }
    return fh;
  }


  export const createBooking = mutation({
    args: {
      funeralHomeId: v.id("funeralHomes"),
      serviceName: v.string(),
      serviceDescription: v.optional(v.string()),
      servicePrice: v.optional(v.number()),
      customerName: v.string(),
      customerPhone: v.string(),
      customerEmail: v.string(),
      memorialId: v.optional(v.id("memorials")),
      requestedDate: v.string(),
      note: v.optional(v.string()),
      paymentMethod: v.union(v.literal("online"), v.literal("manual")),
    },
    handler: async (ctx, args) => {
      const fh = await ctx.db.get(args.funeralHomeId);
      if (!fh) {
        throw new ConvexError("დამკრძალავი ბიურო ვერ მოიძებნა");
      }
      if (fh.status !== "active") {
        throw new ConvexError("ეს დამკრძალავი ბიურო ამჟამად არააქტიურია");
      }
  
      const identity = await ctx.auth.getUserIdentity();
  
      const bookingId = await ctx.db.insert("bookings", {
        funeralHomeId: args.funeralHomeId,
        serviceName: args.serviceName,
        serviceDescription: args.serviceDescription,
        servicePrice: args.servicePrice,
        customerUserId: identity?.subject,
        customerName: args.customerName,
        customerPhone: args.customerPhone,
        customerEmail: args.customerEmail,
        memorialId: args.memorialId,
        requestedDate: args.requestedDate,
        note: args.note,
        status: "pending",
        paymentMethod: args.paymentMethod,
        paymentStatus: "unpaid",
      });
  
      
      await ctx.scheduler.runAfter(0, "bookings:sendBookingNotification", {
        bookingId,
      });
  
      return bookingId;
    },
  });


  export const confirmBooking = mutation({
    args: { bookingId: v.id("bookings") },
    handler: async (ctx, { bookingId }) => {
      const booking = await ctx.db.get(bookingId);
      if (!booking) throw new ConvexError("ჯავშანი ვერ მოიძებნა");
      await requireFuneralHomeOwner(ctx, booking.funeralHomeId);
  
      if (booking.status !== "pending") {
        throw new ConvexError("მხოლოდ მოლოდინში მყოფი ჯავშნის დადასტურებაა შესაძლებელი");
      }
  
      await ctx.db.patch(bookingId, {
        status: "confirmed",
        confirmedAt: Date.now(),
      });
  
      await ctx.scheduler.runAfter(0, "bookings:sendStatusEmailToCustomer", {
        bookingId,
        newStatus: "confirmed",
      });
    },
  });
  
  export const declineBooking = mutation({
    args: { bookingId: v.id("bookings"), reason: v.optional(v.string()) },
    handler: async (ctx, { bookingId, reason }) => {
      const booking = await ctx.db.get(bookingId);
      if (!booking) throw new ConvexError("ჯავშანი ვერ მოიძებნა");
      await requireFuneralHomeOwner(ctx, booking.funeralHomeId);
  
      if (booking.status !== "pending") {
        throw new ConvexError("მხოლოდ მოლოდინში მყოფი ჯავშნის უარყოფაა შესაძლებელი");
      }
  
      await ctx.db.patch(bookingId, {
        status: "cancelled",
        declineReason: reason,
        cancelledAt: Date.now(),
      });
  
      await ctx.scheduler.runAfter(0, "bookings:sendStatusEmailToCustomer", {
        bookingId,
        newStatus: "cancelled",
      });
    },
  });

  export const completeBooking = mutation({
    args: { bookingId: v.id("bookings") },
    handler: async (ctx, { bookingId }) => {
      const booking = await ctx.db.get(bookingId);
      if (!booking) throw new ConvexError("ჯავშანი ვერ მოიძებნა");
      await requireFuneralHomeOwner(ctx, booking.funeralHomeId);
  
      if (booking.status !== "confirmed") {
        throw new ConvexError("მხოლოდ დადასტურებული ჯავშნის დასრულებაა შესაძლებელი");
      }
  
      await ctx.db.patch(bookingId, {
        status: "completed",
        completedAt: Date.now(),
      });
    },
  });

  export const getFuneralHomeBookings = query({
    args: {
      funeralHomeId: v.id("funeralHomes"),
      status: v.optional(
        v.union(
          v.literal("pending"),
          v.literal("confirmed"),
          v.literal("completed"),
          v.literal("cancelled")
        )
      ),
    },
    handler: async (ctx, { funeralHomeId, status }) => {
      await requireFuneralHomeOwner(ctx, funeralHomeId);
  
      const q = status
        ? ctx.db
            .query("bookings")
            .withIndex("by_funeralHome_status", (q) =>
              q.eq("funeralHomeId", funeralHomeId).eq("status", status)
            )
        : ctx.db
            .query("bookings")
            .withIndex("by_funeralHome", (q) => q.eq("funeralHomeId", funeralHomeId));
  
      const bookings = await q.order("desc").collect();
      return bookings;
    },
  });
  

  export const getRevenueStats = query({
    args: { funeralHomeId: v.id("funeralHomes") },
    handler: async (ctx, { funeralHomeId }) => {
      await requireFuneralHomeOwner(ctx, funeralHomeId);
  
      const bookings = await ctx.db
        .query("bookings")
        .withIndex("by_funeralHome", (q) => q.eq("funeralHomeId", funeralHomeId))
        .collect();
  
      const realized = bookings.filter(
        (b) => b.status === "confirmed" || b.status === "completed"
      );
      const pending = bookings.filter((b) => b.status === "pending");
  
      const totalRevenue = realized.reduce((s, b) => s + (b.servicePrice || 0), 0);
      const pendingRevenue = pending.reduce((s, b) => s + (b.servicePrice || 0), 0);
      const onlineCount = bookings.filter((b) => b.paymentMethod === "online").length;
      const avgBooking = bookings.length
        ? Math.round(
            bookings.reduce((s, b) => s + (b.servicePrice || 0), 0) / bookings.length
          )
        : 0;
  
      
      const byService = {};
      for (const b of realized) {
        byService[b.serviceName] = (byService[b.serviceName] || 0) + (b.servicePrice || 0);
      }
  
    
      const byMonth = {};
      for (const b of realized) {
        const d = new Date(b.confirmedAt || b._creationTime);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        byMonth[key] = (byMonth[key] || 0) + (b.servicePrice || 0);
      }
  
      return {
        totalRevenue,
        pendingRevenue,
        avgBooking,
        onlineCount,
        totalBookings: bookings.length,
        byService,
        byMonth,
      };
    },
  });