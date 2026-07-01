import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/hakkimizda", permanent: true },
      { source: "/communities", destination: "/baskanliklar", permanent: true },
      { source: "/communities/:slug", destination: "/baskanliklar/:slug", permanent: true },
      { source: "/events", destination: "/etkinlikler", permanent: true },
      { source: "/events/:slug", destination: "/etkinlikler/:slug", permanent: true },
      { source: "/sponsors", destination: "/sponsorlar", permanent: true },
      { source: "/applications", destination: "/basvurular", permanent: true },
      { source: "/contact", destination: "/iletisim", permanent: true },
    ];
  },
};

export default nextConfig;
