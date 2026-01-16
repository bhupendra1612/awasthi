import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
        // Skip type checking during build (we check locally)
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "vz-b96038c2-354.b-cdn.net",
            },
            {
                protocol: "https",
                hostname: "bqgielavlwjyrinephca.supabase.co",
            },
            {
                protocol: "https",
                hostname: "pwgeyamdfnaeknlovvqs.supabase.co",
            },
        ],
    },
    // Increase body size limit for video uploads
    experimental: {
        serverActions: {
            bodySizeLimit: "500mb",
        },
    },
};

export default nextConfig;
