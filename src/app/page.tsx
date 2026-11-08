import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Gift, Quote } from "lucide-react";
import {
  getSiteData,
  getPoems,
  getOfferingCategories,
  getGiftCategories,
} from "@/lib/content";

export default function HomePage() {
  const site = getSiteData();
  const featuredPoems = getPoems().slice(0, 4);
  const offerings = getOfferingCategories();
  const gifts = getGiftCategories();

  return (
    <div>
      {/* HERO & WELCOME SECTION (Faithful to original cbd_home.png) */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20 lg:px-10 lg:pt-20">
        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Center-Left Heading */}
          <div className="text-center lg:col-span-8 lg:col-start-2">
            <h1 className="text-5xl leading-[1.08] font-normal tracking-tight text-stone-950 sm:text-6xl md:text-7xl">
              I’m Clodagh
              <br />
              Beresford Dunne.
            </h1>
            <p className="mt-4 text-2xl italic text-[#9a7b38] sm:text-3xl">
              {site.home.heroSubheading}
            </p>
          </div>

          {/* Diamond Portrait */}
          <div className="flex justify-center lg:col-span-3">
            <div className="h-56 w-56 sm:h-64 sm:w-64 overflow-hidden shadow-xl diamond-portrait bg-stone-300">
              <img
                src={site.home.portraitImage}
                alt={site.home.portraitAlt}
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </div>
        </div>

        {/* Welcome Calligraphic Graphic & Paragraphs */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="-ml-4 mb-2">
            <img
              src="/images/site/welcome.png"
              alt="Welcome"
              className="h-16 w-auto object-contain sm:h-20"
            />
          </div>

          <div className="space-y-5 pl-4 sm:pl-12 text-lg leading-relaxed italic text-stone-900 sm:text-xl">
            <p>
              <strong className="font-semibold">
                I’m a Poet and a Poetry and Creative Writing Teacher.
              </strong>{" "}
              Since 2009 my poems have been published in newspapers, literary
              journals, magazines and anthologies in Ireland, The UK, Austria,
              America and Australia and they’ve been broadcast on TV, radio and
              online podcasts in Ireland and America.
            </p>
            <p>
              In 2016 I received the Arts Council of Ireland Emerging Writer
              Award and in 2017 my poem{" "}
              <Link
                href="/poems/seven-sugar-cubes"
                className="not-italic font-semibold underline decoration-[#9a7b38] underline-offset-4 hover:text-[#9a7b38]"
              >
                SEVEN SUGAR CUBES
              </Link>{" "}
              was voted Irish Poem of the Year at the Bord Gáis Energy Irish
              Book Awards. In 2019 Edna O’Brien DBE selected me for the UK
              Clarissa Luard Emerging Writer Award. I’ve also given public
              readings of my poems in several universities in America and at
              public events and festivals in Ireland and the UK.
            </p>
            <p>
              When I’m not writing or teaching I’m fully immersed in motherhood
              and busy family life with my husband and our four children (aged
              21, 18, 15 and 15). We live in the beautiful harbour town of
              Dungarvan, Co. Waterford in the southeast of Ireland (where I was
              born and raised).
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED PRAISE BANNER */}
      <section className="border-y border-stone-300/80 bg-white/75 py-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Quote className="mx-auto h-7 w-7 text-[#9a7b38]" />
          <blockquote className="mt-3 text-2xl italic leading-relaxed text-stone-900 sm:text-3xl">
            “Here is a brilliant writer. She is a young poet with an old soul.
            By that I mean she has ancient wisdom and thrust but also a modern,
            searching, brave sensibility. Clodagh Beresford Dunne is a writer in
            love with language.”
          </blockquote>
          <p className="mt-3 font-sans text-xs font-bold uppercase tracking-widest text-stone-600">
            — Edna O’Brien DBE
          </p>
        </div>
      </section>

      {/* WORK WITH ME SHOWCASE (All 8 Categories + Featured Upcoming Adverts) */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-stone-300 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
              <Sparkles className="h-4 w-4" />
              <span>Work With Me</span>
            </div>
            <h2 className="mt-1 text-4xl text-stone-950 sm:text-5xl">
              Courses, Retreats, Workshops &amp; Bookings
            </h2>
          </div>
          <Link
            href="/work-with-me"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#9a7b38]"
          >
            <span>Explore All 8 Offerings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map((cat) => (
            <Link
              key={cat.slug}
              href={`/work-with-me/${cat.slug}`}
              className="group flex flex-col justify-between rounded-sm border border-stone-300/90 bg-white/95 p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-[#9a7b38] hover:shadow-md"
            >
              <div>
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#9a7b38]">
                  Work With Me
                </span>
                <h3 className="mt-2 text-2xl leading-snug font-semibold text-stone-900 group-hover:text-[#9a7b38]">
                  {cat.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-stone-600">
                  {cat.tagline}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-[#9a7b38]">
                <span>View Details &amp; Book</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POEMS REPOSITORY PREVIEW */}
      <section className="bg-white/60 py-20 border-y border-stone-300/70">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
                <BookOpen className="h-4 w-4" />
                <span>Published Work Repository</span>
              </div>
              <h2 className="mt-1 text-4xl text-stone-950 sm:text-5xl">
                Selected Poems
              </h2>
            </div>
            <Link
              href="/poems"
              className="inline-flex items-center gap-2 rounded-full border border-stone-900 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-stone-900 transition hover:bg-stone-900 hover:text-white"
            >
              <span>Read All 19 Poems</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {featuredPoems.map((poem) => (
              <div
                key={poem.id}
                className="poem-card-polygon flex flex-col items-center justify-center bg-white px-10 py-10 text-center shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-2xl italic tracking-wide uppercase text-stone-900">
                  {poem.title}
                </h3>
                <div className="my-4 h-px w-48 bg-stone-700" />
                {poem.subtitle ? (
                  <p className="mb-4 text-sm italic text-stone-700">
                    {poem.subtitle}
                  </p>
                ) : (
                  <p className="mb-4 text-sm italic text-stone-600">
                    {poem.description}
                  </p>
                )}
                <Link
                  href={`/poems/${poem.slug}`}
                  className="mt-1 inline-flex w-48 items-center justify-center rounded-full bg-stone-950 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#9a7b38]"
                >
                  Read Poem
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUY & GIFTS SECTION PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-stone-300 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
              <Gift className="h-4 w-4" />
              <span>Buy &amp; Gifts</span>
            </div>
            <h2 className="mt-1 text-4xl text-stone-950 sm:text-5xl">
              Signed Limited Editions, Broadsides &amp; Gift Tokens
            </h2>
          </div>
          <Link
            href="/buy-gifts"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#9a7b38]"
          >
            <span>Visit the Gift Shop</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {gifts.map((cat) => (
            <Link
              key={cat.slug}
              href={`/buy-gifts/${cat.slug}`}
              className="group flex flex-col justify-between rounded-sm border border-stone-300 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9a7b38] hover:shadow-md"
            >
              <div>
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#9a7b38]">
                  Collector’s &amp; Gift Edition
                </span>
                <h3 className="mt-2 text-2xl font-semibold text-stone-900 group-hover:text-[#9a7b38]">
                  {cat.categoryTitle}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-stone-600">
                  {cat.tagline}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-stone-200 pt-4 font-sans text-xs font-bold uppercase tracking-widest text-stone-900 group-hover:text-[#9a7b38]">
                <span>Explore {cat.shortTitle}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

