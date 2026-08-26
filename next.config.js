/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Expose key Gemini agar SDK @ai-sdk/google membaca GOOGLE_GENERATIVE_AI_API_KEY
  env: {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY || "",
  },

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Jangan bundle paket native (ws/bufferutil) di server — perlu utk Edge TTS
    serverComponentsExternalPackages: [
      "msedge-tts",
      "ws",
      "bufferutil",
      "utf-8-validate",
    ],
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;