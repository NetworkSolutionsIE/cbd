import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Gift } from "lucide-react";
import { getGiftCategories, getGiftCategoryBySlug } from "@/lib/content";
import GiftItemCard from "@/components/GiftItemCard";

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
          <span>All â€˜Buy &amp; Giftsâ€™ Collections</span>
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
          <GiftItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

