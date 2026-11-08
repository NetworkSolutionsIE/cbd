"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Mail, Printer } from "lucide-react";
import { getSiteData } from "@/lib/content";
import type { OrderRecord } from "@/app/api/orders/route";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("custom") || "";
  const paypalOrderId =
    searchParams.get("paypalOrderId") || searchParams.get("tx") || "";
  const site = getSiteData();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function confirmAndLoad() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // Mark order as paid upon return from PayPal
        await fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: orderId,
            status: "paid",
            paypalOrderId: paypalOrderId || undefined,
          }),
        });

        const res = await fetch(
          `/api/orders?id=${encodeURIComponent(orderId)}`
        );
        const data = await res.json();
        if (data?.order) {
          setOrder(data.order);
        }
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    }

    confirmAndLoad();
  }, [orderId, paypalOrderId]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <div className="rounded-sm border border-stone-300 bg-white p-8 shadow-md sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <span className="mt-4 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
            Order &amp; Booking Confirmation
          </span>
          <h1 className="mt-2 text-4xl font-semibold text-stone-950">
            Thank You for Your Order
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-stone-700">
            Your PayPal payment and order details have been logged with Clodagh
            Beresford Dunne. Clodagh will be in touch shortly to confirm your{" "}
            {order?.itemType === "course"
              ? "course/workshop place and welcome notes"
              : "signed edition or gift token dispatch"}
            .
          </p>
        </div>

        {!loading && order && (
          <div className="mt-8 space-y-4 rounded-xs border border-stone-200 bg-[#faf9f6] p-6 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-stone-500">
                Order Reference: {order._id}
              </span>
              <span className="rounded-full bg-emerald-700 px-3 py-0.5 font-sans text-[11px] font-bold uppercase text-white">
                Paid via PayPal (€{order.totalEur.toFixed(2)} EUR)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-stone-500">Item</p>
                <p className="font-semibold text-stone-950">{order.itemTitle}</p>
                {order.poemChoice && (
                  <p className="text-xs italic text-[#9a7b38]">
                    Poem: ‘{order.poemChoice}’
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-stone-500">Customer</p>
                <p className="font-semibold text-stone-950">
                  {order.customerName}
                </p>
                <p className="text-xs text-stone-600">{order.customerEmail}</p>
              </div>
            </div>

            {order.shippingAddress && (
              <div>
                <p className="text-xs text-stone-500">Delivery Address</p>
                <p className="whitespace-pre-line text-stone-800">
                  {order.shippingAddress}
                </p>
              </div>
            )}

            {order.dedicationNotes && (
              <div>
                <p className="text-xs text-stone-500">
                  Dedication / Booking Notes
                </p>
                <p className="whitespace-pre-line italic text-stone-800">
                  “{order.dedicationNotes}”
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-stone-200 pt-6">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-stone-800 hover:border-stone-900"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Receipt</span>
          </button>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-stone-800 hover:border-stone-900"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Email Clodagh</span>
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-white hover:bg-[#9a7b38]"
          >
            <span>Return to Home</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading confirmation...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

