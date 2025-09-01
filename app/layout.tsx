// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import GlobalLoader from "./loadingTr";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ini akan otomatis jadi <meta name="viewport">
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// ini global metadata
export const metadata: Metadata = {
  title: {
    default: "Alif Fajriadi",
    template: "%s | Alif Fajriadi",
  },
  description: "aliffajriadi portofolio website",
  keywords: ["alif fajriadi", "alif polibatam", "batam linux user group"],
  openGraph: {
    title: "Alif F.",
    description: "Portofolio Alif Fajriadi - Software Developer",
    url: "https://aliffajriadi.my.id",
    siteName: "Alif F.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alif F.",
    description: "Portofolio Alif Fajriadi",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased container max-w-6xl mx-auto md:px-72`}
      >
        <GlobalLoader>{children}</GlobalLoader>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
