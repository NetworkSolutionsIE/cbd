import React from "react";
import { getSiteData } from "@/lib/content";

export const metadata = {
  title: "Testimonials — Clodagh Beresford Dunne Poet",
  description:
    "Critical acclaim and testimonials for Irish poet Clodagh Beresford Dunne from Edna O'Brien, Thomas McCarthy, Jan Beatty, Melanie Almeder, Michael Paul Thomas, and schools.",
};

export default function TestimonialsPage() {
  const site = getSiteData();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <h1 className="text-center text-5xl text-stone-950 sm:text-6xl">
        Testimonials
      </h1>

      {/* 3-Column Card Grid faithful to cbd_Testimonials.png */}
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {site.testimonials.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between bg-white p-8 shadow-sm border border-stone-200/80"
          >
            <p className="text-[17px] leading-relaxed text-stone-900">
              “{item.quote}”
            </p>
            <div className="mt-6 pt-4 border-t border-stone-100">
              <p className="text-base font-medium text-stone-900">
                — {item.author}
              </p>
              {item.role && (
                <p className="mt-0.5 text-xs text-stone-600">{item.role}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

