import type { NextConfig } from "next";

// Content-Security-Policy. This is a static, no-backend portfolio:
//   - 'unsafe-inline' for style/script is required because the app uses
//     inline styles throughout and Next/GSAP inject inline runtime code.
//   - img/font allow Google Fonts + data/blob URIs used by next/font and
//     the WebGL gallery textures.
//   - frame-ancestors 'none' mirrors X-Frame-Options: DENY (clickjacking).
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://*.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Enable React strict mode (security + error detection)
  reactStrictMode: true,

  // Don't advertise the framework (info disclosure)
  poweredByHeader: false,

  // Security headers — applied to every route.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspDirectives },
          // Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Legacy XSS protection (older browsers)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Referrer policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable unused powerful features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HSTS (require HTTPS)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },

  // Image optimization. AVIF first (~20-30% smaller than WebP at equal quality)
  // with WebP fallback for older browsers — Next's default is WebP-only, so the
  // LCP hero was shipping as WebP. minimumCacheTTL keeps optimized variants in
  // the CDN longer (the /_next/image responses were revalidating at max-age=0).
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000, // 30 days
  },

  // Disable source maps in production (prevent code exposure)
  productionBrowserSourceMaps: false,

  // Compress responses
  compress: true,

  // Next 16 defaults to Turbopack (Vercel uses it for `next build`). An empty
  // config opts in cleanly. Turbopack has no on-disk pack-cache, so the old
  // space-in-path webpack cache workaround is no longer needed.
  turbopack: {},
};

export default nextConfig;
