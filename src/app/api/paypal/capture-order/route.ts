import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const PAYPAL_BASE_URL =
  process.env.PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal API credentials not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`PayPal OAuth failed: ${errText}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const { paypalOrderId, convexOrderId } = (await request.json()) as {
      paypalOrderId: string;
      convexOrderId?: string;
    };

    const accessToken = await getPayPalAccessToken();

    const captureRes = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(
        paypalOrderId
      )}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await captureRes.json();
    if (!captureRes.ok) {
      return NextResponse.json(
        { error: "Failed to capture PayPal payment", details: data },
        { status: captureRes.status }
      );
    }

    // Mark order as paid in Convex
    if (convexOrderId && process.env.NEXT_PUBLIC_CONVEX_URL) {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
      await convex.mutation(api.orders.updateStatus, {
        id: convexOrderId as Id<"orders">,
        status: "paid",
        paypalOrderId,
      });
    }

    return NextResponse.json({ ok: true, capture: data });
  } catch (err) {
    return NextResponse.json(
      { error: "PayPal capture error", details: String(err) },
      { status: 500 }
    );
  }
}

