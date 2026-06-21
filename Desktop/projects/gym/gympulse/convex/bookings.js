import { ConvexError } from "convex/values";
import { mutation } from "./_generated/server";


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