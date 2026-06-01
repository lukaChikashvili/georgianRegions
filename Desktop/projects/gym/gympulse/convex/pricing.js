import { query } from "./_generated/server";


export const getMySubscription = query({
    args: {},
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return null;
  
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .order("desc")
        .first();
  
      if (!sub) return null;
  
     
      if (sub.plan === "monthly" && sub.expiresAt && sub.expiresAt < Date.now()) {
        return { ...sub, status: "expired" };
      }
  
      return sub;
    },
  });

  export const isPremium = query({
    args: {},
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return false;
  
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .order("desc")
        .first();
  
      if (!sub) return false;
      if (sub.status !== "active") return false;
      if (sub.plan === "monthly" && sub.expiresAt && sub.expiresAt < Date.now()) return false;
  
      return true;
    },
  });