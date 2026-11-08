import React from "react";
import Link from "next/link";
import { Award, ArrowRight, Quote } from "lucide-react";
import { getSiteData } from "@/lib/content";

export const metadata = {
  title: "About — Clodagh Beresford Dunne Poet",
  description:
    "Biography of award-winning Irish poet Clodagh Beresford Dunne, born in Dublin and raised in Dungarvan, Co. Waterford.",
};

export default function AboutPage() {
  const site = getSiteData();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
      {/* Circular Portrait matching cbd-about.png */}
      <div className="flex justify-center">
        <div className="h-64 w-64 overflow-hidden rounded-full border-4 border-white shadow-xl sm:h-72 sm:w-72">
          <img
            src={site.home.portraitImage}
            alt={site.home.portraitAlt}
            className="h-full w-full object-cover grayscale"
          />
        </div>
      </div>

      {/* Centered Literary Biography matching cbd-about.png */}
      <div className="mx-auto mt-12 max-w-3xl space-y-6 text-center text-lg leading-relaxed text-stone-900 sm:text-[19px]">
        {site.about.paragraphs.map((p, idx) => (
          <p key={idx}>
            {idx === 0 ? (
              <>
                <strong className="font-semibold">
                  Award-winning Irish Poet, Clodagh Beresford Dunne
                </strong>{" "}
                {p.replace(
                  /^Award-winning Irish Poet, Clodagh Beresford Dunne\s*/,
                  ""
                )}
              </>
            ) : (
              p
            )}
          </p>
        ))}
      </div>

      {/* Career & Award Highlights */}
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {site.about.highlights.map((item, idx) => (
          <div
            key={idx}
            className="rounded-sm border border-stone-300 bg-white/95 p-6 shadow-2xs"
          >
            <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
              <Award className="h-4 w-4" />
              <span>{item.year}</span>
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">
              {item.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Selected Critical Praise on About Page */}
      <div className="mt-16 space-y-6 border-t border-stone-300 pt-12">
        <h2 className="text-center text-3xl text-stone-950">Critical Praise</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {site.testimonials.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className="rounded-sm border border-stone-200 bg-white p-6 shadow-2xs"
            >
              <Quote className="h-5 w-5 text-[#9a7b38]" />
              <p className="mt-3 text-base italic leading-relaxed text-stone-800">
                “{t.quote}”
              </p>
              <p className="mt-3 text-sm font-semibold text-stone-900">
                — {t.author}
              </p>
              {t.role && (
                <p className="text-xs text-stone-500">{t.role}</p>
              )}
            </div>
          ))}
        </div>

        <div className="pt-6 text-center">
          <Link
            href="/work-with-me"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3 font-sans text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#9a7b38]"
          >
            <span>Explore Courses, Workshops &amp; Bookings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

