import React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, CheckCircle2, Quote, ArrowRight, Phone, CreditCard } from "lucide-react";
import { OfferingItem, parsePriceEur } from "@/lib/content";

const THEME_STYLES: Record<
  OfferingItem["advert"]["colorTheme"],
  {
    posterBg: string;
    posterBorder: string;
    badgeBg: string;
    accentText: string;
    divider: string;
    priceBadge: string;
  }
> = {
  sky: {
    posterBg: "bg-gradient-to-b from-[#f4f8fb] via-white to-[#edf4f9]",
    posterBorder: "border-[#9bc0d9]",
    badgeBg: "bg-[#2b6288] text-white",
    accentText: "text-[#1e4e6f]",
    divider: "border-[#b8d3e6]",
    priceBadge: "bg-[#1e4e6f] text-white",
  },
  slate: {
    posterBg: "bg-gradient-to-b from-[#5d686e] via-[#687379] to-[#556066] text-white",
    posterBorder: "border-[#454f54]",
    badgeBg: "bg-[#e8d282] text-stone-900",
    accentText: "text-[#f2df96]",
    divider: "border-white/25",
    priceBadge: "bg-[#f2df96] text-stone-950",
  },
  amber: {
    posterBg: "bg-gradient-to-b from-[#fdfaf3] via-white to-[#f7efe0]",
    posterBorder: "border-[#d8c093]",
    badgeBg: "bg-[#8a6a28] text-white",
    accentText: "text-[#785a1e]",
    divider: "border-[#e4d3b2]",
    priceBadge: "bg-[#785a1e] text-white",
  },
  emerald: {
    posterBg: "bg-gradient-to-b from-[#f3f9f6] via-white to-[#e8f3ee]",
    posterBorder: "border-[#9ec5b2]",
    badgeBg: "bg-[#275943] text-white",
    accentText: "text-[#1e4735]",
    divider: "border-[#bdd9cb]",
    priceBadge: "bg-[#1e4735] text-white",
  },
  rose: {
    posterBg: "bg-gradient-to-b from-[#fcf5f6] via-white to-[#f7ebed]",
    posterBorder: "border-[#d9b2b8]",
    badgeBg: "bg-[#7a3642] text-white",
    accentText: "text-[#632833]",
    divider: "border-[#e6c8cd]",
    priceBadge: "bg-[#632833] text-white",
  },
  violet: {
    posterBg: "bg-gradient-to-b from-[#f7f5fb] via-white to-[#efeaf7]",
    posterBorder: "border-[#bdb2d9]",
    badgeBg: "bg-[#493870] text-white",
    accentText: "text-[#3b2b5e]",
    divider: "border-[#d2cae8]",
    priceBadge: "bg-[#3b2b5e] text-white",
  },
};

