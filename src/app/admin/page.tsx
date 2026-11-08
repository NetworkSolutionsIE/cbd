"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Save,
  Download,
  CheckCircle2,
  Sparkles,
  Gift,
  BookOpen,
  Calendar,
  Inbox,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";
import {
  getOfferingCategories,
  getGiftCategories,
  getPoems,
  getSiteData,
  OfferingCategory,
  GiftCategory,
  Poem,
} from "@/lib/content";
import type { SubmissionRecord } from "@/app/api/submissions/route";

export default function AdminStudioPage() {
  const [activeTab, setActiveTab] = useState<
    "inbox" | "offerings" | "gifts" | "poems" | "events"
  >("inbox");

  // Submissions Inbox State
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [inboxBackend, setInboxBackend] = useState<"convex" | "local">("local");
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "read" | "replied" | "archived"
  >("all");

  const [offerings, setOfferings] = useState<OfferingCategory[]>(() =>
    getOfferingCategories()
  );
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);

  const [gifts, setGifts] = useState<GiftCategory[]>(() => getGiftCategories());
  const [selectedGiftCatIndex, setSelectedGiftCatIndex] = useState(0);

  const [poems, setPoems] = useState<Poem[]>(() => getPoems());
  const [selectedPoemIndex, setSelectedPoemIndex] = useState(0);

  const [site, setSite] = useState(() => getSiteData());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoadingInbox(true);
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.items || []);
        setInboxBackend(data.backend || "local");
      }
    } catch {
      // ignore
    } finally {
      setLoadingInbox(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleUpdateSubmissionStatus = async (
    id: string,
    status: SubmissionRecord["status"]
  ) => {
    setSubmissions((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );
    await fetch("/api/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  const handleDeleteSubmission = async (id: string) => {
    setSubmissions((prev) => prev.filter((item) => item._id !== id));
    await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  };

  const saveContent = async (
    type: "offerings" | "gifts" | "poems" | "site",
    data: unknown
  ) => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatusMessage(
          `Saved ${type}.json! Refresh any page to see your updates live.`
        );
      } else {
        setStatusMessage(json.error || "Could not save file.");
      }
    } catch {
      setStatusMessage(
        "Saved in browser session. Use 'Download JSON' if deployed on static hosting."
      );
    } finally {
      setSaving(false);
    }
  };

  const downloadJson = (filename: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddOffering = () => {
    const updated = [...offerings];
    const currentCat = updated[selectedCatIndex];
    currentCat.items.push({
      id: `offering-${Date.now()}`,
      title: "New Course / Workshop Offering",
      advert: {
        colorTheme: "sky",
        badge: currentCat.title.toUpperCase(),
        heading: "NEW WORKSHOP OR COURSE TITLE",
        subheading: "“SUBTITLE OR SPECIAL FOCUS”",
        facilitator: "with POET, CLODAGH BERESFORD DUNNE",
        level: "ALL LEVELS WELCOME",
        date: "Upcoming Date TBD",
        venue: "Colligan Falls, Dungarvan, Co. Waterford (X35 YC66)",
        time: "10:00 am – 5:00 pm",
        price: "€150 pp",
        notes: "Numbers strictly limited.",
        bookingContact: "clodaghberesford@yahoo.com",
        emblemImage: "/images/offerings/book-leaves-emblem.jpg",
      },
      longDescription:
        "Enter the longer description of this course, workshop, or retreat here.",
      bullets: [
        "Key highlight or learning outcome 1",
        "Key highlight or learning outcome 2",
      ],
      photos: [
        {
          src: "/images/gallery/carlow-workshop.jpg",
          caption: "Workshop photo",
        },
      ],
      testimonials: [
        {
          quote: "Her passion and commitment to poetry is infectious.",
          author: "Professor Michael Paul Thomas",
          role: "Monmouth University",
        },
      ],
      bookingEmail: "clodaghberesford@yahoo.com",
      bookingSubject: "WORKSHOP ENQUIRY",
    });
    setOfferings(updated);
  };

  const handleDeleteOffering = (itemIdx: number) => {
    const updated = [...offerings];
    updated[selectedCatIndex].items.splice(itemIdx, 1);
    setOfferings(updated);
  };

  const handleAddGiftItem = () => {
    const updated = [...gifts];
    updated[selectedGiftCatIndex].items.push({
      id: `gift-${Date.now()}`,
      title: "New Signed Edition / Gift Token",
      subtitle: "Limited Collector's Edition",
      price: "€95",
      edition: "Hand-Signed by Clodagh Beresford Dunne",
      description: "Describe the framed poem, broadside, or gift token here.",
      features: [
        "Individually hand-signed by the poet",
        "Archival presentation quality",
      ],
      poemPreview: "“Enter a short quote or preview line here...”",
      inStock: true,
    });
    setGifts(updated);
  };

  const handleDeleteGiftItem = (itemIdx: number) => {
    const updated = [...gifts];
    updated[selectedGiftCatIndex].items.splice(itemIdx, 1);
    setGifts(updated);
  };

  const handleAddPoem = () => {
    const newPoem: Poem = {
      id: `poem-${Date.now()}`,
      slug: `new-poem-${Date.now()}`,
      title: "New Poem Title",
      subtitle: "",
      featured: false,
      epigraph: "",
      layout: "standard",
      stanzas: [["First line of stanza one", "Second line of stanza one"]],
      publication: "This poem was first published in [Journal Name, Year]",
      externalUrl: "",
      description: "Short description of the poem.",
      originalImage: "",
    };
    setPoems([newPoem, ...poems]);
    setSelectedPoemIndex(0);
  };

  const newCount = submissions.filter((s) => s.status === "new").length;
  const filteredSubmissions =
    statusFilter === "all"
      ? submissions
      : submissions.filter((s) => s.status === statusFilter);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="border-b border-stone-300 pb-6">
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
          Self-Service Content &amp; Bookings Manager
        </span>
        <h1 className="mt-1 text-4xl font-semibold text-stone-950 sm:text-5xl">
          Website Content Studio &amp; Bookings Inbox
        </h1>
        <p className="mt-2 max-w-3xl text-base text-stone-700">
          View and reply to incoming bookings and enquiries, or add, edit, and
          remove courses, colour-coded adverts, gift items, news events, and
          poems at any time.
        </p>
      </div>

      {statusMessage && (
        <div className="mt-6 flex items-center gap-2 rounded-sm border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Section Tabs */}
      <div className="mt-8 flex flex-wrap gap-3 border-b border-stone-300 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("inbox")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest transition ${
            activeTab === "inbox"
              ? "bg-stone-950 text-white"
              : "border border-stone-300 bg-white text-stone-700 hover:border-stone-800"
          }`}
        >
          <Inbox className="h-3.5 w-3.5" />
          <span>Bookings &amp; Messages ({submissions.length})</span>
          {newCount > 0 && (
            <span className="ml-1 rounded-full bg-[#9a7b38] px-2 py-0.5 text-[10px] text-white">
              {newCount} new
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("offerings")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest transition ${
            activeTab === "offerings"
              ? "bg-stone-950 text-white"
              : "border border-stone-300 bg-white text-stone-700 hover:border-stone-800"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Work With Me &amp; Adverts (8 Dropdowns)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gifts")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest transition ${
            activeTab === "gifts"
              ? "bg-stone-950 text-white"
              : "border border-stone-300 bg-white text-stone-700 hover:border-stone-800"
          }`}
        >
          <Gift className="h-3.5 w-3.5" />
          <span>Buy &amp; Gifts (3 Dropdowns)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("poems")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest transition ${
            activeTab === "poems"
              ? "bg-stone-950 text-white"
              : "border border-stone-300 bg-white text-stone-700 hover:border-stone-800"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Poems Repository ({poems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("events")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest transition ${
            activeTab === "events"
              ? "bg-stone-950 text-white"
              : "border border-stone-300 bg-white text-stone-700 hover:border-stone-800"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>News &amp; Events</span>
        </button>
      </div>

      {/* TAB 0: BOOKINGS & MESSAGES INBOX (Backed by Convex + Local Fallback) */}
      {activeTab === "inbox" && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "new", "read", "replied", "archived"] as const).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider transition ${
                      statusFilter === st
                        ? "bg-[#9a7b38] text-white"
                        : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-xs border border-stone-300 bg-white px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                Storage:{" "}
                <strong className="text-stone-950">
                  {inboxBackend === "convex"
                    ? "Convex Cloud Real-Time DB"
                    : "Local JSON (Set NEXT_PUBLIC_CONVEX_URL for Cloud)"}
                </strong>
              </span>

              <button
                type="button"
                onClick={fetchSubmissions}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-400 bg-white px-4 py-1.5 font-sans text-xs font-semibold text-stone-800 hover:bg-stone-100"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    loadingInbox ? "animate-spin" : ""
                  }`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="rounded-sm border border-stone-300 bg-white p-12 text-center">
              <Inbox className="mx-auto h-10 w-10 text-stone-400" />
              <h3 className="mt-3 text-2xl font-semibold text-stone-900">
                No messages in this view yet
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                When visitors submit a booking or enquiry on the Contact page,
                it will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub._id}
                  className={`rounded-sm border bg-white p-6 shadow-xs transition ${
                    sub.status === "new"
                      ? "border-l-4 border-stone-300 border-l-[#9a7b38]"
                      : "border-stone-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-xs px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-widest ${
                            sub.status === "new"
                              ? "bg-[#9a7b38] text-white"
                              : sub.status === "replied"
                              ? "bg-emerald-700 text-white"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {sub.status}
                        </span>
                        <span className="rounded-xs bg-[#f5efe2] px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-[#8a6a28]">
                          {sub.category}
                        </span>
                        <span className="font-sans text-xs text-stone-500">
                          {new Date(sub.createdAt).toLocaleString("en-IE")}
                        </span>
                      </div>

                      <h3 className="mt-2 text-2xl font-semibold text-stone-950">
                        {sub.subject}
                      </h3>
                      {sub.offering && (
                        <p className="text-sm italic text-[#9a7b38]">
                          Selected Offering: {sub.offering}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={sub.status}
                        onChange={(e) =>
                          handleUpdateSubmissionStatus(
                            sub._id,
                            e.target.value as SubmissionRecord["status"]
                          )
                        }
                        className="rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 font-sans text-xs font-semibold uppercase text-stone-800"
                      >
                        <option value="new">Mark: New</option>
                        <option value="read">Mark: Read</option>
                        <option value="replied">Mark: Replied</option>
                        <option value="archived">Mark: Archived</option>
                      </select>

                      <a
                        href={`mailto:${sub.email}?subject=${encodeURIComponent(
                          `Re: ${sub.subject}`
                        )}&body=${encodeURIComponent(
                          `Dear ${sub.name},\n\nThank you for your message regarding "${sub.subject}".\n\nWarm regards,\nClodagh Beresford Dunne`
                        )}`}
                        onClick={() =>
                          handleUpdateSubmissionStatus(sub._id, "replied")
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-stone-950 px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9a7b38]"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>Reply by Email</span>
                      </a>

                      {sub.phone && (
                        <a
                          href={`https://wa.me/${sub.phone
                            .replace(/\s+/g, "")
                            .replace(/^0/, "353")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-stone-400 px-3.5 py-1.5 font-sans text-xs font-semibold text-stone-800 hover:bg-stone-100"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteSubmission(sub._id)}
                        className="rounded-xs p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-700"
                        title="Delete submission"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-6 font-sans text-xs text-stone-600">
                    <div>
                      <strong>From:</strong> {sub.name} (
                      <a
                        href={`mailto:${sub.email}`}
                        className="underline hover:text-stone-950"
                      >
                        {sub.email}
                      </a>
                      )
                    </div>
                    {sub.phone && (
                      <div>
                        <strong>Phone / WhatsApp:</strong> {sub.phone}
                      </div>
                    )}
                    <div>
                      <strong>Routed To:</strong> {sub.recipientEmail}
                    </div>
                  </div>

                  <div className="mt-4 whitespace-pre-wrap rounded-xs border-l-4 border-[#9a7b38] bg-stone-50 p-4 text-base leading-relaxed text-stone-900">
                    {sub.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: WORK WITH ME OFFERINGS & COLOUR-CODED ADVERTS */}
      {activeTab === "offerings" && (
        <div className="mt-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {offerings.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCatIndex(idx)}
                  className={`rounded-xs px-3.5 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition ${
                    selectedCatIndex === idx
                      ? "bg-[#9a7b38] text-white"
                      : "border border-stone-300 bg-white text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  {cat.title} ({cat.items.length})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddOffering}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-900 bg-white px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-stone-900 hover:bg-stone-100"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Offering to Category</span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => saveContent("offerings", offerings)}
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-950 px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9a7b38]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>

              <button
                type="button"
                onClick={() => downloadJson("offerings.json", offerings)}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 font-sans text-xs font-semibold text-stone-700 hover:border-stone-800"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>

          {offerings[selectedCatIndex].items.map((item, itemIdx) => (
            <div
              key={item.id}
              className="space-y-6 rounded-sm border border-stone-300 bg-white p-6 shadow-xs sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <h3 className="text-2xl font-semibold text-stone-950">
                  Offering #{itemIdx + 1}: {item.title}
                </h3>
                <button
                  type="button"
                  onClick={() => handleDeleteOffering(itemIdx)}
                  className="inline-flex items-center gap-1.5 rounded-xs border border-red-200 bg-red-50 px-3 py-1.5 font-sans text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Offering</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-xs border border-stone-200 bg-stone-50/70 p-4">
                  <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
                    Part 1: Colour-Coded Advert Card
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                        Advert Colour Theme
                      </label>
                      <select
                        value={item.advert.colorTheme}
                        onChange={(e) => {
                          const next = [...offerings];
                          next[selectedCatIndex].items[
                            itemIdx
                          ].advert.colorTheme = e.target
                            .value as typeof item.advert.colorTheme;
                          setOfferings(next);
                        }}
                        className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                      >
                        <option value="sky">Sky Blue (Workshop Style)</option>
                        <option value="slate">
                          Slate Grey &amp; Gold (Leaving Cert Style)
                        </option>
                        <option value="amber">Warm Amber / Gold</option>
                        <option value="emerald">Forest Emerald</option>
                        <option value="rose">Bespoke Rose / Burgundy</option>
                        <option value="violet">Deep Violet</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                        Price Badge
                      </label>
                      <input
                        type="text"
                        value={item.advert.price}
                        onChange={(e) => {
                          const next = [...offerings];
                          next[selectedCatIndex].items[itemIdx].advert.price =
                            e.target.value;
                          setOfferings(next);
                        }}
                        className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                      Advert Heading
                    </label>
                    <input
                      type="text"
                      value={item.advert.heading}
                      onChange={(e) => {
                        const next = [...offerings];
                        next[selectedCatIndex].items[itemIdx].advert.heading =
                          e.target.value;
                        setOfferings(next);
                      }}
                      className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                      Advert Subheading / Focus
                    </label>
                    <input
                      type="text"
                      value={item.advert.subheading}
                      onChange={(e) => {
                        const next = [...offerings];
                        next[selectedCatIndex].items[
                          itemIdx
                        ].advert.subheading = e.target.value;
                        setOfferings(next);
                      }}
                      className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                        Date(s)
                      </label>
                      <input
                        type="text"
                        value={item.advert.date}
                        onChange={(e) => {
                          const next = [...offerings];
                          next[selectedCatIndex].items[itemIdx].advert.date =
                            e.target.value;
                          setOfferings(next);
                        }}
                        className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                        Time
                      </label>
                      <input
                        type="text"
                        value={item.advert.time}
                        onChange={(e) => {
                          const next = [...offerings];
                          next[selectedCatIndex].items[itemIdx].advert.time =
                            e.target.value;
                          setOfferings(next);
                        }}
                        className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                      Venue
                    </label>
                    <input
                      type="text"
                      value={item.advert.venue}
                      onChange={(e) => {
                        const next = [...offerings];
                        next[selectedCatIndex].items[itemIdx].advert.venue =
                          e.target.value;
                        setOfferings(next);
                      }}
                      className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-xs border border-stone-200 bg-stone-50/70 p-4">
                  <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#9a7b38]">
                    Part 2: Longer Description &amp; Bullet Points
                  </h4>

                  <div>
                    <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                      Offering Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...offerings];
                        next[selectedCatIndex].items[itemIdx].title =
                          e.target.value;
                        setOfferings(next);
                      }}
                      className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                      Longer Description
                    </label>
                    <textarea
                      rows={3}
                      value={item.longDescription}
                      onChange={(e) => {
                        const next = [...offerings];
                        next[selectedCatIndex].items[itemIdx].longDescription =
                          e.target.value;
                        setOfferings(next);
                      }}
                      className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                      Bullet Points (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={item.bullets.join("\n")}
                      onChange={(e) => {
                        const next = [...offerings];
                        next[selectedCatIndex].items[itemIdx].bullets =
                          e.target.value.split("\n");
                        setOfferings(next);
                      }}
                      className="mt-1 w-full rounded-xs border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BUY & GIFTS */}
      {activeTab === "gifts" && (
        <div className="mt-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {gifts.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedGiftCatIndex(idx)}
                  className={`rounded-xs px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition ${
                    selectedGiftCatIndex === idx
                      ? "bg-[#9a7b38] text-white"
                      : "border border-stone-300 bg-white text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  {cat.categoryTitle} ({cat.items.length})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddGiftItem}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-900 bg-white px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-stone-900 hover:bg-stone-100"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Gift / Shop Item</span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => saveContent("gifts", gifts)}
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-950 px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9a7b38]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {gifts[selectedGiftCatIndex].items.map((item, idx) => (
              <div
                key={item.id}
                className="space-y-4 rounded-sm border border-stone-300 bg-white p-6 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-xl font-semibold text-stone-950">
                    {item.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleDeleteGiftItem(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                      Item Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...gifts];
                        next[selectedGiftCatIndex].items[idx].title =
                          e.target.value;
                        setGifts(next);
                      }}
                      className="mt-1 w-full rounded-xs border border-stone-300 px-2.5 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                      Price
                    </label>
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => {
                        const next = [...gifts];
                        next[selectedGiftCatIndex].items[idx].price =
                          e.target.value;
                        setGifts(next);
                      }}
                      className="mt-1 w-full rounded-xs border border-stone-300 px-2.5 py-1.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-semibold uppercase text-stone-600">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => {
                      const next = [...gifts];
                      next[selectedGiftCatIndex].items[idx].description =
                        e.target.value;
                      setGifts(next);
                    }}
                    className="mt-1 w-full rounded-xs border border-stone-300 px-2.5 py-1.5 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: POEMS REPOSITORY */}
      {activeTab === "poems" && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <select
                value={selectedPoemIndex}
                onChange={(e) => setSelectedPoemIndex(Number(e.target.value))}
                className="rounded-xs border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-900"
              >
                {poems.map((p, i) => (
                  <option key={p.id} value={i}>
                    {i + 1}. {p.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddPoem}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-900 bg-white px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-stone-900 hover:bg-stone-100"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Poem</span>
              </button>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={() => saveContent("poems", poems)}
              className="inline-flex items-center gap-1.5 rounded-full bg-stone-950 px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9a7b38]"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Poems</span>
            </button>
          </div>

          {poems[selectedPoemIndex] && (
            <div className="space-y-4 rounded-sm border border-stone-300 bg-white p-6 shadow-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-sans text-xs font-semibold uppercase text-stone-600">
                    Poem Title
                  </label>
                  <input
                    type="text"
                    value={poems[selectedPoemIndex].title}
                    onChange={(e) => {
                      const next = [...poems];
                      next[selectedPoemIndex].title = e.target.value;
                      setPoems(next);
                    }}
                    className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs font-semibold uppercase text-stone-600">
                    Publication Credit
                  </label>
                  <input
                    type="text"
                    value={poems[selectedPoemIndex].publication}
                    onChange={(e) => {
                      const next = [...poems];
                      next[selectedPoemIndex].publication = e.target.value;
                      setPoems(next);
                    }}
                    className="mt-1 w-full rounded-xs border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold uppercase text-stone-600">
                  Poem Text (Separate stanzas with a blank line; left-aligned &amp; spatial indentations are preserved)
                </label>
                <textarea
                  rows={14}
                  value={poems[selectedPoemIndex].stanzas
                    .map((s) => s.join("\n"))
                    .join("\n\n")}
                  onChange={(e) => {
                    const next = [...poems];
                    next[selectedPoemIndex].stanzas = e.target.value
                      .split(/\n\s*\n/)
                      .map((stanza) => stanza.split("\n"));
                    setPoems(next);
                  }}
                  className="mt-1 w-full rounded-xs border border-stone-300 p-4 font-serif text-base leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: NEWS & EVENTS */}
      {activeTab === "events" && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSite({
                  ...site,
                  newsEvents: [
                    {
                      id: `event-${Date.now()}`,
                      date: "Upcoming Date",
                      category: "Event / Workshop",
                      title: "New Event or Publication Announcement",
                      location: "Dungarvan, Co. Waterford",
                      summary:
                        "Details of the upcoming reading, course, or publication.",
                      ctaText: "Learn More",
                      ctaLink: "/work-with-me",
                    },
                    ...site.newsEvents,
                  ],
                });
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-900 bg-white px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-stone-900"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add News / Event Item</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => saveContent("site", site)}
              className="inline-flex items-center gap-1.5 rounded-full bg-stone-950 px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9a7b38]"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save News &amp; Events</span>
            </button>
          </div>

          <div className="space-y-4">
            {site.newsEvents.map((ev, idx) => (
              <div
                key={ev.id}
                className="space-y-3 rounded-sm border border-stone-300 bg-white p-6 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={ev.title}
                    onChange={(e) => {
                      const next = { ...site };
                      next.newsEvents[idx].title = e.target.value;
                      setSite(next);
                    }}
                    className="w-2/3 rounded-xs border border-stone-300 px-3 py-1.5 text-lg font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...site };
                      next.newsEvents.splice(idx, 1);
                      setSite(next);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={ev.date}
                    onChange={(e) => {
                      const next = { ...site };
                      next.newsEvents[idx].date = e.target.value;
                      setSite(next);
                    }}
                    className="rounded-xs border border-stone-300 px-3 py-1.5 text-sm"
                    placeholder="Date"
                  />
                  <input
                    type="text"
                    value={ev.location}
                    onChange={(e) => {
                      const next = { ...site };
                      next.newsEvents[idx].location = e.target.value;
                      setSite(next);
                    }}
                    className="rounded-xs border border-stone-300 px-3 py-1.5 text-sm"
                    placeholder="Location"
                  />
                </div>
                <textarea
                  rows={2}
                  value={ev.summary}
                  onChange={(e) => {
                    const next = { ...site };
                    next.newsEvents[idx].summary = e.target.value;
                    setSite(next);
                  }}
                  className="w-full rounded-xs border border-stone-300 px-3 py-1.5 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
