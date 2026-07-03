import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
      // Üyelik sistemi aktif: eski mockup giriş sayfası gerçek girişe yönlenir
      { source: "/uye-girisi", destination: "/giris", permanent: true },
      { source: "/login", destination: "/giris", permanent: true },
      { source: "/register", destination: "/kayit", permanent: true },
    ];
  },
};

export default nextConfig;
