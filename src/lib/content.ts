import poemsData from "@/data/poems.json";
import offeringsData from "@/data/offerings.json";
import giftsData from "@/data/gifts.json";
import siteData from "@/data/site.json";

export interface Poem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  featured: boolean;
  epigraph: string;
  layout: "standard" | "spatial";
  stanzas: string[][];
  publication: string;
  externalUrl: string;
  description: string;
  originalImage: string;
}

export interface AdvertCard {
  colorTheme: "sky" | "slate" | "amber" | "emerald" | "rose" | "violet";
  badge: string;
  heading: string;
  subheading: string;
  facilitator: string;
  level: string;
  date: string;
  venue: string;
  time: string;
  price: string;
  notes: string;
  bookingContact: string;
  emblemImage?: string;
}

export interface OfferingPhoto {
  src: string;
  caption: string;
}

export interface OfferingTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface OfferingItem {
  id: string;
  title: string;
  advert: AdvertCard;
  longDescription: string;
  bullets: string[];
  photos: OfferingPhoto[];
  testimonials: OfferingTestimonial[];
  bookingEmail: string;
  bookingPhone?: string;
  bookingSubject: string;
}

export interface OfferingCategory {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  intro: string;
  items: OfferingItem[];
}

export interface GiftItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  edition: string;
  description: string;
  features: string[];
  poemPreview: string;
  poemSlug?: string;
  inStock: boolean;
}

export interface GiftCategory {
  id: string;
  slug: string;
  categoryTitle: string;
  shortTitle: string;
  tagline: string;
  description: string;
  items: GiftItem[];
}

export const getPoems = (): Poem[] => poemsData as Poem[];
export const getPoemBySlug = (slug: string): Poem | undefined =>
  (poemsData as Poem[]).find((p) => p.slug === slug || p.id === slug);

export const getOfferingCategories = (): OfferingCategory[] =>
  offeringsData as OfferingCategory[];
export const getOfferingCategoryBySlug = (
  slug: string
): OfferingCategory | undefined =>
  (offeringsData as OfferingCategory[]).find((c) => c.slug === slug);

export const getGiftCategories = (): GiftCategory[] =>
  giftsData as GiftCategory[];
export const getGiftCategoryBySlug = (slug: string): GiftCategory | undefined =>
  (giftsData as GiftCategory[]).find((c) => c.slug === slug);

export const getSiteData = () => siteData;

