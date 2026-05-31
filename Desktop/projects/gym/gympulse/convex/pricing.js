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