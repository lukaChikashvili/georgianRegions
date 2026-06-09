import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPost = mutation({
    args: {
        title: v.string(),
        body: v.string(),
        category: v.string(),
        authorName: v.string(),
        authorId: v.string(),
        imageId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("უნდა იყოთ შესული სისტემაში");

        return await ctx.db.insert("posts", {
            body: args.body,
            title: args.title,
            category: args.category,
            authorName: args.authorName,
            authorId: identity.subject,  
            imageId: args.imageId,
        });
    }
});


export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    }
});


export const getImageUrl = query({
    args: { imageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.imageId);
    }
});

export const deletePost = mutation({
    args: { id: v.id("posts") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("უნდა იყოთ შესული სისტემაში");

        const post = await ctx.db.get(args.id);
        if (!post) throw new Error("პოსტი ვერ მოიძებნა");
        if (post.authorId !== identity.subject) throw new Error("წვდომა აკრძალულია");

      
        if (post.imageId) {
            await ctx.storage.delete(post.imageId);
        }

        await ctx.db.delete(args.id);
    }
});

export const getPosts = query({
    handler: async (ctx) => {
        return await ctx.db.query("posts").order("desc").collect();
    }
});

export const getPostById = query({
    args: { id: v.id("posts") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});