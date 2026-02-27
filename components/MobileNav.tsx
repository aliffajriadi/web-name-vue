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
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/80 backdrop-blur-xl border-t border-border px-8 py-4 pb-8 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.1)]",
      )}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300",
              isActive
                ? "text-primary scale-110"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">
              {item.name}
            </span>
          </Link>
        );
      })}
    </motion.div>
  );
}
