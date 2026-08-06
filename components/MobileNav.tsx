"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, FileText, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { motion } from "framer-motion";

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const scrollDirection = useScrollDirection();
  const isVisible = scrollDirection !== "down";

  const navItems = [
    { name: t("Home", "Beranda"), path: "/", icon: Home },
    { name: t("Work", "Proyek"), path: "/projects", icon: Briefcase },
    { name: t("Life", "Galeri"), path: "/gallery", icon: Camera },
    { name: t("Blog", "Blog"), path: "/blog", icon: FileText },
  ];

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn("fixed bottom-0 left-0 right-0 z-50 md:hidden backdrop-blur-xl px-8 py-4 pb-8 flex justify-between items-center")}
      style={{
        background: "rgba(242, 248, 241, 0.92)",
        borderTop: "1px solid var(--border-outline)",
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300",
            )}
            style={{
              color: isActive ? "var(--color-primary)" : "var(--color-text-body)",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
          >
            <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
            <span
              className="text-[10px] font-medium uppercase tracking-[0.15em]"
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </motion.div>
  );
}
