import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { getSiteData } from "@/lib/content";

export interface OrderRecord {
  _id: string;
  itemId: string;
  itemTitle: string;
  itemType: "course" | "gift";
  unitPriceEur: number;
  quantity: number;
  totalEur: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  poemChoice?: string;
  dedicationNotes?: string;
  paypalOrderId?: string;
  paypalReceiverEmail: string;
  paymentMethod: "paypal_sdk" | "paypal_standard";
  status: "pending_payment" | "paid" | "fulfilled" | "cancelled";
  createdAt: string;
}

function getConvexClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  return new ConvexHttpClient(url);
}

export async function GET(request: Request) {
  const convex = getConvexClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!convex) {
    return NextResponse.json({ configured: false, items: [] });
  }

  try {
    if (id) {
      const order = await convex.query(api.orders.getById, {
        id: id as Id<"orders">,
      });
      return NextResponse.json({ configured: true, order });
    }

    const items = await convex.query(api.orders.list, {});
    return NextResponse.json({
      configured: true,
      items,
      paypalBusinessEmail:
        process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL ||
        getSiteData().email ||
        "clodaghberesford@yahoo.com",
      paypalSdkConfigured: Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch orders", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      itemId,
      itemTitle,
      itemType = "gift",
      unitPriceEur,
      quantity = 1,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      poemChoice,
      dedicationNotes,
      paymentMethod = "paypal_standard",
      status = "pending_payment",
      paypalOrderId,
    } = body as {
      itemId: string;
      itemTitle: string;
      itemType?: "course" | "gift";
      unitPriceEur: number;
      quantity?: number;
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      shippingAddress?: string;
      poemChoice?: string;
      dedicationNotes?: string;
      paymentMethod?: "paypal_sdk" | "paypal_standard";
      status?: "pending_payment" | "paid" | "fulfilled" | "cancelled";
      paypalOrderId?: string;
    };

    if (
      !itemId ||
      !itemTitle ||
      !unitPriceEur ||
      !customerName ||
      !customerEmail
    ) {
      return NextResponse.json(
        { error: "Please complete all required order fields." },
        { status: 400 }
      );
    }

    const site = getSiteData();
    const paypalReceiverEmail =
      process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL ||
      site.email ||
      "clodaghberesford@yahoo.com";

    const qty = Math.max(1, Number(quantity) || 1);
    const unit = Math.max(1, Number(unitPriceEur) || 0);
    const totalEur = Math.round(unit * qty * 100) / 100;

    const convex = getConvexClient();
    let orderId = `ord-${Date.now()}`;

    if (convex) {
      const createdId = await convex.mutation(api.orders.create, {
        itemId,
        itemTitle,
        itemType,
        unitPriceEur: unit,
        quantity: qty,
        totalEur,
        customerName,
        customerEmail,
        customerPhone: customerPhone || undefined,
        shippingAddress: shippingAddress || undefined,
        poemChoice: poemChoice || undefined,
        dedicationNotes: dedicationNotes || undefined,
        paypalOrderId: paypalOrderId || undefined,
        paypalReceiverEmail,
        paymentMethod,
        status,
      });
      orderId = String(createdId);

      // Also notify Clodagh via Resend action if configured
      try {
        const summaryLines = [
          `Order Reference: ${orderId}`,
          `Item: ${itemTitle} (${itemType === "course" ? "Course / Workshop" : "Buy & Gifts"})`,
          `Quantity: ${qty} × €${unit.toFixed(2)} = €${totalEur.toFixed(2)} EUR`,
          `Payment Status: ${status === "paid" ? "PAID via PayPal" : "Proceeding to PayPal Checkout"}`,
          poemChoice ? `Selected Poem: ${poemChoice}` : null,
          dedicationNotes ? `Dedication / Notes: ${dedicationNotes}` : null,
          shippingAddress ? `Shipping Address:\n${shippingAddress}` : null,
        ]
          .filter(Boolean)
          .join("\n\n");

        await convex.action(api.submissions.sendEmailNotification, {
          name: customerName,
          email: customerEmail,
          phone: customerPhone || undefined,
          category: itemType === "course" ? "Course Booking (PayPal)" : "Gift / Print Order (PayPal)",
          subject: `PayPal Order (€${totalEur.toFixed(2)}): ${itemTitle}`,
          offering: `${itemTitle} (€${totalEur.toFixed(2)})`,
          message: summaryLines,
          recipientEmail: site.email || "clodaghberesford@yahoo.com",
        });
      } catch {
        // Non-blocking email notification
      }
    }

    const origin = new URL(request.url).origin;
    const returnUrl = `${origin}/checkout/success?orderId=${encodeURIComponent(
      orderId
    )}`;
    const cancelUrl = `${origin}/checkout?item=${encodeURIComponent(
      itemId
    )}&cancelled=1`;

    const paypalCheckoutUrl = new URL("https://www.paypal.com/cgi-bin/webscr");
    paypalCheckoutUrl.searchParams.set("cmd", "_xclick");
    paypalCheckoutUrl.searchParams.set("business", paypalReceiverEmail);
    paypalCheckoutUrl.searchParams.set(
      "item_name",
      poemChoice ? `${itemTitle} (${poemChoice})` : itemTitle
    );
    paypalCheckoutUrl.searchParams.set("item_number", orderId);
    paypalCheckoutUrl.searchParams.set("amount", unit.toFixed(2));
    paypalCheckoutUrl.searchParams.set("quantity", String(qty));
    paypalCheckoutUrl.searchParams.set("currency_code", "EUR");
    paypalCheckoutUrl.searchParams.set("no_shipping", itemType === "course" ? "1" : "2");
    paypalCheckoutUrl.searchParams.set("return", returnUrl);
    paypalCheckoutUrl.searchParams.set("cancel_return", cancelUrl);
    paypalCheckoutUrl.searchParams.set("custom", orderId);

    return NextResponse.json({
      ok: true,
      orderId,
      totalEur,
      paypalReceiverEmail,
      paypalCheckoutUrl: paypalCheckoutUrl.toString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create order", details: String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, paypalOrderId } = body as {
      id: string;
      status: "pending_payment" | "paid" | "fulfilled" | "cancelled";
      paypalOrderId?: string;
    };

    const convex = getConvexClient();
    if (!convex) {
      return NextResponse.json(
        { error: "Convex not configured" },
        { status: 500 }
      );
    }

    await convex.mutation(api.orders.updateStatus, {
      id: id as Id<"orders">,
      status,
      paypalOrderId,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update order status", details: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const convex = getConvexClient();
    if (!convex) {
      return NextResponse.json(
        { error: "Convex not configured" },
        { status: 500 }
      );
    }

    await convex.mutation(api.orders.remove, {
      id: id as Id<"orders">,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete order", details: String(err) },
      { status: 500 }
    );
  }
}

