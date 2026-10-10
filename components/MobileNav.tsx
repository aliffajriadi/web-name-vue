"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, PenLine, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const scrollDirection = useScrollDirection();

  const navItems = [
    { name: t("Home", "Beranda"), path: "/", icon: Home },
    { name: t("Work", "Proyek"), path: "/projects", icon: Briefcase },
    { name: t("Writing", "Tulisan"), path: "/blog", icon: PenLine },
    { name: t("Gallery", "Galeri"), path: "/gallery", icon: Camera },
  ];

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.nav
      aria-label="Mobile"
      animate={{ y: scrollDirection === "down" ? "140%" : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden"
    >
      <ul className="flex items-center gap-1 rounded-full border border-border bg-background/85 p-1.5 backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)]">
        {navItems.map((item) => {
          const active =
            item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                aria-current={active ? "page" : undefined}
                aria-label={item.name}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-all",
                  active
                    ? "bg-[var(--ink)] text-[color:var(--paper)]"
                    : "text-muted-foreground",
                )}
              >
                <item.icon size={17} strokeWidth={active ? 2.2 : 1.7} />
                {active && <span>{item.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
