import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createMemorial = mutation({
    
    args: {
        firstName: v.string(),
        lastName: v.string(),
        birthDate: v.string(),
        deathDate: v.string(),
        location: v.string(),
        mainPortraitUrl: v.optional(v.string()),
        epitaph: v.string(),
        biography: v.string(),

        galleryUrls: v.optional(v.array(v.string())),
        
        funeralLocation: v.string(),
        funeralTime: v.string(),
        cemeteryLocation: v.optional(v.string()),

        enableCandle: v.boolean(),
        urlSlug: v.string(),
        privacyType: v.string(),
        requireModeration: v.boolean(),
        creatorId: v.string(),
        creatorName: v.string(),
      },

      handler: async(ctx, args) => {
    
        const existingMemorial = await ctx.db
      .query("memorials")
      .withIndex("by_urlSlug", (q) => q.eq("urlSlug", args.urlSlug))
      .unique();

        if (existingMemorial) {
           throw new Error("ეს ბმული უკვე დაკავებულია, გთხოვთ აირჩიოთ სხვა.");
        }

        const memorialId = await ctx.db.insert("memorials", {
            firstName: args.firstName,
            lastName: args.lastName,
            birthDate: args.birthDate,
            deathDate: args.deathDate,
            location: args.location,
            mainPortraitUrl: args.mainPortraitUrl,
            epitaph: args.epitaph,
            biography: args.biography,
            funeralLocation: args.funeralLocation,
            funeralTime: args.funeralTime,
            cemeteryLocation: args.cemeteryLocation,

            galleryUrls: args.galleryUrls || [],
           
            enableCandle: args.enableCandle,
            urlSlug: args.urlSlug,
            privacyType: args.privacyType,
            requireModeration: args.requireModeration,
            creatorId: args.creatorId,
            creatorName: args.creatorName,
            candleCount: 0, 
          });

          return memorialId;
      }
});


export const getAllPublicMemorials = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("memorials")
      .filter((q) => q.eq(q.field("privacyType"), "public"))
      .order("desc") 
      .collect();
  },
});

export const getMemorialBySlug = query({
  args: { urlSlug: v.string() },
  handler: async (ctx, args) => {

    return await ctx.db
      .query("memorials")
      .withIndex("by_urlSlug", (q) => q.eq("urlSlug", args.urlSlug))
      .unique();
  },
});


export const lightCandle = mutation({
  args: { id: v.id("memorials") },
  handler: async(ctx, args) => {
    const memorial = await ctx.db.get(args.id);

    if (!memorial) {
      throw new Error("მემორიალი ვერ მოიძებნა.");
    }

    await ctx.db.patch(args.id, {
      candleCount: (memorial.candleCount || 0) + 1,
    });

    return true;
  }
});

export const getMyMemorials = query({
  args: { creatorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memorials")
      .withIndex("by_creatorId", (q) => q.eq("creatorId", args.creatorId))
      .order("desc")
      .collect();
  },
});

export const deleteMemorial = mutation({
  args: { id: v.id("memorials") },
  handler: async (ctx, args) => {
    const memorial = await ctx.db.get(args.id);
    if (!memorial) {
      throw new Error("მემორიალი ვერ მოიძებნა.");
    }
    await ctx.db.delete(args.id);
    return true;
  },
});

export const updateMemorial = mutation({
  args: {
    id: v.id("memorials"),
    firstName: v.string(),
    lastName: v.string(),
    epitaph: v.string(),
    biography: v.string(),
    location: v.string(),
    mainPortraitUrl: v.optional(v.string()),
    privacyType: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    const memorial = await ctx.db.get(id);
    if (!memorial) {
      throw new Error("მემორიალი ვერ მოიძებნა.");
    }
    await ctx.db.patch(id, updateData);
    return true;
  },
});



export const attendFuneral = mutation({
  args: { 
    id: v.id("memorials"),
    name: v.string() 
  },
  handler: async (ctx, args) => {
    const memorial = await ctx.db.get(args.id);

    if (!memorial) {
      throw new Error("მემორიალი ვერ მოიძებნა.");
    }

    
    const currentAttendees = memorial.attendeesList || [];

   
    const updatedAttendees = [
      ...currentAttendees,
      { name: args.name, timestamp: Date.now() }
    ];

    await ctx.db.patch(args.id, {
      attendeesList: updatedAttendees,
      attendeesCount: updatedAttendees.length, 
    });

    return true;
  },
});