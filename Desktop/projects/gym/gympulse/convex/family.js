import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";


export const searchUserByExact = action({
    args: { term: v.string() },
    handler: async (ctx, { term }) => {
      const normalized = term.trim();
      if (!normalized) return null;
  
      if (!process.env.CLERK_SECRET_KEY) {
        throw new Error("CLERK_SECRET_KEY არ არის დაყენებული Convex environment-ში");
      }
  
      const isEmail = normalized.includes("@");
      const url = isEmail
  ? `https://api.clerk.com/v1/users?email_address[]=${encodeURIComponent(normalized.toLowerCase())}`
  : `https://api.clerk.com/v1/users?query=${encodeURIComponent(normalized)}`;


      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
      });
  
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Clerk API შეცდომა (${res.status}): ${body}`);
      }
  
      const users = await res.json();
      if (!users.length) return null;
  
      const match = users.find((u) => {
        const email = u.email_addresses?.[0]?.email_address?.toLowerCase() ?? "";
        const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
        return isEmail
          ? email === normalized.toLowerCase()
          : fullName.toLowerCase() === normalized.toLowerCase();
      });
      if (!match) return null;
  
      return {
        clerkId: match.id,
        name: [match.first_name, match.last_name].filter(Boolean).join(" ") || match.username || "უცნობი",
        email: match.email_addresses?.[0]?.email_address ?? "",
      };
    },
  });

export const getMyFamilyGroups = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const memberships = await ctx.db
      .query("familyGroupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return Promise.all(
      memberships.map(async (m) => {
        const group = await ctx.db.get(m.groupId);
        const members = await ctx.db
          .query("familyGroupMembers")
          .withIndex("by_group", (q) => q.eq("groupId", m.groupId))
          .collect();
        return { ...group, role: m.role, memberCount: members.length };
      })
    );
  },
});

export const getPendingRequestsForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query("familyConnectionRequests")
      .withIndex("by_to_user", (q) => q.eq("toUserId", userId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

export const createFamilyGroup = mutation({
  args: { userId: v.string(), name: v.string(), creatorName: v.string(), creatorAvatar: v.optional(v.string()) },
  handler: async (ctx, { userId, name, creatorName, creatorAvatar }) => {
    const groupId = await ctx.db.insert("familyGroups", { name, createdBy: userId });
    await ctx.db.insert("familyGroupMembers", {
      groupId,
      userId,
      name: creatorName,
      avatarUrl: creatorAvatar,
      role: "owner",
    });
    return groupId;
  },
});

export const sendConnectionRequest = mutation({
  args: {
    fromUserId: v.string(),
    fromUserName: v.string(),
    toUserId: v.string(),
    groupId: v.id("familyGroups"),
  },
  handler: async (ctx, args) => {
    if (args.fromUserId === args.toUserId) throw new Error("საკუთარი თავის დამატება შეუძლებელია");

    
    const existing = await ctx.db
      .query("familyConnectionRequests")
      .withIndex("by_to_user", (q) => q.eq("toUserId", args.toUserId))
      .filter((q) =>
        q.and(
          q.eq(q.field("fromUserId"), args.fromUserId),
          q.eq(q.field("groupId"), args.groupId),
          q.eq(q.field("status"), "pending")
        )
      )
      .first();
    if (existing) throw new Error("მოთხოვნა უკვე გაგზავნილია");

    const group = await ctx.db.get(args.groupId);
    return ctx.db.insert("familyConnectionRequests", {
      ...args,
      groupName: group?.name ?? "",
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const respondToRequest = mutation({
    args: {
      requestId: v.id("familyConnectionRequests"),
      accept: v.boolean(),
      userName: v.optional(v.string()),
      userAvatar: v.optional(v.string()),
    },
    handler: async (ctx, { requestId, accept, userName, userAvatar }) => {
      const req = await ctx.db.get(requestId);
      if (!req) throw new Error("მოთხოვნა ვერ მოიძებნა");
  
      await ctx.db.patch(requestId, { status: accept ? "accepted" : "declined" });
  
      if (accept) {
        await ctx.db.insert("familyGroupMembers", {
          groupId: req.groupId,
          userId: req.toUserId,
          name: userName ?? "უცნობი",
          avatarUrl: userAvatar,
          role: "viewer",
        });
      }
    },
  });

  export const getGroupMembers = query({
    args: { groupId: v.id("familyGroups") },
    handler: async (ctx, { groupId }) => {
      return ctx.db
        .query("familyGroupMembers")
        .withIndex("by_group", (q) => q.eq("groupId", groupId))
        .collect();
    },
  });


  export const deleteFamilyGroup = mutation({
    args: { groupId: v.id("familyGroups"), userId: v.string() },
    handler: async (ctx, { groupId, userId }) => {
      const group = await ctx.db.get(groupId);
      if (!group) throw new Error("ჯგუფი ვერ მოიძებნა");
  
     
      const membership = await ctx.db
        .query("familyGroupMembers")
        .withIndex("by_group", (q) => q.eq("groupId", groupId))
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();
  
      if (!membership || membership.role !== "owner") {
        throw new Error("მხოლოდ ჯგუფის მფლობელს შეუძლია მისი წაშლა");
      }
  
     
      const members = await ctx.db
        .query("familyGroupMembers")
        .withIndex("by_group", (q) => q.eq("groupId", groupId))
        .collect();
      for (const m of members) {
        await ctx.db.delete(m._id);
      }
  
     
      const allRequests = await ctx.db.query("familyConnectionRequests").collect();
      for (const r of allRequests) {
        if (r.groupId === groupId) await ctx.db.delete(r._id);
      }
  
      
      const memorials = await ctx.db
        .query("memorials")
        .withIndex("by_groupId", (q) => q.eq("groupId", groupId))
        .collect();
      for (const mem of memorials) {
        await ctx.db.patch(mem._id, { groupId: undefined });
      }
  
      await ctx.db.delete(groupId);
    },
  });