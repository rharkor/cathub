import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "cathub.s3.fr-par.scw.cloud",
      },
      {
        hostname: "media2.giphy.com",
      },
    ],
  },
}

export default nextConfig
