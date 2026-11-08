"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { getSiteData } from "@/lib/content";

function ContactFormContent() {
  const site = getSiteData();
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") || "";
  const initialOffering = searchParams.get("offering") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(
    initialSubject || "Enquiry via Website"
  );
  const [message, setMessage] = useState(
    initialOffering
      ? `Hello Clodagh,\n\nI would like to enquire about: ${initialOffering}.\n\n`
      : ""
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail =
      subject.toLowerCase().includes("workshop") ||
      subject.toLowerCase().includes("retreat")
        ? site.workshopEmail
        : site.email;

    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Column: Get in touch text, Form, and Map (matching cbd_contact.png) */}
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-5xl text-stone-950 sm:text-6xl">Get in touch!</h1>

          <div className="space-y-4 text-base leading-relaxed text-stone-800">
            <p>Thank you for your interest in my work.</p>
            <p>
              For enquiries regarding poetry readings, publications,
              commissions, courses, retreats, workshops, school visits, signed
              editions, gift tokens, or other professional matters, please feel
              free to make contact using the details below.
            </p>
            <p>
              You may reach me by email, WhatsApp/text, or by completing the
              enquiry form on this page. I endeavour to respond to all enquiries
              as promptly as possible.
            </p>
          </div>

          <div className="space-y-2.5 rounded-sm border border-stone-300 bg-white/90 p-5 text-sm text-stone-800">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#9a7b38]" />
              <span>
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="underline hover:text-[#9a7b38]"
                >
                  {site.email}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#9a7b38]" />
              <span>
                <strong>Workshops &amp; Retreats:</strong>{" "}
                <a
                  href={`mailto:${site.workshopEmail}`}
                  className="underline hover:text-[#9a7b38]"
                >
                  {site.workshopEmail}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#9a7b38]" />
              <span>
                <strong>Student Courses (Text / WhatsApp):</strong>{" "}
                <a
                  href="https://wa.me/353868629283"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#9a7b38]"
                >
                  {site.phone}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-[#9a7b38]" />
              <span>
                <strong>Location:</strong> {site.location}
              </span>
            </div>
          </div>

          {/* Interactive Booking / Enquiry Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-sm border border-stone-300 bg-white p-6 shadow-xs"
          >
            <h2 className="text-2xl font-semibold text-stone-950">
              Send an Enquiry or Booking Request
            </h2>

            {submitted && (
              <div className="flex items-center gap-2 rounded-xs bg-emerald-50 p-3 text-xs font-medium text-emerald-900 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>
                  Your email client has been opened with your pre-filled enquiry
                  to Clodagh.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-[#9a7b38] focus:outline-hidden"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-[#9a7b38] focus:outline-hidden"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700">
                Subject / Offering *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-[#9a7b38] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700">
                Message &amp; Details *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please include relevant details (preferred dates, course/workshop name, or poem choice) to assist with an accurate and timely response."
                className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-[#9a7b38] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#9a7b38]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Enquiry</span>
            </button>
          </form>

          {/* Map Embed for Colligan / Dungarvan, Co. Waterford */}
          <div className="overflow-hidden rounded-sm border border-stone-300 shadow-xs">
            <iframe
              title="Colligan, Dungarvan, Co. Waterford Map"
              src="https://www.google.com/maps?q=Colligan,+Dungarvan,+Co.+Waterford,+Ireland&output=embed"
              className="h-56 w-full border-0"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column: Open Book Photography matching cbd_contact.png */}
        <div className="lg:col-span-6">
          <div className="sticky top-28 overflow-hidden rounded-xs shadow-xl">
            <img
              src="/images/site/contact-book.jpg"
              alt="Open book of poetry"
              className="h-[680px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}

