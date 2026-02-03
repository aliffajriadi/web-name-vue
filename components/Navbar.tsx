"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const navItems = [
    { name: t("Home", "Beranda"), path: "/" },
    { name: t("Projects", "Proyek"), path: "/projects" },
    { name: t("Gallery", "Galeri"), path: "/gallery" },
    { name: t("Blog", "Blog"), path: "/blog" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-custom h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-foreground group"
        >
          ALIF
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-xs font-black uppercase tracking-widest transition-all hover:text-primary",
                  pathname === item.path
                    ? "text-primary underline decoration-2 underline-offset-8"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 border-l border-border pl-4">
            <button
              onClick={() => setLang(lang === "en" ? "id" : "en")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-[9px] font-black uppercase tracking-widest hover:border-primary transition-all active:scale-95 shadow-sm"
            >
              <Languages size={14} className="text-primary" />
              {lang}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
