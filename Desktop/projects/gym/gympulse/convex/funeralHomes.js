import { mutation } from "./_generated/server";


export const createFuneralHome = mutation({
    args: {
      name: v.string(),
      description: v.string(),
      city: v.string(),
      address: v.string(),
      phone: v.string(),
      email: v.string(),
      website: v.optional(v.string()),
      logoId: v.optional(v.id("_storage")),
      coverImageId: v.optional(v.id("_storage")),
      galleryIds: v.optional(v.array(v.id("_storage"))),
      services: v.array(v.object({
        name: v.string(),
        description: v.string(),
        price: v.optional(v.number()),
      })),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");
   
  
      const existing = await ctx.db
        .query("funeralHomes")
        .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
        .first();
      if (existing) throw new Error("You already have a registered funeral home");
   
      const id = await ctx.db.insert("funeralHomes", {
        clerkUserId: identity.subject,
        name: args.name,
        description: args.description,
        city: args.city,
        address: args.address,
        phone: args.phone,
        email: args.email,
        website: args.website,
        logoId: args.logoId,
        coverImageId: args.coverImageId,
        galleryIds: args.galleryIds,
        services: args.services,
        status: "pending",
        subscriptionStatus: "trial",
        subscriptionExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, 
        totalBookings: 0,
        rating: undefined,
      });
   
      return id;
    },
  });