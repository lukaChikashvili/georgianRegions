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

    await ctx.db.insert("notifications", {
      userId: memorial.creatorId,
      memorialId: args.id, 
      message: `${args.name}-მ აანთო სანთელი თქვენს მემორიალზე`,
      type: "CANDLE",
      isRead: false,
      createdAt: Date.now(),
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
  args: { id: v.id("memorials"), name: v.string() },
  handler: async (ctx, args) => {
    const memorial = await ctx.db.get(args.id);
    if (!memorial) throw new Error("მემორიალი ვერ მოიძებნა.");

    const updatedAttendees = [
      ...(memorial.attendeesList || []),
      { name: args.name, timestamp: Date.now() }
    ];

    await ctx.db.patch(args.id, {
      attendeesList: updatedAttendees,
      attendeesCount: updatedAttendees.length, 
    });

    
    await ctx.db.insert("notifications", {
      userId: memorial.creatorId,
      memorialId: args.id,
      message: `${args.name} დაესწრება დაკრძალვას`,
      type: "ATTENDANCE",
      isRead: false,
      createdAt: Date.now(),
    });

    return true;
  },
});

export const getMyNotifications = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    await ctx.db.patch(args.id, { isRead: true });
  },
});



export const addCondolence = mutation({
  args: {
    memorialId: v.id("memorials"),
    body: v.string(),
    authorName: v.string(),
    authorId: v.optional(v.string()),
    parentId: v.optional(v.id("condolences")),
  },
  handler: async (ctx, args) => {
    const memorial = await ctx.db.get(args.memorialId);
    if (!memorial) {
      throw new Error("მემორიალი ვერ მოიძებნა.");
    }

    const isOwnerReplying = args.authorId && memorial.creatorId === args.authorId;
    const shouldApproveImmediately = !memorial.requireModeration || isOwnerReplying;


    const newCondolenceId = await ctx.db.insert("condolences", {
      memorialId: args.memorialId,
      body: args.body,
      authorName: args.authorName,
      authorId: args.authorId,
      isApproved: shouldApproveImmediately,
      createdAt: Date.now(),
      parentId: args.parentId,
    });

    if (args.parentId) {
      const parentCondolence = await ctx.db.get(args.parentId);
      
    
      if (parentCondolence && parentCondolence.authorId && parentCondolence.authorId !== args.authorId) {
        await ctx.db.insert("notifications", {
          userId: parentCondolence.authorId,
          memorialId: args.memorialId,
          message: `${args.authorName}-მ გიპასუხათ სამძიმარზე`,
          type: "REPLY", 
          isRead: false,
          createdAt: Date.now(),
        });
      }
    } else if (memorial.creatorId !== args.authorId) {
      
      await ctx.db.insert("notifications", {
        userId: memorial.creatorId,
        memorialId: args.memorialId,
        message: `${args.authorName}-მ დატოვა სამძიმარი თქვენს მემორიალზე`,
        type: "CONDOLENCE",
        isRead: false,
        createdAt: Date.now(),
      });
    }

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



export const getMyGraveDesign = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("graveDesigns")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const saveMyGraveDesign = mutation({
 
  args: {
    stoneType: v.string(),
    fenceStyle: v.string(),
    flowers: v.string(),
    winePoured: v.boolean(),
    fullName: v.string(),
    birthYear: v.string(),
    deathYear: v.string(),
    portraitImg: v.union(v.string(), v.null()),
    voiceToast: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("მოითხოვება ავტორიზაცია!");

    const userId = identity.subject;

    const existingDesign = await ctx.db
      .query("graveDesigns")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existingDesign) {
      
      await ctx.db.patch(existingDesign._id, {
        stoneType: args.stoneType,
        fenceStyle: args.fenceStyle,
        flowers: args.flowers,
        winePoured: args.winePoured,
        fullName: args.fullName,
        birthYear: args.birthYear,
        deathYear: args.deathYear,
        portraitImg: args.portraitImg,
        voiceToast: args.voiceToast,
      });
      return existingDesign._id;
    } else {
     
      return await ctx.db.insert("graveDesigns", {
        userId,
        stoneType: args.stoneType,
        fenceStyle: args.fenceStyle,
        flowers: args.flowers,
        winePoured: args.winePoured,
        fullName: args.fullName,
        birthYear: args.birthYear,
        deathYear: args.deathYear,
        portraitImg: args.portraitImg,
        voiceToast: args.voiceToast,
      });
    }
  },
});


export const getAllGraveDesigns = query({
  args: {},
  handler: async (ctx) => {
   
    return await ctx.db.query("graveDesigns").collect();
  },
});


export const deleteMyGraveDesign = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("მოითხოვება ავტორიზაცია!");

    const userId = identity.subject;

    
    const existingDesign = await ctx.db
      .query("graveDesigns")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!existingDesign) {
      throw new Error("მონუმენტის დიზაინი ვერ მოიძებნა.");
    }

    
    await ctx.db.delete(existingDesign._id);
    return true;
  },
});


export const incrementVisits = mutation({
  args: { memorialId: v.id("memorials")},
  handler: async (ctx, args) => {
    const memorial = await ctx.db.get(args.memorialId);
    if (!memorial) return;

    await ctx.db.patch(args.memorialId, {
      visits: (memorial.visits || 0) + 1,
    });
  }
})