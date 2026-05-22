

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
    privacy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("toasts", {
      ...args,
      createdAt: Date.now(),
    });
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
