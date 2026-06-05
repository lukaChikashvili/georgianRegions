import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendGift = mutation({
  args: {
    memorialId: v.id("memorials"),
    senderName: v.string(),
    senderId: v.optional(v.string()),
    giftType: v.string(),
    giftEmoji: v.string(),
    giftName: v.string(),
    giftPrice: v.number(),
    dedication: v.optional(v.string()),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("gifts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getGiftsForMemorial = query({
  args: { memorialId: v.id("memorials") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gifts")
      .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
      .order("desc")
      .collect();
  },
});