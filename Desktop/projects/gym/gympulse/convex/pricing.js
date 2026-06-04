
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const TEST_USER_IDS = [process.env.NEXT_PUBLIC_TEST_USER_ID];

export const activateLifetime = mutation({
  args: {
    userId: v.string(),
    bogOrderId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_bogOrderId", (q) => q.eq("bogOrderId", args.bogOrderId))
      .unique();

    if (existing) return existing._id; 

    return await ctx.db.insert("subscriptions", {
      userId: args.userId,
      plan: "lifetime",
      status: "active",
      bogOrderId: args.bogOrderId,
      amount: args.amount,
      currency: "GEL",
      createdAt: Date.now(),
      expiresAt: null,
    });
  },
});


export const createPendingOrder = mutation({
  args: {
    userId: v.string(),
    bogOrderId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
   
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();

    if (existing?.plan === "lifetime" && existing?.status === "active") {
      throw new Error("უკვე გაქვთ მარადიული გამოწერა.");
    }

    return await ctx.db.insert("subscriptions", {
      userId: args.userId,
      plan: "lifetime",
      status: "inactive", 
      bogOrderId: args.bogOrderId,
      amount: args.amount,
      currency: "GEL",
      createdAt: Date.now(),
      expiresAt: null,
    });
  },
});

export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .first();
  },
});

export const isPremium = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    if (TEST_USER_IDS.includes(identity.subject)) return true;
    

    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .first();

    return sub?.plan === "lifetime" && sub?.status === "active";
  },
});


export const checkIsPremium = async (ctx, userId) => {
 


  if (TEST_USER_IDS.includes(userId)) return true;

  const sub = await ctx.db
    .query("subscriptions")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .order("desc")
    .first();

  return sub?.plan === "lifetime" && sub?.status === "active";
};