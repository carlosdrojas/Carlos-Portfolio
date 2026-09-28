import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The lab bench used to live at /lab before it became the homepage.
  async redirects() {
    return [{ source: '/lab', destination: '/', permanent: true }];
  },
};

export default nextConfig;
