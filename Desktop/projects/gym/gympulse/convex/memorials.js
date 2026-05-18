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

        enableDonations: v.boolean(),
        bankName: v.optional(v.string()),
        bankAccountIban: v.optional(v.string()),
        
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

            enableDonations: args.enableDonations,
            bankName: args.bankName,
            bankAccountIban: args.bankAccountIban,
           
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

export const addCondolence = mutation({
  args: {
    memorialId: v.id("memorials"),
    body: v.string(),
    authorName: v.string(),
    authorId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const memorial = await ctx.db.get(args.memorialId);
    if (!memorial) {
      throw new Error("მემორიალი ვერ მოიძებნა.");
    }

  
    const shouldApproveImmediately = !memorial.requireModeration;

    await ctx.db.insert("condolences", {
      memorialId: args.memorialId,
      body: args.body,
      authorName: args.authorName,
      authorId: args.authorId,
      isApproved: shouldApproveImmediately,
      createdAt: Date.now(),
    });

    return shouldApproveImmediately; 
  },
});

export const getCondolences = query({
  args: { memorialId: v.id("memorials") },
  handler: async (ctx, args) => {
    const memorial = await ctx.db.get(args.memorialId);
    if (!memorial) return [];

    return await ctx.db
      .query("condolences")
      .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
      .order("desc") 
      .collect();
    
    
  },
});


export const deleteCondolence = mutation({
  args: { 
    id: v.id("condolences"),
    userId: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    const condolence = await ctx.db.get(args.id);
    if (!condolence) {
      throw new Error("სამძიმრის შეტყობინება ვერ მოიძებნა.");
    }

    const memorial = await ctx.db.get(condolence.memorialId);

    
    const isAuthor = args.userId && condolence.authorId === args.userId;
    const isMemorialCreator = args.userId && memorial?.creatorId === args.userId;

    if (!isAuthor && !isMemorialCreator) {
      throw new Error("თქვენ არ გაქვთ ამ შეტყობინების წაშლის უფლება.");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});


export const editCondolence = mutation({
  args: {
    id: v.id("condolences"),
    newBody: v.string(),
    userId: v.string() 
  },
  handler: async (ctx, args) => {
    const condolence = await ctx.db.get(args.id);
    if (!condolence) {
      throw new Error("სამძიმრის შეტყობინება ვერ მოიძებნა.");
    }

    
    if (condolence.authorId !== args.userId) {
      throw new Error("თქვენ არ გაქვთ ამ შეტყობინების რედაქტირების უფლება.");
    }

    const memorial = await ctx.db.get(condolence.memorialId);
    
    
    const shouldReapprove = !memorial?.requireModeration;

    await ctx.db.patch(args.id, {
      body: args.newBody,
      isApproved: shouldReapprove, 
    });

    return shouldReapprove; 
  },
});