"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Lock,
} from "lucide-react";
import {
  getAllPurchasableItems,
  getPoems,
  getSiteData,
  PurchasableCatalogItem,
} from "@/lib/content";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        style?: Record<string, string | number>;
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError?: (err: unknown) => void;
      }) => {
        render: (container: HTMLElement | null) => Promise<void>;
      };
    };
  }
}

const GIFT_DENOMINATIONS = [50, 75, 100, 120, 150, 200];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catalog = getAllPurchasableItems();
  const poems = getPoems();
  const site = getSiteData();

  const initialItemId = searchParams.get("item") || catalog[0]?.id || "";
  const wasCancelled = searchParams.get("cancelled") === "1";

  const [selectedItemId, setSelectedItemId] = useState<string>(initialItemId);
  const selectedItem: PurchasableCatalogItem =
    catalog.find((c) => c.id === selectedItemId) || catalog[0];

  const [customUnitPrice, setCustomUnitPrice] = useState<number>(
    selectedItem?.unitPriceEur || 50
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [poemChoice, setPoemChoice] = useState(poems[0]?.title || "");
  const [dedicationNotes, setDedicationNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    wasCancelled
      ? "PayPal checkout was cancelled. You can review your details below and try again whenever you are ready."
      : null
  );

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const paypalContainerRef = useRef<HTMLDivElement | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    const found = catalog.find((c) => c.id === selectedItemId);
    if (found) {
      setCustomUnitPrice(found.unitPriceEur);
    }
  }, [selectedItemId]);

  const effectiveUnitPrice = selectedItem?.allowCustomAmount
    ? Math.max(10, Number(customUnitPrice) || 50)
    : selectedItem?.unitPriceEur || 50;

  const totalEur =
    Math.round(effectiveUnitPrice * Math.max(1, quantity) * 100) / 100;

  // Load PayPal JS SDK if NEXT_PUBLIC_PAYPAL_CLIENT_ID is configured
  useEffect(() => {
    if (!paypalClientId) return;
    if (window.paypal) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      paypalClientId
    )}&currency=EUR&intent=capture`;
    script.async = true;
    script.onload = () => setSdkLoaded(true);
    document.body.appendChild(script);
  }, [paypalClientId]);

  // Render Smart Payment Buttons when SDK is ready & required fields are filled
  useEffect(() => {
    if (
      !sdkLoaded ||
      !window.paypal ||
      !paypalContainerRef.current ||
      !customerName.trim() ||
      !customerEmail.trim()
    ) {
      return;
    }

    paypalContainerRef.current.innerHTML = "";
    let createdConvexOrderId = "";

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "pill",
          label: "paypal",
        },
        createOrder: async () => {
          setErrorMsg(null);
          // 1. Create pending order in Convex
          const orderRes = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              itemId: selectedItem.id,
              itemTitle: selectedItem.title,
              itemType: selectedItem.itemType,
              unitPriceEur: effectiveUnitPrice,
              quantity,
              customerName,
              customerEmail,
              customerPhone: customerPhone.trim() || undefined,
              shippingAddress: shippingAddress.trim() || undefined,
              poemChoice: selectedItem.allowPoemChoice ? poemChoice : undefined,
              dedicationNotes: dedicationNotes.trim() || undefined,
              paymentMethod: "paypal_sdk",
              status: "pending_payment",
            }),
          });
          const orderData = await orderRes.json();
          if (!orderRes.ok) {
            throw new Error(orderData.error || "Could not create order");
          }
          createdConvexOrderId = orderData.orderId;

          // 2. Create PayPal v2 order
          const ppRes = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              itemTitle: selectedItem.title,
              totalEur,
              convexOrderId: createdConvexOrderId,
            }),
          });
          const ppData = await ppRes.json();
          if (!ppRes.ok || !ppData.id) {
            throw new Error("Could not initialize PayPal order");
          }
          return ppData.id;
        },
        onApprove: async (data) => {
          setSubmitting(true);
          const capRes = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paypalOrderId: data.orderID,
              convexOrderId: createdConvexOrderId,
            }),
          });
          if (!capRes.ok) {
            setSubmitting(false);
            setErrorMsg("Payment capture failed. Please contact Clodagh.");
            return;
          }
          router.push(
            `/checkout/success?orderId=${encodeURIComponent(
              createdConvexOrderId
            )}&paypalOrderId=${encodeURIComponent(data.orderID)}`
          );
        },
        onError: () => {
          setErrorMsg(
            "PayPal encountered an error. You can also use the Standard PayPal Checkout button below."
          );
        },
      })
      .render(paypalContainerRef.current);
  }, [
    sdkLoaded,
    selectedItem,
    effectiveUnitPrice,
    quantity,
    totalEur,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    poemChoice,
    dedicationNotes,
    router,
  ]);

  const handleStandardPayPalCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedItem.id,
          itemTitle: selectedItem.title,
          itemType: selectedItem.itemType,
          unitPriceEur: effectiveUnitPrice,
          quantity,
          customerName,
          customerEmail,
          customerPhone: customerPhone.trim() || undefined,
          shippingAddress: shippingAddress.trim() || undefined,
          poemChoice: selectedItem.allowPoemChoice ? poemChoice : undefined,
          dedicationNotes: dedicationNotes.trim() || undefined,
          paymentMethod: "paypal_standard",
          status: "pending_payment",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.paypalCheckoutUrl) {
        throw new Error(data.error || "Could not start PayPal checkout.");
      }

      window.location.href = data.paypalCheckoutUrl;
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to initialize checkout."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={
            selectedItem?.itemType === "course" ? "/work-with-me" : "/buy-gifts"
          }
          className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-stone-700 hover:text-stone-950"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            Back to{" "}
            {selectedItem?.itemType === "course"
              ? "Courses & Workshops"
              : "Buy & Gifts"}
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-stone-600">
          <Lock className="h-3.5 w-3.5 text-[#9a7b38]" />
          <span>Secure PayPal Checkout in EUR (€)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left 7 Columns: Customer & Order Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleStandardPayPalCheckout}
            className="space-y-6 rounded-sm border border-stone-300 bg-white p-6 shadow-xs sm:p-8"
          >
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
                Online Booking &amp; Gift Store
              </span>
              <h1 className="mt-1 text-3xl font-semibold text-stone-950 sm:text-4xl">
                Complete Your Order
              </h1>
              <p className="mt-1 text-sm text-stone-600">
                Pay securely via PayPal or Debit/Credit Card. Your order details
                are logged directly with Clodagh Beresford Dunne.
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-xs border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Item Selector */}
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                Selected Course, Workshop or Gift *
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="mt-1.5 w-full rounded-xs border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-[#9a7b38] focus:bg-white focus:outline-hidden"
              >
                <optgroup label="Courses, Retreats & Workshops">
                  {catalog
                    .filter((i) => i.itemType === "course")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} — {item.priceDisplay}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Framed Signed Poems, Broadsides & Gift Tokens">
                  {catalog
                    .filter((i) => i.itemType === "gift")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} — {item.priceDisplay}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Custom Denomination Picker for Bespoke Gift Token */}
            {selectedItem?.allowCustomAmount && (
              <div className="rounded-xs border border-[#e4d3b2] bg-[#fdfaf3] p-4">
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-[#785a1e]">
                  Choose Gift Token Value (€ EUR) *
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {GIFT_DENOMINATIONS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCustomUnitPrice(amt)}
                      className={`rounded-full px-4 py-1.5 font-sans text-xs font-bold transition ${
                        customUnitPrice === amt
                          ? "bg-stone-900 text-white"
                          : "border border-stone-300 bg-white text-stone-800 hover:border-stone-900"
                      }`}
                    >
                      €{amt}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-stone-600">
                    Or enter custom amount (€):
                  </span>
                  <input
                    type="number"
                    min={25}
                    max={2000}
                    step={5}
                    value={customUnitPrice}
                    onChange={(e) =>
                      setCustomUnitPrice(Number(e.target.value) || 50)
                    }
                    className="w-28 rounded-xs border border-stone-300 bg-white px-2.5 py-1 text-sm font-semibold text-stone-900"
                  />
                </div>
              </div>
            )}

            {/* Poem Picker when ordering "Your Choice of Poem" */}
            {selectedItem?.allowPoemChoice && (
              <div className="rounded-xs border border-stone-200 bg-stone-50 p-4">
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                  Select Poem for Your Signed Print *
                </label>
                <select
                  value={poemChoice}
                  onChange={(e) => setPoemChoice(e.target.value)}
                  className="mt-1.5 w-full rounded-xs border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
                >
                  {poems.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                      {p.publication ? ` (${p.publication})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                  {selectedItem?.itemType === "course"
                    ? "Places / Sessions *"
                    : "Quantity *"}
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Jane Doe"
                  className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                  Email Address (for Receipt) *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900"
                />
              </div>
              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                  Phone / WhatsApp {selectedItem?.itemType === "course" ? "*" : "(Optional)"}
                </label>
                <input
                  type="tel"
                  required={selectedItem?.itemType === "course"}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="086 123 4567"
                  className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900"
                />
              </div>
            </div>

            {selectedItem?.itemType === "gift" && (
              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                  Delivery / Postal Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Full postal address including Eircode / Postcode (or write 'Digital PDF by Email' for digital gift tokens)"
                  className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900"
                />
              </div>
            )}

            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                {selectedItem?.itemType === "course"
                  ? "Participant / Student Notes (Optional)"
                  : "Personal Dedication / Framing Choice / Gift Message (Optional)"}
              </label>
              <textarea
                rows={3}
                value={dedicationNotes}
                onChange={(e) => setDedicationNotes(e.target.value)}
                placeholder={
                  selectedItem?.itemType === "course"
                    ? "E.g. student name, Higher/Ordinary Level, preferred January workshop date (Sat 23rd or Sun 24th Jan), or dietary requirements..."
                    : "E.g. 'For Sarah on her graduation', preferred frame finish (black, natural oak, or warm white), or recipient name for Gift Token..."
                }
                className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900"
              />
            </div>

            {/* PayPal Payment Buttons */}
            <div className="space-y-4 border-t border-stone-200 pt-6">
              {paypalClientId && customerName.trim() && customerEmail.trim() && (
                <div className="space-y-2">
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-stone-500">
                    Instant PayPal / Card Checkout
                  </p>
                  <div ref={paypalContainerRef} className="min-h-[48px]" />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#0070ba] px-6 py-3.5 font-sans text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-[#003087] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Redirecting to PayPal...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>
                      Pay €{totalEur.toFixed(2)} EUR with PayPal / Card
                    </span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-stone-500">
                You will be directed to PayPal’s secure checkout for{" "}
                <strong>{site.email}</strong> where you can pay using your
                PayPal balance or any major Debit / Credit Card.
              </p>
            </div>
          </form>
        </div>

        {/* Right 5 Columns: Order Summary Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6 rounded-sm border border-stone-300 bg-white/95 p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
                Order Summary
              </span>
              <span className="rounded-xs bg-stone-100 px-2.5 py-1 font-sans text-[11px] font-bold uppercase text-stone-700">
                {selectedItem?.categoryTitle}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-stone-950">
                {selectedItem?.title}
              </h2>
              <p className="mt-1 text-sm italic text-stone-600">
                {selectedItem?.subtitle}
              </p>
              {selectedItem?.allowPoemChoice && poemChoice && (
                <p className="mt-2 rounded-xs bg-[#f5efe2] px-3 py-1.5 text-xs font-medium text-[#785a1e]">
                  Selected Poem: <strong>‘{poemChoice}’</strong>
                </p>
              )}
            </div>

            <div className="space-y-2.5 border-y border-stone-200 py-4 text-sm">
              <div className="flex justify-between text-stone-700">
                <span>Unit Price</span>
                <span className="font-semibold">
                  €{effectiveUnitPrice.toFixed(2)} EUR
                </span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>
                  {selectedItem?.itemType === "course" ? "Places" : "Quantity"}
                </span>
                <span className="font-semibold">× {quantity}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-lg font-bold text-stone-950">
                <span>Total Due</span>
                <span className="text-[#0070ba]">
                  €{totalEur.toFixed(2)} EUR
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-stone-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7b38]" />
                <span>
                  {selectedItem?.itemType === "course"
                    ? "Your place is reserved upon payment and Clodagh will email you full course details and directions."
                    : "Personally hand-signed by Clodagh Beresford Dunne in Dungarvan, Co. Waterford and carefully packaged."}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0070ba]" />
                <span>
                  Protected by PayPal Buyer Protection. No card details are ever
                  stored on this website.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7b38]" />
                <span>
                  Questions before ordering? Email{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="underline hover:text-stone-950"
                  >
                    {site.email}
                  </a>{" "}
                  or WhatsApp {site.phone}.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

