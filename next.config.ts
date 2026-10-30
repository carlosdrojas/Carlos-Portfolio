import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The lab bench used to live at /lab before it became the homepage.
  async redirects() {
    return [{ source: '/lab', destination: '/', permanent: true }];
  },
  // NFC business card: static page in public/card.html, served at /card
  async rewrites() {
    return [{ source: '/card', destination: '/card.html' }];
  },
};

export default nextConfig;
