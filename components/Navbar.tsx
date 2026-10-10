"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Languages, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useFontSize } from "@/context/FontSizeContext";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { isLargeFont, toggleFontSize } = useFontSize();
  const scrollDirection = useScrollDirection();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: t("Home", "Beranda"), path: "/" },
    { name: t("Work", "Proyek"), path: "/projects" },
    { name: t("Writing", "Tulisan"), path: "/blog" },
    { name: t("Gallery", "Galeri"), path: "/gallery" },
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.header
      animate={{ y: scrollDirection === "down" && scrolled ? "-120%" : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full px-3 pt-3 md:px-6 md:pt-4 pointer-events-none"
    >
      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto mx-auto flex h-14 max-w-[1180px] items-center justify-between rounded-full border pl-5 pr-2 transition-all duration-300",
          scrolled
            ? "border-border bg-background/80 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]"
            : "border-transparent bg-transparent",
        )}
      >
        <Link
          href="/"
          aria-label="Alif Fajriadi — home"
          className="font-display text-xl font-bold tracking-tight flex items-center gap-1"
        >
          alif
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={cn(
                  "relative block rounded-full px-4 py-2 text-sm transition-colors",
                  isActive(item.path)
                    ? "bg-[var(--ink)] text-[color:var(--paper)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            className="hidden sm:flex items-center gap-2 h-9 rounded-full border border-border bg-card pl-3 pr-2 text-xs text-muted-foreground hover:border-[var(--ink)] transition-colors"
            aria-label={t("Search", "Cari")}
          >
            <Search size={14} />
            <span>{t("Search", "Cari")}</span>
            <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
            aria-label={t("Search", "Cari")}
          >
            <Search size={15} />
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 font-mono text-[11px] uppercase tracking-wider hover:border-[var(--ink)] transition-colors active:scale-95"
            aria-label="Switch language"
          >
            <Languages size={13} className="text-[color:var(--accent)]" />
            {lang}
          </button>
          <button
            onClick={toggleFontSize}
            className={cn(
              "hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border font-display text-sm font-semibold transition-colors active:scale-95",
              isLargeFont
                ? "bg-[var(--ink)] text-[color:var(--paper)]"
                : "bg-card hover:border-[var(--ink)]",
            )}
            aria-label={t("Toggle large text", "Ubah ukuran teks")}
            aria-pressed={isLargeFont}
          >
            Aa
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
