import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  metadataBase: new URL("https://aliffajriadi.my.id"), // Replace with your production URL later
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
        className={`${jakarta.variable} ${lora.variable} antialiased selection:bg-primary/30 selection:text-primary`}
      >
        <NextTopLoader color="#2563eb" showSpinner={false} />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <div className="font-sans">
              <Navbar />
            </div>
            <main className="grow">{children}</main>
            <div className="font-sans">
              <MobileNav />
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
