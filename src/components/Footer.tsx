import React from "react";
import Link from "next/link";
import { getSiteData } from "@/lib/content";

export default function Footer() {
  const site = getSiteData();

  return (
    <footer className="relative mt-20 border-t border-stone-300/80 bg-[#e7e6eb]">
      {/* Subtle curved wave divider inspired by the original Squarespace footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand & Sponsor Logos */}
          <div className="md:col-span-6">
            <h2 className="text-3xl tracking-tight text-stone-900 sm:text-4xl">
              {site.siteTitle}
            </h2>
            <p className="mt-1 text-sm italic text-[#9a7b38]">{site.tagline}</p>

            <div className="mt-6">
              <p className="text-xs text-stone-600 mb-3">Kindly supported by</p>
              <div className="flex flex-wrap items-center gap-4">
                <img
                  src="/images/site/ci-logo.png"
                  alt="Cultúr Éireann / Culture Ireland"
                  className="h-10 w-auto object-contain"
                />
                <img
                  src="/images/site/arts-council-logo.png"
                  alt="The Arts Council / An Chomhairle Ealaíon"
                  className="h-12 w-auto object-contain"
                />
                <img
                  src="/images/site/artlinks-logo.png"
                  alt="ArtLinks"
                  className="h-9 w-auto rounded-xs bg-white px-2 py-1 object-contain shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-700">
              Explore
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              <li>
                <Link href="/poems" className="hover:text-stone-950 hover:underline">
                  Published Poems (19)
                </Link>
              </li>
              <li>
                <Link
                  href="/work-with-me"
                  className="hover:text-stone-950 hover:underline"
                >
                  Work With Me (Courses &amp; Workshops)
                </Link>
              </li>
              <li>
                <Link
                  href="/buy-gifts"
                  className="hover:text-stone-950 hover:underline"
                >
                  Buy &amp; Gifts (Signed Editions &amp; Tokens)
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-stone-950 hover:underline"
                >
                  Gallery — “Beyond the page...”
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="hover:text-stone-950 hover:underline"
                >
                  Critical Praise &amp; Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h3 className="text-xl text-stone-900">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="break-all hover:text-stone-950 hover:underline"
                >
                  {site.email}
                </a>
              </p>
              <p className="text-xs text-stone-600">
                Workshops &amp; Retreats:{" "}
                <a
                  href={`mailto:${site.workshopEmail}`}
                  className="hover:text-stone-950 hover:underline"
                >
                  {site.workshopEmail}
                </a>
              </p>
              <p className="text-xs text-stone-600">
                Location: {site.location}
              </p>
              <div className="pt-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center rounded-sm border border-stone-400/70 bg-white/70 px-3 py-1 text-xs text-stone-700 transition hover:bg-white hover:text-stone-950"
                >
                  Manage Site Content (Admin Studio)
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-300/70 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} Clodagh Beresford Dunne. All poems
            and texts copyright of the author.
          </p>
          <p className="mt-2 sm:mt-0">
            Dungarvan, Co. Waterford, Ireland
          </p>
        </div>
      </div>
    </footer>
  );
}

