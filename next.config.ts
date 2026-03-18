import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // faith.samuelgyasi.com/ → /faith
      {
        source: "/",
        has: [{ type: "host", value: "faith.samuelgyasi.com" }],
        destination: "/faith",
      },
      // faith.samuelgyasi.com/:path* → /faith/:path*
      {
        source: "/:path*",
        has: [{ type: "host", value: "faith.samuelgyasi.com" }],
        destination: "/faith/:path*",
      },
    ];
  },
};

export default nextConfig;
