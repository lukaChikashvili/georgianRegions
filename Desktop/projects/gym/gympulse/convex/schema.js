import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";



export default defineSchema({

  

    posts: defineTable({
        title: v.string(),
        body: v.string(),
        category: v.string(),
        authorName: v.optional(v.string()), 
        authorId: v.string(),
        imageId: v.optional(v.id("_storage")),
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
        mainPortraitUrl: v.optional(v.id("_storage")),
        galleryUrls: v.optional(v.array(v.id("_storage"))),

        groupId: v.optional(v.id("familyGroups")),

        epitaph: v.string(),
        biography: v.string(),

        enableDonations: v.boolean(),
        bankName: v.optional(v.string()),       
        bankAccountIban: v.optional(v.string()),

        favoriteSongUrl: v.optional(v.string()),

        visits: v.optional(v.float64()),

        isFlagged: v.optional(v.boolean()),

        
        funeralLocation: v.optional(v.string()),
        funeralTime: v.optional(v.string()),
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
    .index("by_creatorId", ["creatorId"])
    .index("by_groupId", ["groupId"]),

    graveDesigns: defineTable({
      userId: v.string(), 
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
      city: v.optional(v.string()),
  
    }).index("by_userId", ["userId"])
    .index("by_city", ["city"]),

    cities: defineTable({
      name: v.string(),
      plotCount: v.number(),
      maxPlots: v.number(),
    })
      .index("by_name", ["name"]), 


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
    type: v.union(v.literal("CANDLE"), v.literal("ATTENDANCE"), v.literal("CONDOLENCE"), v.literal("REPLY"), v.literal("REPORT"),),
    isRead: v.boolean(),
    createdAt: v.number(),
}).index("by_userId", ["userId"]),


toasts: defineTable({
  memorialId: v.id("memorials"),
  audioUrl: v.string(),
  authorName: v.string(),
  createdAt: v.number(),
  authorId: v.optional(v.string()),
  privacy: v.string(),
  isApproved: v.boolean(), 
}).index("by_memorialId", ["memorialId"]),


invitations: defineTable({
  memorialId: v.id("memorials"),
  storageId: v.id("_storage"),
  isPublished: v.boolean(),
  createdAt: v.number(),
}).index("by_memorialId", ["memorialId"]),



subscriptions: defineTable({
  userId: v.string(),
  plan: v.union(v.literal("free"), v.literal("lifetime")),
  status: v.union(v.literal("active"), v.literal("inactive")),
  bogOrderId: v.string(),
  amount: v.number(),
  currency: v.string(),
  createdAt: v.number(),
  expiresAt: v.null(), 
}).index("by_userId", ["userId"])
  .index("by_bogOrderId", ["bogOrderId"]),

  reports: defineTable({
    memorialId: v.id("memorials"),
    reporterId: v.optional(v.string()),     
    reporterName: v.optional(v.string()),
    reason: v.string(),                       
    details: v.optional(v.string()),         
    status: v.union(
      v.literal("pending"),                  
      v.literal("reviewed"),                 
      v.literal("dismissed"),                
      v.literal("actioned")                   
    ),
    createdAt: v.number(),
  })
    .index("by_memorialId", ["memorialId"])
    .index("by_status", ["status"])
    .index("by_reporterId", ["reporterId"]),

    timelineEntries: defineTable({
      memorialId: v.id("memorials"),
      creatorId: v.string(),
      year: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      category: v.string(), 
      order: v.optional(v.number()),
    }).index("by_memorial", ["memorialId"]),

    familyMembers: defineTable({
      memorialId: v.id("memorials"),
      name: v.string(),
      role: v.string(),
      birthYear: v.optional(v.string()),
      deathYear: v.optional(v.string()),
      portraitStorageId: v.optional(v.id("_storage")),
      linkedMemorialId: v.optional(v.id("memorials")),
      createdBy: v.string(),
      positionX: v.optional(v.number()),
      positionY: v.optional(v.number()),
    }).index("by_memorialId", ["memorialId"]),

    familyRelationships: defineTable({
      memorialId: v.id("memorials"),
      fromMemberId: v.id("familyMembers"),
      toMemberId: v.id("familyMembers"),
      type: v.union(
        v.literal("parent"),
        v.literal("child"),
        v.literal("spouse"),
        v.literal("sibling")
      ),
    }).index("by_memorialId", ["memorialId"]),


    gifts: defineTable({
      memorialId: v.id("memorials"),
      senderName: v.string(),
      senderId: v.optional(v.string()),
      giftType: v.string(),    
      giftEmoji: v.string(),
      giftName: v.string(),
      giftPrice: v.optional(v.number()),
      dedication: v.optional(v.string()),
      isAnonymous: v.boolean(),
      createdAt: v.number(),
    }).index("by_memorialId", ["memorialId"]),


    familyGroups: defineTable({
      name: v.string(),           
      createdBy: v.string(),
    }),


    familyGroupMembers: defineTable({
      groupId: v.id("familyGroups"),
      userId: v.string(),
      name: v.string(),
      avatarUrl: v.optional(v.string()),
      role: v.union(v.literal("owner"), v.literal("editor"), v.literal("viewer")),
    }).index("by_group", ["groupId"])
      .index("by_user", ["userId"]),


      familyConnectionRequests: defineTable({
        fromUserId: v.string(),
        fromUserName: v.string(),
        toUserId: v.string(),
        groupId: v.id("familyGroups"),
        groupName: v.string(),
        status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined")),
        createdAt: v.number(),
      }).index("by_to_user", ["toUserId"]),



      funeralHomes: defineTable({
       
        clerkUserId: v.string(),
        
        
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
        
       
        status: v.union(
          v.literal("pending"),    
          v.literal("active"),  
          v.literal("suspended")   
        ),
        
        
        subscriptionStatus: v.union(
          v.literal("trial"),
          v.literal("active"),
          v.literal("expired")
        ),
        subscriptionExpiresAt: v.optional(v.number()),
        
       
        totalBookings: v.optional(v.number()),
        rating: v.optional(v.number()),
      })
      .index("by_clerk_user", ["clerkUserId"])
      .index("by_city", ["city"])
      .index("by_status", ["status"])
});