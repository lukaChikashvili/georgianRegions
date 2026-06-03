import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const VALID_REASONS = [
  "fake_memorial",
  "wrong_person",
  "inappropriate_content",
  "spam_or_scam",
  "family_objects",
  "other",
];

const AUTO_FLAG_THRESHOLD = 3;


export const submitReport = mutation({
  args: {
    memorialId: v.id("memorials"),
    reason: v.string(),
    details: v.optional(v.string()),
    reporterId: v.optional(v.string()),
    reporterName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const memorial = await ctx.db.get(args.memorialId);
    if (!memorial) throw new Error("მემორიალი ვერ მოიძებნა.");

    
    if (!VALID_REASONS.includes(args.reason)) {
      throw new Error("არასწორი მიზეზი.");
    }

  
    if (args.reporterId) {
      const existingReport = await ctx.db
        .query("reports")
        .withIndex("by_reporterId", (q) => q.eq("reporterId", args.reporterId))
        .filter((q) => q.eq(q.field("memorialId"), args.memorialId))
        .first();

      if (existingReport) {
        throw new Error("თქვენ უკვე გაგზავნეთ საჩივარი ამ მემორიალზე.");
      }
    }

   
    await ctx.db.insert("reports", {
      memorialId: args.memorialId,
      reporterId: args.reporterId,
      reporterName: args.reporterName,
      reason: args.reason,
      details: args.details,
      status: "pending",
      createdAt: Date.now(),
    });

   
    const allReports = await ctx.db
      .query("reports")
      .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
      .collect();

    const pendingCount = allReports.filter((r) => r.status === "pending").length;

 
    if (pendingCount >= AUTO_FLAG_THRESHOLD && !memorial.isFlagged) {
      await ctx.db.patch(args.memorialId, { isFlagged: true });
    }

    
    await ctx.db.insert("notifications", {
      userId: memorial.creatorId,
      memorialId: args.memorialId,
      message: "თქვენი მემორიალი მოხსენებულია საეჭვო კონტენტად. გთხოვთ გადახედოთ.",
      type: "REPORT",
      isRead: false,
      createdAt: Date.now(),
    });

    return { success: true, pendingCount };
  },
});


export const getReportCount = query({
  args: { memorialId: v.id("memorials") },
  handler: async (ctx, args) => {
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
      .collect();

    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === "pending").length,
    };
  },
});


export const hasUserReported = query({
  args: { memorialId: v.id("memorials") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const existing = await ctx.db
      .query("reports")
      .withIndex("by_reporterId", (q) => q.eq("reporterId", identity.subject))
      .filter((q) => q.eq(q.field("memorialId"), args.memorialId))
      .first();

    return !!existing;
  },
});


export const getPendingReports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();
  },
});


export const getReportsForMemorial = query({
  args: { memorialId: v.id("memorials") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
      .order("desc")
      .collect();
  },
});


export const dismissReport = mutation({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, { status: "dismissed" });
    return true;
  },
});


export const actionReport = mutation({
  args: {
    reportId: v.id("reports"),
    memorialId: v.id("memorials"),
  },
  handler: async (ctx, args) => {
   
    await ctx.db.patch(args.reportId, { status: "actioned" });


    await ctx.db.patch(args.memorialId, {
      privacyType: "private",
      isFlagged: true,
    });

    
    const memorial = await ctx.db.get(args.memorialId);
    if (memorial) {
      await ctx.db.insert("notifications", {
        userId: memorial.creatorId,
        memorialId: args.memorialId,
        message: "თქვენი მემორიალი დროებით დაიხურა შეუფერებელი კონტენტის გამო.",
        type: "REPORT",
        isRead: false,
        createdAt: Date.now(),
      });
    }

    return true;
  },
});