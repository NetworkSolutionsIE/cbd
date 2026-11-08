import React from "react";
import Link from "next/link";
import { getPoems } from "@/lib/content";

export const metadata = {
  title: "Poems — Clodagh Beresford Dunne",
  description:
    "Repository of 19 published poems by award-winning Irish poet Clodagh Beresford Dunne, including Irish Poem of the Year 'Seven Sugar Cubes', 'Ford Galaxy', 'Cordgrass', and 'One Hazard of a Messy Home'.",
};

export default function PoemsIndexPage() {
  const poems = getPoems();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
          Published Work Repository
        </span>
        <h1 className="mt-2 text-5xl text-stone-950 sm:text-6xl">Poems</h1>
        <p className="mt-3 text-lg italic text-stone-700">
          Selected poems published in{" "}
          <em>
            The Irish Times, Poetry Magazine (Chicago), Poetry Ireland Review,
            The Stinging Fly, The London Magazine, Southword, Magma,
          </em>{" "}
          and{" "}
          <em>Poetry Salzburg Review</em>.
        </p>
      </div>

      {/* 2-Column Polygon Cards Grid matching cbd_poems1.png */}
      <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
        {poems.map((poem) => (
          <div
            key={poem.id}
            className="poem-card-polygon flex min-h-[230px] flex-col items-center justify-center bg-white px-10 py-10 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="max-w-md text-xl italic tracking-wide uppercase text-stone-950 sm:text-2xl">
              {poem.title}
            </h2>

            <div className="my-4 h-px w-56 bg-stone-700" />

            {poem.subtitle ? (
              <p className="mb-4 text-sm italic font-medium text-stone-800">
                {poem.subtitle}
              </p>
            ) : (
              <p className="mb-4 max-w-sm text-xs text-stone-500">
                {poem.publication.replace(/^This poem was first published in /i, "")}
              </p>
            )}

            <Link
              href={`/poems/${poem.slug}`}
              className="mt-1 inline-flex w-52 items-center justify-center rounded-full bg-stone-950 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#9a7b38]"
            >
              Read Poem
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

