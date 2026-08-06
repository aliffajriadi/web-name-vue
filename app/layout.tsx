import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F8F1" },
    { media: "(prefers-color-scheme: dark)", color: "#111A0F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aliffajriadi.my.id"),
  title: {
    default: "Alif Fajriadi",
    template: "%s | Alif",
  },
  description:
    "Full-Stack Developer & UI/UX Enthusiast crafting thoughtful digital experiences. Specializing in IoT, AI, and clean web architecture.",
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
      "Personal portfolio of Alif Fajriadi — Web Developer & UI/UX Enthusiast.",
    url: "/",
    siteName: "Alif.Dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alif Fajriadi | Portfolio",
    description: "Full-Stack Developer — IoT & AI enthusiast.",
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
        className={`${jakarta.variable} ${playfair.variable} font-sans antialiased`}
      >
        <NextTopLoader color="#3E7C3E" showSpinner={false} />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="grow">{children}</main>
            <MobileNav />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
