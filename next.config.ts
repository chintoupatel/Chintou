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
  "connect-src 'self'",
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

  // Disable source maps in production (prevent code exposure)
  productionBrowserSourceMaps: false,

  // Compress responses
  compress: true,

  // Dev (webpack) uses in-memory cache instead of the on-disk pack cache.
  // The project path contains a space, which breaks webpack's temp-pack
  // rename ('0.pack.gz_' -> '0.pack.gz' ENOENT). Memory cache avoids it.
  webpack: (config, { dev }: { dev: boolean }) => {
    if (dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },
};

export default nextConfig;
