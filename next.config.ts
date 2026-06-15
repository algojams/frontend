import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: '/explore', destination: '/', permanent: false },
      { source: '/explore/:path*', destination: '/', permanent: false },
      { source: '/jams', destination: '/', permanent: false },
      { source: '/jams/:path*', destination: '/', permanent: false },
      { source: '/join', destination: '/', permanent: false },
      { source: '/join/:path*', destination: '/', permanent: false },
      { source: '/login', destination: '/', permanent: false },
      { source: '/sessions/:path*', destination: '/', permanent: false },
      { source: '/callback/:path*', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
