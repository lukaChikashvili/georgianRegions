import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkIsPremium } from "./pricing";


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
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("მოითხოვება ავტორიზაცია!");
  
      const premium = await checkIsPremium(ctx, identity.subject);
  
      if (!premium) {
        const existing = await ctx.db
          .query("timelineEntries")
          .withIndex("by_memorial", (q) => q.eq("memorialId", args.memorialId))
          .collect();
  
        if (existing.length >= 2) {
          throw new Error(
            "უფასო პაკეტში მაქსიმუმ 2 მოვლენის დამატებაა შესაძლებელი. განაახლეთ პაკეტი."
          );
        }
      }
  
      return await ctx.db.insert("timelineEntries", args);
    },
  });

export const update = mutation({
    args: {
      id: v.id("timelineEntries"),
      year: v.optional(v.string()),
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      category: v.optional(v.string()),
    },
    handler: async (ctx, { id, ...fields }) => {
      await ctx.db.patch(id, fields);
    },
  });
  
  export const remove = mutation({
    args: { id: v.id("timelineEntries") },
    handler: async (ctx, { id }) => {
      await ctx.db.delete(id);
    },
  });



  