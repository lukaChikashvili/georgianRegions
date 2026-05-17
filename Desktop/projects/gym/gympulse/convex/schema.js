import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";



export default defineSchema({
    posts: defineTable({
        title: v.string(),
        body: v.string(),
        category: v.string(),
        authorName: v.optional(v.string()), 
        authorId: v.string(),
    }),

    comments: defineTable({
         postId: v.id("posts"),
         body: v.string(),
         authorId: v.string(),
         authorName: v.string(),
    }),


    memorials: defineTable({
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
        candleCount: v.number(),

        urlSlug: v.string(),
        privacyType: v.string(),      
        requireModeration: v.boolean(),

        creatorId: v.string(),       
        creatorName: v.string(),
    }).index("by_urlSlug", ["urlSlug"]) 
    .index("by_creatorId", ["creatorId"]),
});