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
        musicTrack: v.string(),
        gravestoneModel: v.string(),
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
            musicTrack: args.musicTrack,
            gravestoneModel: args.gravestoneModel,
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
})