import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkIsPremium } from "./pricing";

export const getTree = query({
  args: { memorialId: v.id("memorials") },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("familyMembers")
      .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
      .collect();

    const relationships = await ctx.db
      .query("familyRelationships")
      .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
      .collect();

    const membersWithUrls = await Promise.all(
      members.map(async (m) => ({
        ...m,
        portraitUrl: m.portraitStorageId
          ? await ctx.storage.getUrl(m.portraitStorageId)
          : null,
      }))
    );

    return { members: membersWithUrls, relationships };
  },
});

export const addMember = mutation({
  args: {
    memorialId: v.id("memorials"),
    name: v.string(),
    role: v.string(),
    birthYear: v.optional(v.string()),
    deathYear: v.optional(v.string()),
    linkedMemorialId: v.optional(v.id("memorials")),
    positionX: v.optional(v.number()),
    positionY: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("მოითხოვება ავტორიზაცია!");

    const premium = await checkIsPremium(ctx, identity.subject);
    if (!premium) {
      const existing = await ctx.db
        .query("familyMembers")
        .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
        .collect();
      if (existing.length >= 3) {
        throw new Error("უფასო პაკეტში მაქსიმუმ 3 წევრის დამატებაა შესაძლებელი.");
      }
    }

    return await ctx.db.insert("familyMembers", {
      ...args,
      createdBy: identity.subject,
    });
  },
});

export const updateMemberPosition = mutation({
  args: {
    id: v.id("familyMembers"),
    positionX: v.number(),
    positionY: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      positionX: args.positionX,
      positionY: args.positionY,
    });
  },
});

export const updateMember = mutation({
  args: {
    id: v.id("familyMembers"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    birthYear: v.optional(v.string()),
    deathYear: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const removeMember = mutation({
    args: { id: v.id("familyMembers") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("მოითხოვება ავტორიზაცია!");
  
      
      const member = await ctx.db.get(args.id);
      if (!member) throw new Error("წევრი ვერ მოიძებნა.");
  
     
      const rels = await ctx.db
        .query("familyRelationships")
        .withIndex("by_memorialId", (q) => q.eq("memorialId", member.memorialId))
        .collect();
  
      for (const rel of rels) {
        if (rel.fromMemberId === args.id || rel.toMemberId === args.id) {
          await ctx.db.delete(rel._id);
        }
      }
  
      
      await ctx.db.delete(args.id);
    },
  });

export const addRelationship = mutation({
  args: {
    memorialId: v.id("memorials"),
    fromMemberId: v.id("familyMembers"),
    toMemberId: v.id("familyMembers"),
    type: v.union(
      v.literal("parent"),
      v.literal("child"),
      v.literal("spouse"),
      v.literal("sibling")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("მოითხოვება ავტორიზაცია!");
    return await ctx.db.insert("familyRelationships", args);
  },
});

export const removeRelationship = mutation({
  args: { id: v.id("familyRelationships") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});