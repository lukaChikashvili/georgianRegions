import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkIsPremium } from "./pricing";
import { getMemorialAccess } from "./permissions";

export const createMemorial = mutation({
    
    args: {
        firstName: v.string(),
        lastName: v.string(),
        birthDate: v.string(),
        deathDate: v.string(),
        location: v.string(),
        mainPortraitUrl: v.optional(v.id("_storage")),
        epitaph: v.string(),
        biography: v.string(),

        galleryUrls: v.optional(v.array(v.id("_storage"))),
        favoriteSongUrl: v.optional(v.string()),

       

        enableDonations: v.boolean(),
        bankName: v.optional(v.string()),
        bankAccountIban: v.optional(v.string()),
        
        funeralLocation: v.optional(v.string()),
        funeralTime: v.optional(v.string()),
        cemeteryLocation: v.optional(v.string()),

        

        enableCandle: v.boolean(),
        urlSlug: v.string(),
        privacyType: v.string(),
        requireModeration: v.boolean(),
        creatorId: v.string(),
        creatorName: v.string(),
      },

      handler: async(ctx, args) => {

        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
          throw new Error("თქვენ არ ხართ ავტორიზებული.");
        }

        const premium = await checkIsPremium(ctx, identity.subject);

        if (!premium) {
          const existingMemorials = await ctx.db
            .query("memorials")
            .withIndex("by_creatorId", (q) => q.eq("creatorId", args.creatorId))
            .collect();
     
          if (existingMemorials.length >= 1) {
            throw new Error(
              "უფასო პაკეტში მხოლოდ 1 მემორიალის შექმნაა შესაძლებელი. განაახლეთ პაკეტი."
            );
          }
        }

        if (!premium && args.galleryUrls && args.galleryUrls.length > 3) {
          throw new Error(
            "უფასო პაკეტში მაქსიმუმ 3 ფოტოა დაშვებული. განაახლეთ პაკეტი."
          );
        }

        if (!premium && args.biography && args.biography.length > 1000) {
          throw new Error(
            "უფასო პაკეტში ბიოგრაფია მაქსიმუმ 1000 სიმბოლოა. განაახლეთ პაკეტი."
          );
        }

        if (!premium && args.favoriteSongUrl) {
          throw new Error(
            "მუსიკის დამატება მხოლოდ პრემიუმ პაკეტშია ხელმისაწვდომი."
          );
        }


    
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

            galleryUrls: args.galleryUrls ?? [],

            enableDonations: args.enableDonations,
            bankName: args.bankName,
            bankAccountIban: args.bankAccountIban,

            favoriteSongUrl: args.favoriteSongUrl,

           
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
  handler: async (ctx, args) => {
  
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("სანთლის ასანთებად გთხოვთ გაიაროთ ავტორიზაცია.");
    }

    const identifier = identity.subject;
    
    const existing = await ctx.db
      .query("candleLights")
      .withIndex("by_memorial_and_identifier", q =>
        q.eq("memorialId", args.id).eq("identifier", identifier)
      )
      .first();

    if (existing) {
      throw new Error("თქვენ უკვე აანთეთ სანთელი ამ მემორიალზე.");
    }

    const memorial = await ctx.db.get(args.id);
    if (!memorial) throw new Error("მემორიალი ვერ მოიძებნა.");

    
    await ctx.db.insert("candleLights", {
      memorialId: args.id,
      identifier,
    });

   
    await ctx.db.patch(args.id, {
      candleCount: (memorial.candleCount || 0) + 1,
    });

  
    await ctx.db.insert("notifications", {
      userId: memorial.creatorId,
      memorialId: args.id,
      message: `თქვენს მემორიალზე აინთო სანთელი`,
      type: "CANDLE",
      isRead: false,
      createdAt: Date.now(),
    });

    return true;
  }
});

export const hasUserLitCandle = query({
  args: { id: v.id("memorials") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const existing = await ctx.db
      .query("candleLights")
      .withIndex("by_memorial_and_identifier", q =>
        q.eq("memorialId", args.id).eq("identifier", identity.subject)
      )
      .first();

    return !!existing;
  }
});

export const getMyMemorials = query({
  args: { creatorId: v.string() },
  handler: async (ctx, { creatorId }) => {
    const owned = await ctx.db
      .query("memorials")
      .withIndex("by_creatorId", (q) => q.eq("creatorId", creatorId))
      .collect();

    const memberships = await ctx.db
      .query("familyGroupMembers")
      .withIndex("by_user", (q) => q.eq("userId", creatorId))
      .collect();

    const sharedMemorials = [];
    for (const m of memberships) {
      const groupMemorials = await ctx.db
        .query("memorials")
        .withIndex("by_groupId", (q) => q.eq("groupId", m.groupId))
        .collect();
      for (const mem of groupMemorials) {
        if (mem.creatorId !== creatorId) {
          sharedMemorials.push({ ...mem, sharedByGroup: true });
        }
      }
    }

    return [...owned, ...sharedMemorials];
  },
});

