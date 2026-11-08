import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Gift, BookOpen, CreditCard } from "lucide-react";
import { getGiftCategories, getGiftCategoryBySlug } from "@/lib/content";

export async function generateStaticParams() {
  return getGiftCategories().map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function GiftCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allCategories = getGiftCategories();
  const category = getGiftCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      {/* Top Breadcrumb */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/buy-gifts"
          className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-stone-700 hover:text-stone-950"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All ‘Buy &amp; Gifts’ Collections</span>
        </Link>
      </div>

      {/* Category Switcher Pills */}
      <div className="mb-12 flex flex-wrap gap-2.5 border-b border-stone-300 pb-6">
        {allCategories.map((cat) => {
          const active = cat.slug === category.slug;
          return (
            <Link
              key={cat.slug}
              href={`/buy-gifts/${cat.slug}`}
              className={`rounded-full px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest transition ${
                active
                  ? "bg-stone-900 text-white"
                  : "border border-stone-300 bg-white text-stone-700 hover:border-stone-800 hover:text-stone-950"
              }`}
            >
              {cat.categoryTitle}
            </Link>
          );
        })}
      </div>

      {/* Category Heading */}
      <div className="mb-12 max-w-3xl">
        <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
          <Gift className="h-4 w-4" />
          <span>Buy &amp; Gifts</span>
        </div>
        <h1 className="mt-2 text-4xl font-semibold uppercase tracking-wide text-stone-950 sm:text-5xl">
          {category.categoryTitle}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">
          {category.description}
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {category.items.map((item) => (
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

              <h2 className="mt-4 text-2xl font-semibold text-stone-950">
                {item.title}
              </h2>
              <p className="mt-1 text-sm italic text-[#9a7b38]">
                {item.subtitle}
              </p>

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
    </div>
  );
}

