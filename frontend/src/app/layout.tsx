import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const notoSansMono = Noto_Sans_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zeni Chain · Web3 Wellness Platform",
  description:
    "Zeni Chain - Blockchain dành cho Wellness & Commerce ASEAN. Polygon CDK, real utility, KOC network on-chain.",
  keywords: [
    "Zeni Chain",
    "Web3",
    "Wellness",
    "Polygon",
    "Blockchain",
    "ASEAN",
    "KOC",
  ],
  authors: [{ name: "Zeni Holdings" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zeni Chain",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#07090F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${notoSans.variable} ${notoSansMono.variable} min-h-dvh antialiased`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
