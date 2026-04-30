import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createPost = mutation({
    args: { title: v.string(), body: v.string() },
    handler: async (ctx, args) => {
     

        const newBlog = await ctx.db.insert("posts", {
            body: args.body,
            title: args.title,
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

