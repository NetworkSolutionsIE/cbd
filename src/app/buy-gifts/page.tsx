import React from "react";
import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";
import { getGiftCategories } from "@/lib/content";
import GiftItemCard from "@/components/GiftItemCard";

export const metadata = {
  title: "Buy & Gifts â€” Framed Signed Poems, Broadsides & Gift Tokens | Clodagh Beresford Dunne",
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
          Every print and gift token is personally signed by Clodagh Beresford Dunne.
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
                <GiftItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

