import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createPost = mutation({
    args: { title: v.string(), body: v.string(), category: v.string(),  authorName: v.string(), },
    handler: async (ctx, args) => {
     

        const newBlog = await ctx.db.insert("posts", {
            body: args.body,
            title: args.title,
            category: args.category,
            authorName: args.authorName,
            authorId: "sd"
        });

        return newBlog;
    }
});


export const getPosts = query({
    handler: async(ctx) => {
        return await ctx.db.query("posts").collect();
    }
});


export const getPostById = query({
    args: {
      id: v.id("posts"),
    },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.id);
    },
  });
