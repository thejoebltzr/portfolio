import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 for the full-bleed portrait, which is shown scaled up; 75 (default) everywhere else.
    qualities: [75, 90],
  },
};

export default nextConfig;
