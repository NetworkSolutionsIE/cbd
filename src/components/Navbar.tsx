"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Sparkles, ShoppingBag } from "lucide-react";
import { getOfferingCategories, getGiftCategories } from "@/lib/content";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [giftsOpen, setGiftsOpen] = useState(false);

  const offerings = getOfferingCategories();
  const gifts = getGiftCategories();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-300/70 bg-[#ecebe9]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="text-xl tracking-tight text-stone-900 transition hover:text-[#9a7b38] sm:text-2xl"
        >
          Clodagh Beresford Dunne Poet
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 text-[15px] text-stone-800 lg:flex">
          <Link
            href="/"
            className={`pb-0.5 transition hover:text-stone-950 ${
              isActive("/") && pathname === "/"
                ? "border-b border-stone-900 font-medium text-stone-950"
                : ""
            }`}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={`pb-0.5 transition hover:text-stone-950 ${
              isActive("/about")
                ? "border-b border-stone-900 font-medium text-stone-950"
                : ""
            }`}
          >
            About
          </Link>

          <Link
            href="/poems"
            className={`pb-0.5 transition hover:text-stone-950 ${
              isActive("/poems")
                ? "border-b border-stone-900 font-medium text-stone-950"
                : ""
            }`}
          >
            Poems
          </Link>

          {/* Work With Me Dropdown (8 items per revision spec) */}
          <div
            className="relative"
            onMouseEnter={() => setWorkOpen(true)}
            onMouseLeave={() => setWorkOpen(false)}
          >
            <Link
              href="/work-with-me"
              className={`inline-flex items-center gap-1 pb-0.5 transition hover:text-stone-950 ${
                isActive("/work-with-me")
                  ? "border-b border-stone-900 font-medium text-stone-950"
                  : ""
              }`}
            >
              <span>Work With Me</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-150 ${
                  workOpen ? "rotate-180" : ""
                }`}
              />
            </Link>

            {workOpen && (
              <div className="absolute left-0 top-full pt-2 w-80">
                <div className="rounded-sm border border-stone-300/90 bg-white py-2 shadow-xl">
                  <div className="border-b border-stone-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-[#9a7b38]">
                    Courses, Workshops & Bookings
                  </div>
                  <Link
                    href="/work-with-me"
                    className="block border-b border-stone-100 px-4 py-2.5 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
                  >
                    All ‘Work With Me’ Offerings →
                  </Link>
                  {offerings.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/work-with-me/${cat.slug}`}
                      className="block px-4 py-2 text-[13.5px] uppercase tracking-wide text-stone-700 transition hover:bg-stone-100/80 hover:text-stone-950"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buy / Gifts Dropdown (3 items per revision spec) */}
          <div
            className="relative"
            onMouseEnter={() => setGiftsOpen(true)}
            onMouseLeave={() => setGiftsOpen(false)}
          >
            <Link
              href="/buy-gifts"
              className={`inline-flex items-center gap-1 pb-0.5 transition hover:text-stone-950 ${
                isActive("/buy-gifts")
                  ? "border-b border-stone-900 font-medium text-stone-950"
                  : ""
              }`}
            >
              <span>Buy &amp; Gifts</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-150 ${
                  giftsOpen ? "rotate-180" : ""
                }`}
              />
            </Link>

            {giftsOpen && (
              <div className="absolute left-0 top-full pt-2 w-72">
                <div className="rounded-sm border border-stone-300/90 bg-white py-2 shadow-xl">
                  <div className="border-b border-stone-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-[#9a7b38]">
                    Signed Editions &amp; Vouchers
                  </div>
                  <Link
                    href="/buy-gifts"
                    className="block border-b border-stone-100 px-4 py-2.5 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
                  >
                    All Signed Editions &amp; Gift Tokens →
                  </Link>
                  {gifts.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/buy-gifts/${cat.slug}`}
                      className="block px-4 py-2.5 text-[13.5px] uppercase tracking-wide text-stone-700 transition hover:bg-stone-100/80 hover:text-stone-950"
                    >
                      {cat.categoryTitle}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/gallery"
            className={`pb-0.5 transition hover:text-stone-950 ${
              isActive("/gallery")
                ? "border-b border-stone-900 font-medium text-stone-950"
                : ""
            }`}
          >
            Gallery
          </Link>

          <Link
            href="/news-events"
            className={`pb-0.5 transition hover:text-stone-950 ${
              isActive("/news-events")
                ? "border-b border-stone-900 font-medium text-stone-950"
                : ""
            }`}
          >
            News &amp; Events
          </Link>

          <Link
            href="/testimonials"
            className={`pb-0.5 transition hover:text-stone-950 ${
              isActive("/testimonials")
                ? "border-b border-stone-900 font-medium text-stone-950"
                : ""
            }`}
          >
            Testimonials
          </Link>

          <Link
            href="/contact"
            className={`pb-0.5 transition hover:text-stone-950 ${
              isActive("/contact")
                ? "border-b border-stone-900 font-medium text-stone-950"
                : ""
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-stone-800 hover:bg-stone-200/60 lg:hidden"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-stone-300 bg-[#f5f4f2] px-6 py-5 lg:hidden">
          <div className="flex flex-col space-y-3 text-base text-stone-900">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="py-1 font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="py-1 font-medium"
            >
              About
            </Link>
            <Link
              href="/poems"
              onClick={() => setMobileOpen(false)}
              className="py-1 font-medium"
            >
              Poems (All 19 Published Works)
            </Link>

            <div className="border-t border-stone-300/70 pt-3">
              <Link
                href="/work-with-me"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 font-semibold text-[#9a7b38]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Work With Me</span>
              </Link>
              <div className="mt-2 ml-3 flex flex-col space-y-2 border-l-2 border-stone-300 pl-3 text-sm text-stone-700">
                {offerings.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/work-with-me/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="py-0.5 hover:text-stone-950"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-300/70 pt-3">
              <Link
                href="/buy-gifts"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 font-semibold text-[#9a7b38]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Buy &amp; Gifts</span>
              </Link>
              <div className="mt-2 ml-3 flex flex-col space-y-2 border-l-2 border-stone-300 pl-3 text-sm text-stone-700">
                {gifts.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/buy-gifts/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="py-0.5 hover:text-stone-950"
                  >
                    {cat.categoryTitle}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-300/70 pt-3 flex flex-col space-y-2.5">
              <Link
                href="/gallery"
                onClick={() => setMobileOpen(false)}
                className="py-1 font-medium"
              >
                Gallery
              </Link>
              <Link
                href="/news-events"
                onClick={() => setMobileOpen(false)}
                className="py-1 font-medium"
              >
                News &amp; Events
              </Link>
              <Link
                href="/testimonials"
                onClick={() => setMobileOpen(false)}
                className="py-1 font-medium"
              >
                Testimonials
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="py-1 font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

