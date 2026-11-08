import React from "react";
import Link from "next/link";
import { Gift, CheckCircle2, ArrowRight, BookOpen, CreditCard } from "lucide-react";
import { getGiftCategories } from "@/lib/content";

export const metadata = {
  title: "Buy & Gifts — Framed Signed Poems, Broadsides & Gift Tokens | Clodagh Beresford Dunne",
  description:
    "Order framed signed limited edition poems, collector's signed broadsides, and redeemable gift tokens for courses, retreats, and consultations with Irish Poem of the Year winner Clodagh Beresford Dunne.",
};

export default function BuyGiftsIndexPage() {
  const categories = getGiftCategories();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
          <Gift className="h-4 w-4" />
          <span>Buy &amp; Gifts</span>
        </div>
        <h1 className="mt-2 text-5xl text-stone-950 sm:text-6xl">
          Signed Limited Editions, Broadsides &amp; Gift Tokens
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">
          Every print and gift token is personally signed by Clodagh Beresford
          Dunne in Dungarvan, Co. Waterford, with optional handwritten
          dedications for milestone gifts, weddings, bereavements, and literary
          collectors.
        </p>
      </div>

      {/* Category Jump Pills */}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/buy-gifts/${cat.slug}`}
            className="rounded-full border border-stone-400 bg-white px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest text-stone-800 shadow-2xs transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
          >
            {cat.categoryTitle}
          </Link>
        ))}
      </div>

      {/* All 3 Gift Categories */}
      <div className="mt-16 space-y-20">
        {categories.map((cat, idx) => (
          <section key={cat.id} className="space-y-8">
            <div className="flex flex-col items-start justify-between gap-4 border-b-2 border-stone-800 pb-4 sm:flex-row sm:items-end">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
                  0{idx + 1} / Buy &amp; Gifts
                </span>
                <h2 className="mt-1 text-3xl font-semibold uppercase tracking-wide text-stone-950 sm:text-4xl">
                  {cat.categoryTitle}
                </h2>
                <p className="mt-2 max-w-3xl text-base text-stone-700">
                  {cat.description}
                </p>
              </div>
              <Link
                href={`/buy-gifts/${cat.slug}`}
                className="inline-flex shrink-0 items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-[#9a7b38]"
              >
                <span>View Category Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-sm border border-stone-300 bg-white p-8 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-xs bg-[#f5efe2] px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-[#8a6a28]">
                        {item.edition}
                      </span>
                      <span className="font-sans text-lg font-bold text-stone-950">
                        {item.price}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold text-stone-950">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm italic text-[#9a7b38]">
                      {item.subtitle}
                    </p>

                    {/* Framed / Broadside Mockup Preview Box */}
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
                    <Link
                      href={`/checkout?item=${encodeURIComponent(item.id)}`}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0070ba] px-5 py-3 font-sans text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#003087]"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Buy Now with PayPal ({item.price})</span>
                    </Link>

                    <Link
                      href={`/contact?subject=${encodeURIComponent(
                        `Order / Purchase Enquiry: ${item.title}`
                      )}&offering=${encodeURIComponent(
                        `${item.title} (${item.price})`
                      )}`}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-stone-800 transition hover:border-stone-900 hover:bg-stone-50"
                    >
                      <span>Ask a Question / Enquire</span>
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
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

