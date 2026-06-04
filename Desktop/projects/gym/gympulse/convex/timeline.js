import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const getByMemorial = query({
    args: { memorialId: v.id("memorials") },
    handler: async (ctx, { memorialId }) => {
      const entries = await ctx.db
        .query("timelineEntries")
        .withIndex("by_memorial", (q) => q.eq("memorialId", memorialId))
        .collect();
      return entries.sort((a, b) => {
        const ya = parseInt(a.year) || 9999;
        const yb = parseInt(b.year) || 9999;
        return ya - yb;
      });
    },
  });

  export const add = mutation({
    args: {
      memorialId: v.id("memorials"),
      creatorId: v.string(),
      year: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      category: v.string(),
    },
    handler: async (ctx, args) => {
      return await ctx.db.insert("timelineEntries", args);
    },
  });