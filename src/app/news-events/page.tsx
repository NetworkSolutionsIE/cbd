import React from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { getSiteData } from "@/lib/content";

export const metadata = {
  title: "News & Events — Clodagh Beresford Dunne Poet",
  description:
    "Upcoming poetry workshops, Leaving Certificate courses, readings, and recent publications by Clodagh Beresford Dunne.",
};

export default function NewsEventsPage() {
  const site = getSiteData();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
          Updates &amp; Calendar
        </span>
        <h1 className="mt-2 text-5xl text-stone-950 sm:text-6xl">
          News &amp; Events
        </h1>
        <p className="mt-3 text-lg italic text-stone-700">
          Upcoming courses, full-day workshops, public readings, and recent
          journal publications.
        </p>
      </div>

      <div className="mt-14 space-y-8">
        {site.newsEvents.map((event) => (
          <article
            key={event.id}
            className="rounded-sm border border-stone-300 bg-white p-8 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-xs bg-[#f5efe2] px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest text-[#8a6a28]">
                {event.category}
              </span>
              <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-stone-600">
                <Calendar className="h-3.5 w-3.5 text-[#9a7b38]" />
                <span>{event.date}</span>
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-stone-950 sm:text-3xl">
              {event.title}
            </h2>

            <div className="mt-2 flex items-center gap-1.5 text-sm text-stone-600">
              <MapPin className="h-4 w-4 text-[#9a7b38]" />
              <span>{event.location}</span>
            </div>

            <p className="mt-4 text-base leading-relaxed text-stone-700">
              {event.summary}
            </p>

            <div className="mt-6">
              <Link
                href={event.ctaLink}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#9a7b38]"
              >
                <span>{event.ctaText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

