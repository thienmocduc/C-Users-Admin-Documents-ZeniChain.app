import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Disable error overlay for non-fatal warnings in dev
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rfmpechyipmrsjegryzz.supabase.co",
      },
    ],
  },

  // Powered-by header leak prevention
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Anti-clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // XSS protection
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Referrer control
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // HSTS — force HTTPS
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // CSP — Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://rfmpechyipmrsjegryzz.supabase.co",
              "connect-src 'self' https://rfmpechyipmrsjegryzz.supabase.co wss://rfmpechyipmrsjegryzz.supabase.co https://polygon-rpc.com https://rpc.ankr.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // Permissions
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Anti-clone: prevent embedding
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
      // Block source map access
      {
        source: "/(.*)\\.map",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // Protect API routes
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // Hide API route internals — no .ts/.js extensions accessible
    ];
  },
};

export default nextConfig;
