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

  orders: defineTable({
    itemId: v.string(),
    itemTitle: v.string(),
    itemType: v.union(v.literal("course"), v.literal("gift")),
    unitPriceEur: v.number(),
    quantity: v.number(),
    totalEur: v.number(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    shippingAddress: v.optional(v.string()),
    poemChoice: v.optional(v.string()),
    dedicationNotes: v.optional(v.string()),
    paypalOrderId: v.optional(v.string()),
    paypalReceiverEmail: v.string(),
    paymentMethod: v.union(
      v.literal("paypal_sdk"),
      v.literal("paypal_standard")
    ),
    status: v.union(
      v.literal("pending_payment"),
      v.literal("paid"),
      v.literal("fulfilled"),
      v.literal("cancelled")
    ),
    createdAt: v.string(),
  }).index("by_createdAt", ["createdAt"]),
});


