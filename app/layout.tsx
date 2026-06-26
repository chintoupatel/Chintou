import type { Metadata, Viewport } from "next";
import { Sofia_Sans_Condensed, Playfair_Display, Pacifico, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/lib/components/SmoothScroll";

const sofiaSans = Sofia_Sans_Condensed({
  variable: "--font-sofia",
  subsets: ["latin"],
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
});

// Resolve the canonical site URL. Vercel injects VERCEL_PROJECT_PRODUCTION_URL
// (and VERCEL_URL for previews); fall back to the custom domain placeholder
// for local builds. Update the fallback once a custom domain is attached.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://chintou.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Chintan Patel — Product Designer & Strategist",
  description: "Conscious minimalism — clarity, meaning, and functionality.",
  openGraph: {
    type: "website",
    title: "Chintan Patel — Product Designer & Strategist",
    description: "Conscious minimalism — clarity, meaning, and functionality.",
    url: siteUrl,
    siteName: "Chintan Patel",
    images: [{ url: "/images/IMG_0115.jpeg", width: 1200, height: 630, alt: "Chintan Patel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chintan Patel — Product Designer & Strategist",
    description: "Conscious minimalism — clarity, meaning, and functionality.",
    images: ["/images/IMG_0115.jpeg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F7F7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sofiaSans.variable} ${playfair.variable} ${pacifico.variable} ${splineSansMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
