import { mutationGeneric, queryGeneric, actionGeneric } from "convex/server";
import { v } from "convex/values";

export const create = mutationGeneric({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    category: v.string(),
    subject: v.string(),
    offering: v.optional(v.string()),
    message: v.string(),
    recipientEmail: v.string(),
    emailSent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("submissions", {
      ...args,
      status: "new",
      createdAt: new Date().toISOString(),
    });
    return id;
  },
});

export const list = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("submissions").order("desc").collect();
    return items;
  },
});

export const updateStatus = mutationGeneric({
  args: {
    id: v.id("submissions"),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("replied"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return { ok: true };
  },
});

export const remove = mutationGeneric({
  args: {
    id: v.id("submissions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const sendEmailNotification = actionGeneric({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    category: v.string(),
    subject: v.string(),
    offering: v.optional(v.string()),
    message: v.string(),
    recipientEmail: v.string(),
  },
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return { sent: false, reason: "RESEND_API_KEY not configured" };
    }

    const fromAddress =
      process.env.RESEND_FROM_EMAIL ||
      "Clodagh Beresford Dunne Website <onboarding@resend.dev>";

    const htmlBody = `
      <div style="font-family: Georgia, serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #d6d3d1; background: #fafaf9; color: #1c1917;">
        <p style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9a7b38; margin: 0 0 6px 0; font-weight: bold;">
          New Website Booking / Enquiry — ${args.category}
        </p>
        <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: normal;">
          ${args.subject}
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; background: #ffffff; border: 1px solid #e7e5e4;">
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4; font-weight: bold; width: 130px;">From:</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4;">${args.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4; font-weight: bold;">Reply Email:</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4;"><a href="mailto:${args.email}">${args.email}</a></td>
          </tr>
          ${
            args.phone
              ? `<tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4; font-weight: bold;">Phone / WhatsApp:</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4;">${args.phone}</td>
          </tr>`
              : ""
          }
          ${
            args.offering
              ? `<tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4; font-weight: bold;">Selected Item:</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4;">${args.offering}</td>
          </tr>`
              : ""
          }
        </table>
        <div style="background: #ffffff; padding: 16px; border-left: 4px solid #9a7b38; white-space: pre-wrap; line-height: 1.6; font-size: 15px;">${args.message}</div>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [args.recipientEmail],
        reply_to: args.email,
        subject: `[Website ${args.category}] ${args.subject} — from ${args.name}`,
        html: htmlBody,
      }),
    });

    return { sent: response.ok, status: response.status };
  },
});