export const deleteMemorial = mutation({
  args: { id: v.id("memorials") },
  handler: async (ctx, args) => {
    const memorial = await ctx.db.get(args.id);
    if (!memorial) throw new Error("მემორიალი ვერ მოიძებნა.");

   
    const [timelineEntries, toasts, invitations, condolences, notifications, reports] = await Promise.all([
      ctx.db.query("timelineEntries").withIndex("by_memorial", (q) => q.eq("memorialId", args.id)).collect(),
      ctx.db.query("toasts").withIndex("by_memorialId", (q) => q.eq("memorialId", args.id)).collect(),
      ctx.db.query("invitations").withIndex("by_memorialId", (q) => q.eq("memorialId", args.id)).collect(),
      ctx.db.query("condolences").withIndex("by_memorialId", (q) => q.eq("memorialId", args.id)).collect(),
      ctx.db.query("notifications").withIndex("by_userId", (q) => q.eq("userId", args.id)).collect(),
      ctx.db.query("reports").withIndex("by_memorialId", (q) => q.eq("memorialId", args.id)).collect(),
    ]);

   
    const storageDeletions = [
      ...(memorial.mainPortraitUrl ? [ctx.storage.delete(memorial.mainPortraitUrl)] : []),
      ...(memorial.galleryUrls?.map((id) => ctx.storage.delete(id)) || []),
      ...toasts.map((t) => ctx.storage.delete(t.audioUrl)), 
      ...invitations.map((i) => ctx.storage.delete(i.storageId)), 
    ];

    
    const dbDeletions = [
      ...timelineEntries.map((e) => ctx.db.delete(e._id)),
      ...toasts.map((t) => ctx.db.delete(t._id)),
      ...invitations.map((i) => ctx.db.delete(i._id)),
      ...condolences.map((c) => ctx.db.delete(c._id)),
      ...notifications.map((n) => ctx.db.delete(n._id)),
      ...reports.map((r) => ctx.db.delete(r._id)),
      ctx.db.delete(args.id),
    ];

    await Promise.all([...storageDeletions, ...dbDeletions]);
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
    mainPortraitUrl: v.optional(v.id("_storage")),
    galleryUrls: v.optional(v.array(v.id("_storage"))),
    privacyType: v.string(),
  },
  handler: async (ctx, args) => {


    const { id, ...updateData } = args;
    const memorial = await ctx.db.get(id);
    if (!memorial) {
      throw new Error("მემორიალი ვერ მოიძებნა.");
    }


    const premium = await checkIsPremium(ctx, memorial.creatorId);

    if (!premium && updateData.biography && updateData.biography.length > 1000) {
      throw new Error(
        "უფასო პაკეტში ბიოგრაფია მაქსიმუმ 1000 სიმბოლოა. განაახლეთ პაკეტი."
      );
    }

    if (!premium && updateData.galleryUrls && updateData.galleryUrls.length > 3) {
      throw new Error(
        "უფასო პაკეტში მაქსიმუმ 3 ფოტოა დაშვებული. განაახლეთ პაკეტი."
      );
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
    city: v.string(),          
    stoneType: v.string(),
    fenceStyle: v.string(),
    floorStyle: v.string(),
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

    const isPremium = await checkIsPremium(ctx, userId);
    if (!isPremium) throw new Error("3D მონუმენტის შექმნა მხოლოდ პრემიუმ პაკეტშია ხელმისაწვდომი.");

    const existingDesign = await ctx.db
      .query("graveDesigns")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

   
    if (!existingDesign) {
      const city = await ctx.db
        .query("cities")
        .withIndex("by_name", (q) => q.eq("name", args.city))
        .unique();

      if (!city) {
        await ctx.db.insert("cities", {
          name: args.city,
          plotCount: 1,
          maxPlots: 50,
        });
      } else {
        if (city.plotCount >= city.maxPlots) {
          throw new Error(`${args.city}-ის სასაფლაო სავსეა! მაქსიმუმ ${city.maxPlots} ადგილი.`);
        }
        await ctx.db.patch(city._id, { plotCount: city.plotCount + 1 });
      }
    } else if (existingDesign.city !== args.city) {
      
      const oldCity = await ctx.db
        .query("cities")
        .withIndex("by_name", (q) => q.eq("name", existingDesign.city))
        .unique();
      if (oldCity && oldCity.plotCount > 0) {
        await ctx.db.patch(oldCity._id, { plotCount: oldCity.plotCount - 1 });
      }

      const newCity = await ctx.db
        .query("cities")
        .withIndex("by_name", (q) => q.eq("name", args.city))
        .unique();
      if (!newCity) {
        await ctx.db.insert("cities", { name: args.city, plotCount: 1, maxPlots: 50 });
      } else {
        if (newCity.plotCount >= newCity.maxPlots) {
          throw new Error(`${args.city}-ის სასაფლაო სავსეა!`);
        }
        await ctx.db.patch(newCity._id, { plotCount: newCity.plotCount + 1 });
      }
    }

    const designData = {
      city: args.city,
      stoneType: args.stoneType,
      fenceStyle: args.fenceStyle,
      floorStyle: args.floorStyle,
      flowers: args.flowers,
      winePoured: args.winePoured,
      fullName: args.fullName,
      birthYear: args.birthYear,
      deathYear: args.deathYear,
      portraitImg: args.portraitImg,
      voiceToast: args.voiceToast,
    };

    if (existingDesign) {
      await ctx.db.patch(existingDesign._id, designData);
      return existingDesign._id;
    } else {
      return await ctx.db.insert("graveDesigns", { userId, ...designData });
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

    if (existingDesign.city) {
      const city = await ctx.db
        .query("cities")
        .withIndex("by_name", (q) => q.eq("name", existingDesign.city))
        .unique();
      if (city && city.plotCount > 0) {
        await ctx.db.patch(city._id, { plotCount: city.plotCount - 1 });
      }
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
});


export const getCityGraves = query({
  args: { city: v.string() },
  handler: async (ctx, { city }) => {
    return ctx.db
      .query("graveDesigns")
      .withIndex("by_city", (q) => q.eq("city", city))
      .collect();
  },
});

export const getAllCities = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("cities").collect();
  },
});


export const setMemorialGroup = mutation({
  args: { id: v.id("memorials"), groupId: v.optional(v.id("familyGroups")) },
  handler: async (ctx, { id, groupId }) => {
    const memorial = await ctx.db.get(id);
    if (!memorial) throw new Error("მემორიალი ვერ მოიძებნა");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity || memorial.creatorId !== identity.subject) {
      throw new Error("არ გაქვთ უფლება");
    }

    await ctx.db.patch(id, { groupId });
  },
});

