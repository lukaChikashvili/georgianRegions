

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});


export const saveToast = mutation({
    args: {
      memorialId: v.id("memorials"),
      audioUrl: v.string(),
      authorName: v.string(),
    },
    handler: async (ctx, args) => {
      
      const toastId = await ctx.db.insert("toasts", {
        ...args,
        privacy: "public",
        isApproved: false, 
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
