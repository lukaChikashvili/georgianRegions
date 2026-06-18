import { mutation, query } from "./_generated/server";


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


  export const updateFuneralHome = mutation({
    args: {
      id: v.id("funeralHomes"),
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      city: v.optional(v.string()),
      address: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      website: v.optional(v.string()),
      logoId: v.optional(v.id("_storage")),
      coverImageId: v.optional(v.id("_storage")),
      galleryIds: v.optional(v.array(v.id("_storage"))),
      services: v.optional(v.array(v.object({
        name: v.string(),
        description: v.string(),
        price: v.optional(v.number()),
      }))),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");
   
      const funeralHome = await ctx.db.get(args.id);
      if (!funeralHome) throw new Error("Funeral home not found");
      if (funeralHome.clerkUserId !== identity.subject) throw new Error("Unauthorized");
   
      const { id, ...updates } = args;
     
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );
   
      await ctx.db.patch(args.id, cleanUpdates);
    },
  });


  export const approveFuneralHome = mutation({
    args: {
      id: v.id("funeralHomes"),
      adminClerkUserId: v.string(), 
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");
   
      
      const ADMIN_IDS = [args.adminClerkUserId];
      if (!ADMIN_IDS.includes(identity.subject)) throw new Error("Unauthorized");
   
      await ctx.db.patch(args.id, { status: "active" });
    },
  });
   
  export const suspendFuneralHome = mutation({
    args: { id: v.id("funeralHomes") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");
   
      await ctx.db.patch(args.id, { status: "suspended" });
    },
  });
   
  
   
  export const getMyFuneralHome = query({
    args: {},
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return null;
   
      const funeralHome = await ctx.db
        .query("funeralHomes")
        .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject))
        .first();
   
      if (!funeralHome) return null;
   
 
      const logoUrl = funeralHome.logoId
        ? await ctx.storage.getUrl(funeralHome.logoId)
        : null;
      const coverUrl = funeralHome.coverImageId
        ? await ctx.storage.getUrl(funeralHome.coverImageId)
        : null;
      const galleryUrls = funeralHome.galleryIds
        ? await Promise.all(funeralHome.galleryIds.map((id) => ctx.storage.getUrl(id)))
        : [];
   
      return { ...funeralHome, logoUrl, coverUrl, galleryUrls };
    },
  });
   
  export const getFuneralHomeById = query({
    args: { id: v.id("funeralHomes") },
    handler: async (ctx, args) => {
      const funeralHome = await ctx.db.get(args.id);
      if (!funeralHome || funeralHome.status !== "active") return null;
   
      const logoUrl = funeralHome.logoId
        ? await ctx.storage.getUrl(funeralHome.logoId)
        : null;
      const coverUrl = funeralHome.coverImageId
        ? await ctx.storage.getUrl(funeralHome.coverImageId)
        : null;
      const galleryUrls = funeralHome.galleryIds
        ? await Promise.all(funeralHome.galleryIds.map((id) => ctx.storage.getUrl(id)))
        : [];
   
      return { ...funeralHome, logoUrl, coverUrl, galleryUrls };
    },
  });
   
  export const listFuneralHomes = query({
    args: {
      city: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      let funeralHomesQuery = ctx.db
        .query("funeralHomes")
        .withIndex("by_status", (q) => q.eq("status", "active"));
   
      const funeralHomes = await funeralHomesQuery.collect();
   
     
      const filtered = args.city
        ? funeralHomes.filter((fh) => fh.city === args.city)
        : funeralHomes;
   
      
      const withUrls = await Promise.all(
        filtered.map(async (fh) => ({
          ...fh,
          logoUrl: fh.logoId ? await ctx.storage.getUrl(fh.logoId) : null,
          coverUrl: fh.coverImageId ? await ctx.storage.getUrl(fh.coverImageId) : null,
        }))
      );
   
      return withUrls;
    },
  });
   

  export const listPendingFuneralHomes = query({
    args: {},
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return [];
   
      return await ctx.db
        .query("funeralHomes")
        .withIndex("by_status", (q) => q.eq("status", "pending"))
        .collect();
    },
  });
   