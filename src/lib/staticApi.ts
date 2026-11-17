import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { getAllPurchasableItems, getSiteData } from "@/lib/content";

/**
 * True when the site is built as a plain static export (no Next.js server).
 * In that mode forms and checkout talk to Convex directly from the browser
 * instead of going through /api routes.
 */
export const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

function getClient(): ConvexHttpClient {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error(
      "Online forms are not configured yet. Please email clodaghberesford@yahoo.com instead."
    );
  }
  return new ConvexHttpClient(url);
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  offering?: string;
  message: string;
}

export async function submitEnquiryStatic(payload: EnquiryPayload) {
  const convex = getClient();
  const recipientEmail = getSiteData().email;

  // Email notification (best effort — the enquiry is saved either way)
  let emailSent = false;
  try {
    const result = (await convex.action(api.submissions.sendEmailNotification, {
      ...payload,
    })) as { sent?: boolean };
    emailSent = Boolean(result?.sent);
  } catch {
    emailSent = false;
  }

  await convex.mutation(api.submissions.create, {
    ...payload,
    phone: payload.phone || undefined,
    offering: payload.offering || undefined,
    recipientEmail,
    emailSent,
  });

  return { recipientEmail, emailSent, backend: "convex" };
}

export interface OrderPayload {
  itemId: string;
  unitPriceEur?: number; // only honoured for flexible-value items (e.g. bespoke gift token)
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  poemChoice?: string;
  dedicationNotes?: string;
}

export async function createOrderStatic(payload: OrderPayload) {
  const item = getAllPurchasableItems().find((i) => i.id === payload.itemId);
  if (!item) {
    throw new Error("Sorry, that item is not available for online purchase.");
  }

  // Price always comes from the catalogue, except for flexible-value gift tokens
  const unit = item.allowCustomAmount
    ? Math.min(2000, Math.max(item.unitPriceEur, Number(payload.unitPriceEur) || 0))
    : item.unitPriceEur;
  const qty = Math.min(10, Math.max(1, Math.floor(Number(payload.quantity) || 1)));
  const totalEur = Math.round(unit * qty * 100) / 100;

  const site = getSiteData();
  const paypalReceiverEmail =
    process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL || site.email;

  const convex = getClient();
  const orderId = String(
    await convex.mutation(api.orders.create, {
      itemId: item.id,
      itemTitle: item.title,
      itemType: item.itemType,
      unitPriceEur: unit,
      quantity: qty,
      totalEur,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone || undefined,
      shippingAddress: payload.shippingAddress || undefined,
      poemChoice: payload.poemChoice || undefined,
      dedicationNotes: payload.dedicationNotes || undefined,
      paypalReceiverEmail,
      paymentMethod: "paypal_standard",
      status: "pending_payment",
    })
  );

  // Notify Clodagh (best effort)
  try {
    const lines = [
      `Order Reference: ${orderId}`,
      `Item: ${item.title}`,
      `Quantity: ${qty} × €${unit.toFixed(2)} = €${totalEur.toFixed(2)} EUR`,
      `Payment Status: Customer is proceeding to PayPal checkout — confirm in your PayPal account`,
      payload.poemChoice ? `Selected Poem: ${payload.poemChoice}` : null,
      payload.dedicationNotes ? `Notes: ${payload.dedicationNotes}` : null,
      payload.shippingAddress ? `Shipping Address:\n${payload.shippingAddress}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    await convex.action(api.submissions.sendEmailNotification, {
      name: payload.customerName,
      email: payload.customerEmail,
      phone: payload.customerPhone || undefined,
      category:
        item.itemType === "course"
          ? "Course Booking (PayPal)"
          : "Gift / Print Order (PayPal)",
      subject: `PayPal Order (€${totalEur.toFixed(2)}): ${item.title}`,
      offering: `${item.title} (€${totalEur.toFixed(2)})`,
      message: lines,
    });
  } catch {
    // non-blocking
  }

  const origin = window.location.origin;
  const url = new URL("https://www.paypal.com/cgi-bin/webscr");
  url.searchParams.set("cmd", "_xclick");
  url.searchParams.set("business", paypalReceiverEmail);
  url.searchParams.set(
    "item_name",
    payload.poemChoice ? `${item.title} (${payload.poemChoice})` : item.title
  );
  url.searchParams.set("item_number", orderId);
  url.searchParams.set("amount", unit.toFixed(2));
  url.searchParams.set("quantity", String(qty));
  url.searchParams.set("currency_code", "EUR");
  url.searchParams.set("no_shipping", item.itemType === "course" ? "1" : "2");
  url.searchParams.set(
    "return",
    `${origin}/checkout/success/?orderId=${encodeURIComponent(orderId)}`
  );
  url.searchParams.set(
    "cancel_return",
    `${origin}/checkout/?item=${encodeURIComponent(item.id)}&cancelled=1`
  );
  url.searchParams.set("custom", orderId);

  return { orderId, totalEur, paypalCheckoutUrl: url.toString() };
}
