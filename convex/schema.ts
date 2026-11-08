import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  submissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    category: v.string(),
    subject: v.string(),
    offering: v.optional(v.string()),
    message: v.string(),
    recipientEmail: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("replied"),
      v.literal("archived")
    ),
    emailSent: v.boolean(),
    createdAt: v.string(),
  }).index("by_createdAt", ["createdAt"]),
});
