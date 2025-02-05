import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cathub.s3.fr-par.scw.cloud",
      },
    ],
  },
}

export default nextConfig
