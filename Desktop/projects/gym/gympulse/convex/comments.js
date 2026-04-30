import { v } from "convex/values";
import { mutation } from "./_generated/server";


export const createComment = mutation({
    args: {
        postId: v.id("posts"),
        body: v.string(),
        authorId: v.string(),
        authorName: v.string(),
        
      },
      handler: async (ctx, args) => {
        return await ctx.db.insert("comments", {
            ...args
        });
      }
})