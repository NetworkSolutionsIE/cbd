import { NextResponse } from "next/server";

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
    const { itemTitle, totalEur, convexOrderId } = (await request.json()) as {
      itemTitle: string;
      totalEur: number;
      convexOrderId?: string;
    };

    const accessToken = await getPayPalAccessToken();

    const orderRes = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: convexOrderId || undefined,
            description: itemTitle.slice(0, 125),
            amount: {
              currency_code: "EUR",
              value: Number(totalEur).toFixed(2),
            },
          },
        ],
      }),
    });

    const data = await orderRes.json();
    if (!orderRes.ok) {
      return NextResponse.json(
        { error: "Failed to create PayPal order", details: data },
        { status: orderRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "PayPal order creation error", details: String(err) },
      { status: 500 }
    );
  }
}
