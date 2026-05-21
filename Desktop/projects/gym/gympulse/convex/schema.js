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
        galleryUrls: v.optional(v.array(v.string())),

        epitaph: v.string(),
        biography: v.string(),

        enableDonations: v.boolean(),
        bankName: v.optional(v.string()),       
        bankAccountIban: v.optional(v.string()),

        
        funeralLocation: v.string(),
        funeralTime: v.string(),
        cemeteryLocation: v.optional(v.string()),
        attendeesCount: v.optional(v.number()),
        attendeesList: v.optional(
            v.array(
              v.object({
                name: v.string(),
                timestamp: v.number(),
              })
            )
          ),
      
        enableCandle: v.boolean(),    
        candleCount: v.number(),

        urlSlug: v.string(),
        privacyType: v.string(),      
        requireModeration: v.boolean(),

        creatorId: v.string(),       
        creatorName: v.string(),
    }).index("by_urlSlug", ["urlSlug"]) 
    .index("by_creatorId", ["creatorId"]),

    graveDesigns: defineTable({
      userId: v.string(), 
      stoneType: v.string(),      
      fenceStyle: v.string(),      
      flowers: v.string(),         
      winePoured: v.boolean(),     
      fullName: v.string(),
      birthYear: v.string(),
      deathYear: v.string(),
      portraitImg: v.union(v.string(), v.null()),
      voiceToast: v.union(v.string(), v.null()),
  
    }).index("by_userId", ["userId"]),

  condolences: defineTable({
    memorialId: v.id("memorials"),
    body: v.string(),            
    authorName: v.string(),       
    authorId: v.optional(v.string()), 
    isApproved: v.boolean(),       
    createdAt: v.number(),

    parentId: v.optional(v.id("condolences")),
    
  }).index("by_memorialId", ["memorialId"]),


  notifications: defineTable({
    userId: v.string(),
    memorialId: v.id("memorials"),
    message: v.string(),
    type: v.string(), 
    isRead: v.boolean(),
    createdAt: v.number(),
}).index("by_userId", ["userId"]),

});