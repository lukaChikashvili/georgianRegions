

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
      return await ctx.storage.generateUploadUrl();
    },
  });

export const saveToast = mutation({
    args: {
      memorialId: v.id("memorials"),
      audioUrl: v.string(),
      authorName: v.string(),
    },
    handler: async (ctx, args) => {
      
      const toastId = await ctx.db.insert("toasts", {
        memorialId: args.memorialId,
        audioUrl: args.audioUrl,
        authorName: args.authorName,
        privacy: "public",
        isApproved: false,
        createdAt: Date.now(), 
      });
  
      
      const memorial = await ctx.db.get(args.memorialId);
      if (memorial) {
        await ctx.db.insert("notifications", {
          userId: memorial.creatorId,
          memorialId: args.memorialId,
          message: `${args.authorName}-მ გამოგზავნა სადღეგრძელო დასამტკიცებლად`,
          type: "REPLY", 
          isRead: false,
          createdAt: Date.now(),
        });
      }
      
      return toastId;
    },
  });
  export const approveToast = mutation({
    args: { toastId: v.id("toasts") },
    handler: async (ctx, args) => {
      await ctx.db.patch(args.toastId, { isApproved: true });
    },
  });




export const getToasts = query({
  args: { memorialId: v.id("memorials") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("toasts")
      .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
      .collect();
  },
});


export const getToastUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
      return await ctx.storage.getUrl(args.storageId);
    },
  });

 
  export const getAllPendingToastsForUser = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
     
      const userMemorials = await ctx.db
        .query("memorials")
        .withIndex("by_creatorId", (q) => q.eq("creatorId", args.userId))
        .collect();
  
      const memorialIds = userMemorials.map(m => m._id);
  
 
      const allToasts = [];
      for (const memorialId of memorialIds) {
        const toasts = await ctx.db
          .query("toasts")
          .withIndex("by_memorialId", (q) => q.eq("memorialId", memorialId))
          .filter((q) => q.eq(q.field("isApproved"), false))
          .collect();
  
        const memorial = userMemorials.find(m => m._id === memorialId);
        
        toasts.forEach(toast => {
          allToasts.push({
            toast,
            memorial
          });
        });
      }
  
    
      return allToasts.sort((a, b) => b.toast.createdAt - a.toast.createdAt);
    },
  });
  

  export const rejectToast = mutation({
    args: { toastId: v.id("toasts") },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.toastId);
    },
  });