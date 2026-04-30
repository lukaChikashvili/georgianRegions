import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


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
});


export const getComments = query({
    args:  {
        postId: v.id("posts"),

    },

    handler: async (ctx, args) => {
        return await ctx.db.query("comments").filter((q) => q.eq(q.field("postId"), args.postId)).collect();
        
    }
})