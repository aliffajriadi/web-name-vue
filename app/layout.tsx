import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("http://192.168.1.8:3000"), // Replace with your production URL later
  title: {
    default: "Alif Fajriadi",
    template: "%s | Alif",
  },
  description:
    "Senior Full-Stack Developer specializing in high-performance web applications, IoT, AI, and clean architecture. Explore my projects and technical insights.",
  keywords: [
    "Full-Stack Developer",
    "IoT Engineer",
    "AI Developer",
    "Next.js Portfolio",
    "React Specialist",
    "Software Architecture",
    "Alif",
    "Indonesia Developer",
  ],
  authors: [{ name: "Alif" }],
  creator: "Alif",
  publisher: "Alif",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Alif Fajriadi",
    description:
      "Professional personal portfolio of Alif. Focused on IoT, AI, and modern Web Engineering.",
    url: "/",
    siteName: "Alif.Dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alif Fajriadi | Portfolio",
    description: "Full-Stack Developer Specializing in IoT & AI.",
    creator: "@yourusername",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased selection:bg-primary/30 selection:text-primary`}
      >
        <NextTopLoader color="#2563eb" showSpinner={false} />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <MobileNav />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
