import React from "react";
import { getSiteData } from "@/lib/content";

export const metadata = {
  title: "Gallery — “Beyond the page...” | Clodagh Beresford Dunne",
  description:
    "Photographs of readings, awards, workshops, and literary appearances by Irish poet Clodagh Beresford Dunne.",
};

export default function GalleryPage() {
  const site = getSiteData();

  return (
    <div className="py-12">
      {/* Signature Scrolling-Style Display Banner from cbd-gallery.png */}
      <div className="overflow-hidden border-y border-stone-300/80 bg-white/80 py-8">
        <p className="whitespace-nowrap text-center text-4xl tracking-tight text-stone-950 sm:text-6xl md:text-7xl">
          “Beyond the page.....” * “Beyond the page.....” * “Beyond the
          page.....”
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-14 pb-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {site.gallery.map((item) => (
            <figure
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-sm border border-stone-300 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={item.src}
                  alt={item.caption}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="p-6">
                <h2 className="text-xl font-semibold text-stone-950">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  {item.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

