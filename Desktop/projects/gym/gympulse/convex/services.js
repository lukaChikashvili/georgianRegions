

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
      return await ctx.storage.generateUploadUrl();
    },
  });

export const saveToast = mutation({
    args: {
      memorialId: v.id("memorials"),
      audioUrl: v.string(),
      authorName: v.string(),
    },
    handler: async (ctx, args) => {
      
      const toastId = await ctx.db.insert("toasts", {
        memorialId: args.memorialId,
        audioUrl: args.audioUrl,
        authorName: args.authorName,
        privacy: "public",
        isApproved: false,
        createdAt: Date.now(), 
      });
  
      
      const memorial = await ctx.db.get(args.memorialId);
      if (memorial) {
        await ctx.db.insert("notifications", {
          userId: memorial.creatorId,
          memorialId: args.memorialId,
          message: `${args.authorName}-მ გამოგზავნა სადღეგრძელო დასამტკიცებლად`,
          type: "REPLY", 
          isRead: false,
          createdAt: Date.now(),
        });
      }
      
      return toastId;
    },
  });
  export const approveToast = mutation({
    args: { toastId: v.id("toasts") },
    handler: async (ctx, args) => {
      await ctx.db.patch(args.toastId, { isApproved: true });
    },
  });


  export const getApprovedToasts = query({
    args: { memorialId: v.id("memorials") },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("toasts")
        .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
        .filter((q) => q.eq(q.field("isApproved"), true))
        .collect();
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


export const getToastUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
      return await ctx.storage.getUrl(args.storageId);
    },
  });

 
  export const getAllPendingToastsForUser = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
     
      const userMemorials = await ctx.db
        .query("memorials")
        .withIndex("by_creatorId", (q) => q.eq("creatorId", args.userId))
        .collect();
  
      const memorialIds = userMemorials.map(m => m._id);
  
 
      const allToasts = [];
      for (const memorialId of memorialIds) {
        const toasts = await ctx.db
          .query("toasts")
          .withIndex("by_memorialId", (q) => q.eq("memorialId", memorialId))
          .filter((q) => q.eq(q.field("isApproved"), false))
          .collect();
  
        const memorial = userMemorials.find(m => m._id === memorialId);
        
        toasts.forEach(toast => {
          allToasts.push({
            toast,
            memorial
          });
        });
      }
  
    
      return allToasts.sort((a, b) => b.toast.createdAt - a.toast.createdAt);
    },
  });
  

  export const rejectToast = mutation({
    args: { toastId: v.id("toasts") },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.toastId);
    },
  });


  export const saveInvitationImage = mutation({
    args: { 
      memorialId: v.id("memorials"), 
      storageId: v.id("_storage") 
    },
    handler: async (ctx, args) => {
     
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("დაუსაბუთებელი მომხმარებელი (Unauthorized)");
      }
  
     
      const memorial = await ctx.db.get(args.memorialId);
      if (!memorial) {
        throw new Error("მემორიალი ვერ მოიძებნა");
      }
  
     
      if (memorial.creatorId !== identity.subject) {
        throw new Error("თქვენ არ გაქვთ ამ მემორიალის რედაქტირების უფლება");
      }
  
   
      await ctx.db.insert("invitations", {
        memorialId: args.memorialId,
        storageId: args.storageId,
        isPublished: false,
        createdAt: Date.now(),
      });
    },
  });

  export const getInvitationForMemorial = query({
    args: { memorialId: v.id("memorials") },
    handler: async (ctx, args) => {
     
      const invitations = await ctx.db
        .query("invitations")
        .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
        .collect();
        
      if (invitations.length === 0) return [];
  
  
      return Promise.all(
        invitations.map(async (inv) => ({
          ...inv,
          url: await ctx.storage.getUrl(inv.storageId),
        }))
      );
    },
  });


  export const publishInvitation = mutation({
    args: { invitationId: v.id("invitations") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthorized");
  
      const targetInvitation = await ctx.db.get(args.invitationId);
      if (!targetInvitation) throw new Error("Invitation not found");
  
      const memorial = await ctx.db.get(targetInvitation.memorialId);
      if (memorial?.creatorId !== identity.subject) {
        throw new Error("No permission");
      }
  
   
      const existingPublished = await ctx.db
        .query("invitations")
        .withIndex("by_memorialId", (q) => q.eq("memorialId", targetInvitation.memorialId))
        .filter((q) => q.eq(q.field("isPublished"), true))
        .collect();
  
      
      for (const inv of existingPublished) {
        await ctx.db.patch(inv._id, { isPublished: false });
      }
  
    
      await ctx.db.patch(targetInvitation._id, { isPublished: true });
    },
  });


  export const migrateInvitations = mutation({
    handler: async (ctx) => {
      const invitations = await ctx.db.query("invitations").collect();
      for (const inv of invitations) {
        if (inv.isPublished === undefined) {
          await ctx.db.patch(inv._id, { isPublished: false });
        }
      }
    },
  });

  export const fixDuplicatePublished = mutation({
    args: { memorialId: v.id("memorials") },
    handler: async (ctx, args) => {
      const all = await ctx.db
        .query("invitations")
        .withIndex("by_memorialId", (q) => q.eq("memorialId", args.memorialId))
        .collect();
  
    
      for (const inv of all) {
        await ctx.db.patch(inv._id, { isPublished: false });
      }
    }
  });



  export const getMemorialForAdmin = query({
    args: { memorialId: v.id("memorials") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return null;
  
      const memorial = await ctx.db.get(args.memorialId);
      
   
      if (memorial && memorial.creatorId === identity.subject) {
        return memorial;
      }
      
      return null; 
    },
  });