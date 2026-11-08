import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      ...args,
      createdAt: new Date().toISOString(),
    });
    return orderId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").take(200);
  },
});

export const getById = query({
  args: {
    id: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending_payment"),
      v.literal("paid"),
      v.literal("fulfilled"),
      v.literal("cancelled")
    ),
    paypalOrderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: {
      status: "pending_payment" | "paid" | "fulfilled" | "cancelled";
      paypalOrderId?: string;
    } = { status: args.status };
    if (args.paypalOrderId) {
      patch.paypalOrderId = args.paypalOrderId;
    }
    await ctx.db.patch(args.id, patch);
    return { ok: true };
  },
});

export const remove = mutation({
  args: {
    id: v.id("orders"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});
