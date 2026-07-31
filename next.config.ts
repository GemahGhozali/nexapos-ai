import type { NextConfig } from "next";

const supabaseURL = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL as string);

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseURL.hostname,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
