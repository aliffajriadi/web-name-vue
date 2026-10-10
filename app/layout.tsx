import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Newsreader,
} from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import BackToTop from "@/components/BackToTop";
import NextTopLoader from "nextjs-toploader";
import { SITE, SITE_URL } from "@/lib/site";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F2EC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E09" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — Full-Stack Developer, IoT & AI`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.shortName,
  keywords: [
    "Alif Fajriadi",
    "Full-Stack Developer",
    "Web Developer Indonesia",
    "IoT",
    "AI",
    "Next.js",
    "React",
    "Portfolio",
    "Blog Teknologi",
  ],
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/blog/feed.xml", title: `${SITE.name} — Blog` }] },
  },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: `${SITE.name} — Full-Stack Developer, IoT & AI`,
    description: SITE.description,
    url: "/",
    siteName: SITE.shortName,
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Full-Stack Developer`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE.shortName,
      description: SITE.description,
      inLanguage: ["id-ID", "en-US"],
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE.name,
      url: SITE_URL,
      jobTitle: "Full-Stack Developer",
      email: `mailto:${SITE.email}`,
      sameAs: [SITE.github, SITE.linkedin],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${bricolage.variable} ${instrument.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <NextTopLoader color="var(--accent)" showSpinner={false} height={2} />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-[color:var(--paper)]"
          >
            Skip to content
          </a>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main id="main" className="grow">
              {children}
            </main>
            <MobileNav />
            <Footer />
          </div>
          <CommandPalette />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
