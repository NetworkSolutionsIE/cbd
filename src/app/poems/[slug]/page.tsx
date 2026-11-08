import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Gift } from "lucide-react";
import { getPoems, getPoemBySlug } from "@/lib/content";

export async function generateStaticParams() {
  return getPoems().map((poem) => ({
    slug: poem.slug,
  }));
}

export default async function PoemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const poems = getPoems();
  const poem = getPoemBySlug(slug);

  if (!poem) {
    notFound();
  }

  const currentIndex = poems.findIndex((p) => p.id === poem.id);
  const prevPoem = currentIndex > 0 ? poems[currentIndex - 1] : null;
  const nextPoem =
    currentIndex < poems.length - 1 ? poems[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-10">
      {/* Top Breadcrumb */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/poems"
          className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-stone-700 transition hover:text-stone-950"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All 19 Poems</span>
        </Link>

        <Link
          href={`/contact?subject=${encodeURIComponent(
            `Framed Signed Edition / Broadside Enquiry: ${poem.title}`
          )}&offering=${encodeURIComponent(
            `Signed Print of '${poem.title}'`
          )}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-400 bg-white/80 px-4 py-1.5 font-sans text-xs font-semibold text-stone-800 transition hover:border-[#9a7b38] hover:text-[#9a7b38]"
        >
          <Gift className="h-3.5 w-3.5 text-[#9a7b38]" />
          <span>Order Signed Broadside or Framed Print of This Poem</span>
        </Link>
      </div>

      {/* Poem Title Header above the Manuscript Sheet (matches Ford Galaxy & Cordgrass layout) */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-normal tracking-wide text-stone-950 sm:text-4xl">
          {poem.externalUrl ? (
            <a
              href={poem.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-stone-400 underline-offset-8 transition hover:text-[#9a7b38] hover:decoration-[#9a7b38]"
            >
              {poem.title}
            </a>
          ) : (
            poem.title
          )}
        </h1>
        {poem.subtitle && (
          <p className="mt-2 text-lg italic text-stone-700">{poem.subtitle}</p>
        )}
      </div>

      {/* MANUSCRIPT SHEET (Following the exact presentation & left-aligned Roman serif layout of Ford Galaxy, Cordgrass & One Hazard) */}
      <div className="manuscript-sheet relative mx-auto max-w-3xl rounded-xs border border-stone-200 px-8 py-12 sm:pl-20 sm:pr-14 sm:py-16">
        {/* Subtle binder holes on the left margin matching Ford Galaxy & Cordgrass manuscript pages */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 bottom-10 left-5 hidden flex-col justify-between sm:flex"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-full bg-stone-300/75 shadow-inner"
            />
          ))}
        </div>

        {/* Poem Title inside manuscript sheet */}
        <div className="mb-8 text-left">
          <h2 className="text-[22px] font-normal text-stone-950">
            {poem.title}
          </h2>
          {poem.subtitle && (
            <p className="mt-1 text-base italic text-stone-700">
              {poem.subtitle}
            </p>
          )}
        </div>

        {/* Optional Epigraph (e.g., Seven Sugar Cubes, The Radiographer) */}
        {poem.epigraph && (
          <div className="mb-8 max-w-xl whitespace-pre-line text-left text-[17px] italic leading-relaxed text-stone-800">
            {poem.epigraph}
          </div>
        )}

        {/* Poem Body — Left-Aligned Upright Roman Serif, preserving exact spatial indentations for Ford Galaxy, Cordgrass, One Hazard */}
        <div className="space-y-6 text-left text-[17.5px] leading-[1.65] text-stone-950 overflow-x-auto">
          {poem.stanzas.map((stanza, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              {stanza.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className={
                    poem.layout === "spatial"
                      ? "whitespace-pre font-serif"
                      : "whitespace-pre-wrap font-serif"
                  }
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Author Copyright & Publication Footer (Left-Aligned as in Ford Galaxy, Cordgrass & One Hazard) */}
        <div className="mt-14 border-t border-stone-200/80 pt-6 text-left text-[15px] leading-relaxed text-stone-800">
          <p>Clodagh Beresford Dunne &copy;</p>
          {poem.publication &&
            poem.publication !== "Clodagh Beresford Dunne ©" && (
              <p className="mt-1">{poem.publication}</p>
            )}
          {poem.externalUrl && (
            <p className="mt-2">
              <a
                href={poem.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#2b6288] underline underline-offset-4 hover:text-stone-950"
              >
                <span>View original publication</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Prev / Next Poem Navigation */}
      <div className="mx-auto mt-12 flex max-w-3xl items-center justify-between border-t border-stone-300 pt-6">
        {prevPoem ? (
          <Link
            href={`/poems/${prevPoem.slug}`}
            className="group flex items-center gap-2 text-left text-stone-800 hover:text-[#9a7b38]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <div>
              <span className="block font-sans text-[10px] uppercase tracking-widest text-stone-500">
                Previous Poem
              </span>
              <span className="text-lg italic">{prevPoem.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextPoem ? (
          <Link
            href={`/poems/${nextPoem.slug}`}
            className="group flex items-center gap-2 text-right text-stone-800 hover:text-[#9a7b38]"
          >
            <div>
              <span className="block font-sans text-[10px] uppercase tracking-widest text-stone-500">
                Next Poem
              </span>
              <span className="text-lg italic">{nextPoem.title}</span>
            </div>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

