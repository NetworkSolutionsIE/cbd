import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, BookOpen, CreditCard } from "lucide-react";
import type { GiftItem } from "@/lib/content";

export default function GiftItemCard({ item }: { item: GiftItem }) {
  const soldOut = item.inStock === false;

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-sm border border-stone-300 bg-white p-8 shadow-sm transition hover:shadow-md">
      <div>
        {soldOut && (
          <div
            role="status"
            className="-mx-8 -mt-8 mb-6 bg-[#9b2c2c] px-8 py-2.5 text-center font-sans text-xs font-bold uppercase tracking-[0.2em] text-white"
          >
            {item.statusLabel || "Sold out at the moment"}
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <span className="rounded-xs bg-[#f5efe2] px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-[#8a6a28]">
            {item.edition}
          </span>
          <span
            className={`font-sans text-lg font-bold ${
              soldOut ? "text-stone-400 line-through" : "text-stone-950"
            }`}
          >
            {item.price}
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold text-stone-950">
          {item.title}
        </h3>
        <p className="mt-1 text-sm italic text-[#9a7b38]">{item.subtitle}</p>

        <div className="my-5 rounded-xs border-4 border-double border-stone-300 bg-[#faf9f6] p-4 text-left shadow-inner">
          <p className="font-serif text-sm italic leading-relaxed text-stone-800">
            {item.poemPreview}
          </p>
          <p className="mt-2 text-right font-serif text-xs text-stone-500">
            — Clodagh Beresford Dunne
          </p>
        </div>

        <p className="text-sm leading-relaxed text-stone-700">
          {item.description}
        </p>

        <ul className="mt-4 space-y-2">
          {item.features.map((feat, fIdx) => (
            <li
              key={fIdx}
              className="flex items-start gap-2 text-xs text-stone-700"
            >
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9a7b38]" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 space-y-2.5 border-t border-stone-200 pt-5">
        {soldOut ? (
          <span
            aria-disabled="true"
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-stone-300 px-5 py-3 font-sans text-xs font-bold uppercase tracking-widest text-stone-600"
          >
            <span>{item.statusLabel || "Sold out at the moment"}</span>
          </span>
        ) : (
          <Link
            href={`/checkout?item=${encodeURIComponent(item.id)}`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0070ba] px-5 py-3 font-sans text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#003087]"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Buy Now with PayPal ({item.price})</span>
          </Link>
        )}

        <Link
          href={`/contact?subject=${encodeURIComponent(
            `${soldOut ? "Availability" : "Order / Purchase"} Enquiry: ${item.title}`
          )}&offering=${encodeURIComponent(`${item.title} (${item.price})`)}`}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-stone-800 transition hover:border-stone-900 hover:bg-stone-50"
        >
          <span>{soldOut ? "Ask About Availability" : "Ask a Question / Enquire"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {item.poemSlug && (
          <Link
            href={`/poems/${item.poemSlug}`}
            className="flex w-full items-center justify-center gap-1.5 py-1 font-sans text-xs text-stone-600 hover:text-stone-950"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Read Full Poem Online</span>
          </Link>
        )}
      </div>
    </div>
  );
}