export default function OfferingBreakdown({ item }: { item: OfferingItem }) {
  const theme = THEME_STYLES[item.advert.colorTheme] || THEME_STYLES.sky;
  const isDarkPoster = item.advert.colorTheme === "slate";
  const priceEur = parsePriceEur(item.advert.price);

  return (
    <article className="rounded-sm border border-stone-300/90 bg-white/95 p-6 shadow-md sm:p-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* PART 1: COLOUR-CODED ADVERT POSTER (Left 5 Columns) */}
        <div className="lg:col-span-5">
          <div
            className={`relative flex h-full flex-col justify-between rounded-sm border-2 p-6 shadow-lg sm:p-8 ${theme.posterBg} ${theme.posterBorder}`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-block rounded-xs px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-widest ${theme.badgeBg}`}
                >
                  {item.advert.badge}
                </span>
                <span
                  className={`rounded-xs px-3 py-1 font-sans text-xs font-bold tracking-wide ${theme.priceBadge}`}
                >
                  {item.advert.price}
                </span>
              </div>

              {/* Open Book & Autumn Leaves Emblem */}
              {item.advert.emblemImage && (
                <div className="my-5 flex justify-center">
                  <div className="overflow-hidden rounded-xs border border-black/10 shadow-sm">
                    <img
                      src={item.advert.emblemImage}
                      alt={item.advert.heading}
                      className="h-36 w-48 object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="text-center">
                <h3
                  className={`text-xl font-bold uppercase tracking-wide sm:text-2xl ${
                    isDarkPoster ? "text-white" : "text-stone-900"
                  }`}
                >
                  {item.advert.heading}
                </h3>
                <p
                  className={`mt-1.5 text-lg font-semibold ${theme.accentText}`}
                >
                  {item.advert.subheading}
                </p>
                <p
                  className={`mt-1 font-sans text-xs font-semibold uppercase tracking-widest ${
                    isDarkPoster ? "text-stone-200" : "text-stone-600"
                  }`}
                >
                  {item.advert.facilitator}
                </p>
              </div>

              <div className={`my-5 border-t ${theme.divider}`} />

              <div
                className={`space-y-2.5 text-left text-sm ${
                  isDarkPoster ? "text-stone-100" : "text-stone-800"
                }`}
              >
                <p className="font-sans text-xs font-bold uppercase tracking-wider">
                  {item.advert.level}
                </p>
                <div className="flex items-start gap-2.5">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                  <span>
                    <strong>DATE:</strong> {item.advert.date}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                  <span>
                    <strong>VENUE:</strong> {item.advert.venue}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                  <span>
                    <strong>TIME:</strong> {item.advert.time}
                  </span>
                </div>
              </div>
            </div>

            <div className={`mt-6 border-t pt-4 text-xs ${theme.divider}`}>
              <p
                className={`italic ${
                  isDarkPoster ? "text-stone-200" : "text-stone-600"
                }`}
              >
                {item.advert.notes}
              </p>
              <p
                className={`mt-2 font-sans font-semibold ${theme.accentText}`}
              >
                To Book: {item.advert.bookingContact}
              </p>
            </div>
          </div>
        </div>

        {/* PARTS 2, 3 & 4: LONGER DESCRIPTION + BOOK NOW, PHOTOS, TESTIMONIALS (Right 7 Columns) */}
        <div className="flex flex-col justify-between space-y-8 lg:col-span-7">
          {/* PART 2: LONGER DESCRIPTION + BOOK NOW */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <h2 className="text-2xl text-stone-900 sm:text-3xl">
                {item.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {priceEur !== null && (
                  <Link
                    href={`/checkout?item=${encodeURIComponent(item.id)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0070ba] px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-white shadow-xs transition hover:bg-[#003087]"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Book &amp; Pay (€{priceEur})</span>
                  </Link>
                )}
                <Link
                  href={`/contact?subject=${encodeURIComponent(
                    item.bookingSubject
                  )}&offering=${encodeURIComponent(item.title)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-white shadow-xs transition hover:bg-[#9a7b38]"
                >
                  <span>{priceEur !== null ? "Enquire / Book" : "Book Now"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {item.bookingPhone && (
                  <a
                    href={`https://wa.me/353${item.bookingPhone
                      .replace(/\s+/g, "")
                      .replace(/^0/, "")}?text=${encodeURIComponent(
                      `Hi Clodagh, I'd like to enquire about booking: ${item.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-400 px-4 py-2 font-sans text-xs font-semibold text-stone-800 transition hover:border-stone-900 hover:bg-stone-100"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>WhatsApp / Text {item.bookingPhone}</span>
                  </a>
                )}
              </div>
            </div>

            <p className="mt-4 text-base leading-relaxed text-stone-700 sm:text-[17px]">
              {item.longDescription}
            </p>

            <ul className="mt-5 space-y-2.5">
              {item.bullets.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-[15.5px] text-stone-800"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#9a7b38]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PART 3: PHOTOS (3-Photo Strip per sketch) */}
          {item.photos && item.photos.length > 0 && (
            <div>
              <h4 className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-stone-500">
                Photos &amp; Moments
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {item.photos.map((photo, idx) => (
                  <figure
                    key={idx}
                    className="group overflow-hidden rounded-xs border border-stone-200 bg-stone-50"
                  >
                    <div className="aspect-4/3 overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="p-2.5 text-xs leading-snug text-stone-600">
                      {photo.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* PART 4: TESTIMONIALS */}
          {item.testimonials && item.testimonials.length > 0 && (
            <div className="rounded-xs border-l-4 border-[#9a7b38] bg-[#f8f6f2] p-5">
              <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
                <Quote className="h-4 w-4" />
                <span>Testimonials &amp; Praise</span>
              </div>
              <div className="mt-3 space-y-4">
                {item.testimonials.map((t, idx) => (
                  <blockquote key={idx} className="text-sm text-stone-800">
                    <p className="italic leading-relaxed">“{t.quote}”</p>
                    <footer className="mt-1 font-medium text-stone-700">
                      — {t.author}
                      {t.role ? (
                        <span className="text-stone-500">, {t.role}</span>
                      ) : null}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

