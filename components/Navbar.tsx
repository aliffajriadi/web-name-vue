"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const scrollDirection = useScrollDirection();
  const isVisible = scrollDirection !== "down";

  const navItems = [
    { name: t("Home", "Beranda"), path: "/" },
    { name: t("Projects", "Proyek"), path: "/projects" },
    { name: t("Gallery", "Galeri"), path: "/gallery" },
    { name: t("Blog", "Blog"), path: "/blog" },
  ];

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "sticky top-0 z-50 w-full bg-[var(--bg-base)]/80 backdrop-blur-md",
      )}
    >
      <div className="container-custom h-16 flex items-center justify-between">
        {/* Logo — serif monogram */}
        <Link href="/" className="group flex flex-col items-start leading-none">
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              color: "var(--color-primary-dark)",
            }}
          >
            AF
          </span>
          {/* Underline accent */}
          <span
            className="h-[2px] w-5 mt-0.5 transition-all duration-300 group-hover:w-full"
            style={{ background: "var(--color-primary)" }}
          />
        </Link>

        {/* Desktop nav */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative text-sm font-medium tracking-wide transition-colors duration-200",
                  "after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-200 after:content-['']",
                  "hover:after:w-full",
                  pathname === item.path
                    ? "after:w-full"
                    : "",
                )}
                style={{
                  color: pathname === item.path
                    ? "var(--color-primary)"
                    : "var(--color-text-nav)",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ["--tw-after-bg" as any]: "var(--color-primary)",
                }}
              >
                <span
                  style={{
                    "--after-bg": "var(--color-primary)",
                  } as React.CSSProperties}
                  className={cn(
                    "relative",
                    "after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:bg-[var(--color-primary)] after:transition-all after:duration-200",
                    pathname === item.path
                      ? "after:w-full text-[var(--color-primary)]"
                      : "after:w-0 hover:after:w-full hover:text-[var(--color-primary)] text-[var(--color-text-nav)]",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Language + Theme controls */}
          <div
            className="flex items-center gap-3 pl-4"
            style={{ borderLeft: "1px solid var(--border-outline)" }}
          >
            <button
              onClick={() => setLang(lang === "en" ? "id" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all active:scale-95 border"
              style={{
                background: "var(--muted)",
                borderColor: "var(--border-outline)",
                color: "var(--color-text-nav)",
              }}
            >
              <Languages size={13} style={{ color: "var(--color-primary)" }} />
              {lang}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
