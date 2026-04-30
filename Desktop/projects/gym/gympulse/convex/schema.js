import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";



export default defineSchema({
    posts: defineTable({
        title: v.string(),
        body: v.string(),
        category: v.string(),
        authorName: v.optional(v.string()), 
        authorId: v.string(),
    }),

    comments: defineTable({
         postId: v.id("posts"),
         body: v.string(),
         authorId: v.string(),
         authorName: v.string(),
    })
});