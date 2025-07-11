import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alif F.",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased container max-w-6xl mx-auto md:px-72`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