export const addGalleryPhotos = mutation({
  args: { memorialId: v.id("memorials"), newStorageIds: v.array(v.id("_storage")) },
  handler: async (ctx, { memorialId, newStorageIds }) => {
    const memorial = await ctx.db.get(memorialId);
    if (!memorial) throw new Error("მემორიალი ვერ მოიძებნა");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("ავტორიზაცია საჭიროა");

    const access = await getMemorialAccess(ctx, identity.subject, memorial);
    if (!access.canContribute) throw new Error("არ გაქვთ ფოტოების დამატების უფლება");

    const merged = [...(memorial.galleryUrls ?? []), ...newStorageIds];
    await ctx.db.patch(memorialId, { galleryUrls: merged });
  },
});


export const getMyAccessToMemorial = query({
  args: { memorialId: v.id("memorials") },
  handler: async (ctx, { memorialId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { canContribute: false, isCreator: false };

    const memorial = await ctx.db.get(memorialId);
    if (!memorial) return { canContribute: false, isCreator: false };

    const access = await getMemorialAccess(ctx, identity.subject, memorial);
    return { canContribute: access.canContribute, isCreator: access.isCreator };
  },
});


export const addBiographyContribution = mutation({
  args: {
    memorialId: v.id("memorials"),
    text: v.string(),
    authorName: v.string(),
  },
  handler: async (ctx, { memorialId, text, authorName }) => {
    const memorial = await ctx.db.get(memorialId);
    if (!memorial) throw new Error("მემორიალი ვერ მოიძებნა");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("ავტორიზაცია საჭიროა");

    const access = await getMemorialAccess(ctx, identity.subject, memorial);
    if (!access.canContribute) throw new Error("არ გაქვთ დამატების უფლება");

    const trimmed = text.trim();
    if (!trimmed) throw new Error("ტექსტი არ შეიძლება იყოს ცარიელი");

    const addition = `\n\n— ${authorName}-ის მოგონება:\n${trimmed}`;
    const updatedBiography = (memorial.biography || "") + addition;

    await ctx.db.patch(memorialId, { biography: updatedBiography });
  },
});