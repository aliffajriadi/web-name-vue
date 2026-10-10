import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Potongan keseharian, perjalanan, dan hal-hal di luar kode dari Alif Fajriadi.",
  alternates: { canonical: "/gallery" },
  openGraph: { url: "/gallery", title: "Galeri | Alif Fajriadi", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
