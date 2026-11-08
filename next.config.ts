import type { NextConfig } from "next";
import poemsData from "./src/data/poems.json";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    const poemRedirects = poemsData.map((poem) => ({
      source: `/${poem.slug}`,
      destination: `/poems/${poem.slug}`,
      permanent: true,
    }));

    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/courses",
        destination: "/work-with-me/adult-courses-retreats",
        permanent: true,
      },
      {
        source: "/workshops",
        destination: "/work-with-me/poetry-workshops",
        permanent: true,
      },
      {
        source: "/new-page",
        destination: "/testimonials",
        permanent: true,
      },
      ...poemRedirects,
    ];
  },
};

export default nextConfig;
