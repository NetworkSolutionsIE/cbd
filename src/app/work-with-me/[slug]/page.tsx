import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import {
  getOfferingCategories,
  getOfferingCategoryBySlug,
} from "@/lib/content";
import OfferingBreakdown from "@/components/OfferingBreakdown";

export async function generateStaticParams() {
  return getOfferingCategories().map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function OfferingCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allCategories = getOfferingCategories();
  const category = getOfferingCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      {/* Top Breadcrumb & Category Switcher */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/work-with-me"
          className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-stone-700 hover:text-stone-950"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All ‘Work With Me’ Categories</span>
        </Link>

        <Link
          href="/buy-gifts/gift-tokens"
          className="font-sans text-xs font-semibold text-[#9a7b38] underline underline-offset-4 hover:text-stone-950"
        >
          Looking to gift a place? Gift Tokens available →
        </Link>
      </div>

      {/* Category Switcher Tabs */}
      <div className="mb-12 flex flex-wrap gap-2 border-b border-stone-300 pb-6">
        {allCategories.map((cat) => {
          const active = cat.slug === category.slug;
          return (
            <Link
              key={cat.slug}
              href={`/work-with-me/${cat.slug}`}
              className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider transition ${
                active
                  ? "bg-stone-900 text-white shadow-xs"
                  : "border border-stone-300 bg-white/80 text-stone-700 hover:border-stone-700 hover:text-stone-950"
              }`}
            >
              {cat.title}
            </Link>
          );
        })}
      </div>

      {/* Category Header */}
      <div className="mb-10 max-w-4xl">
        <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
          <Sparkles className="h-4 w-4" />
          <span>Work With Me</span>
        </div>
        <h1 className="mt-2 text-4xl font-semibold uppercase tracking-wide text-stone-950 sm:text-5xl">
          {category.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">
          {category.intro}
        </p>
      </div>

      {/* 4-Part Breakdown for Each Offering in this Category */}
      <div className="space-y-12">
        {category.items.map((item) => (
          <OfferingBreakdown key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

