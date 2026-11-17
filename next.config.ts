import type { NextConfig } from "next";
import poemsData from "./src/data/poems.json";
import legacyRedirects from "./src/data/legacy-redirects.json";

/**
 * `npm run build:static` sets NEXT_PUBLIC_STATIC_EXPORT=1 to produce a plain
 * HTML/CSS/JS export (folder: `dist-static`) for ordinary web hosting.
 * The normal `npm run build` (Netlify / Node hosting) is unchanged.
 */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

if (isStaticExport) {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true; // /about/ -> about/index.html (works on any host)
  nextConfig.distDir = "dist-static";
} else {
  // Redirects are not supported by static export; the static build writes
  // equivalent rules into an .htaccess file instead (see scripts/build-static.mjs).
  nextConfig.redirects = async () => {
    const poemRedirects = poemsData.map((poem) => ({
      source: `/${poem.slug}`,
      destination: `/poems/${poem.slug}`,
      permanent: true,
    }));

    return [
      ...legacyRedirects.map((r) => ({ ...r, permanent: true })),
      ...poemRedirects,
    ];
  };
}

export default nextConfig;
