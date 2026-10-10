import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyek & Studi Kasus",
  description:
    "Kumpulan proyek pilihan Alif Fajriadi: aplikasi web full-stack, sistem IoT, dan eksperimen AI — lengkap dengan tech stack dan tautan demo.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: "Proyek & Studi Kasus | Alif Fajriadi", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
