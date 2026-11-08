import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { getOfferingCategories } from "@/lib/content";
import OfferingBreakdown from "@/components/OfferingBreakdown";

export const metadata = {
  title: "Work With Me — Courses, Retreats, Workshops & Bookings | Clodagh Beresford Dunne",
  description:
    "Adult courses & retreats, school student courses, poetry workshops, group & school visits, tailor-made events, one-to-one consultations, commissions, and public speaking bookings with award-winning poet Clodagh Beresford Dunne.",
};

export default function WorkWithMeIndexPage() {
  const categories = getOfferingCategories();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
          <Sparkles className="h-4 w-4" />
          <span>Work With Me</span>
        </div>
        <h1 className="mt-2 text-5xl text-stone-950 sm:text-6xl">
          Courses, Retreats, Workshops &amp; Bookings
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">
          With over 16 years of experience teaching poetry and creative writing
          to adults, university students, and secondary school students—and as
          an international festival reader and national prize adjudicator—Clodagh
          offers eight ways to work together.
        </p>
      </div>

      {/* Quick Category Jump Pills (All 8 Dropdowns) */}
      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/work-with-me/${cat.slug}`}
            className="rounded-full border border-stone-400/80 bg-white/90 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider text-stone-800 shadow-2xs transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
          >
            {cat.title}
          </Link>
        ))}
      </div>

      {/* All 8 Categories with their 4-Part Breakdown */}
      <div className="mt-16 space-y-20">
        {categories.map((cat, idx) => (
          <section
            key={cat.id}
            id={cat.slug}
            className="scroll-mt-24 space-y-8"
          >
            <div className="flex flex-col items-start justify-between gap-4 border-b-2 border-stone-800 pb-4 sm:flex-row sm:items-end">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
                  0{idx + 1} / Work With Me
                </span>
                <h2 className="mt-1 text-3xl font-semibold uppercase tracking-wide text-stone-950 sm:text-4xl">
                  {cat.title}
                </h2>
                <p className="mt-2 max-w-3xl text-base text-stone-700">
                  {cat.intro}
                </p>
              </div>
              <Link
                href={`/work-with-me/${cat.slug}`}
                className="inline-flex shrink-0 items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-[#9a7b38]"
              >
                <span>Dedicated Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-10">
              {cat.items.map((item) => (
                <OfferingBreakdown key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

