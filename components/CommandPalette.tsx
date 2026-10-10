"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  Home,
  Briefcase,
  PenLine,
  Camera,
  Moon,
  Languages,
  FileText,
  Github,
  Mail,
} from "lucide-react";
import { getBlogs, Blog } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";

type Item = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number }>;
  run: () => void;
  group: string;
};

export default function CommandPalette() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: blogs } = useQuery<Blog[]>({
    queryKey: ["blogs", "All", ""],
    queryFn: () => getBlogs(),
    enabled: open,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQ("");
        setActive(0);
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => {
      setQ("");
      setActive(0);
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const go = (href: string) => () => {
    setOpen(false);
    router.push(href);
  };

  const items = useMemo<Item[]>(() => {
    const nav: Item[] = [
      { id: "home", label: t("Home", "Beranda"), icon: Home, run: go("/"), group: t("Navigate", "Navigasi") },
      { id: "work", label: t("Work", "Proyek"), icon: Briefcase, run: go("/projects"), group: t("Navigate", "Navigasi") },
      { id: "writing", label: t("Writing", "Tulisan"), icon: PenLine, run: go("/blog"), group: t("Navigate", "Navigasi") },
      { id: "gallery", label: t("Gallery", "Galeri"), icon: Camera, run: go("/gallery"), group: t("Navigate", "Navigasi") },
    ];
    const actions: Item[] = [
      {
        id: "theme",
        label: t("Toggle theme", "Ganti tema"),
        icon: Moon,
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          setOpen(false);
        },
        group: t("Actions", "Aksi"),
      },
      {
        id: "lang",
        label: lang === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English",
        icon: Languages,
        run: () => {
          setLang(lang === "en" ? "id" : "en");
          setOpen(false);
        },
        group: t("Actions", "Aksi"),
      },
      {
        id: "mail",
        label: t("Send an email", "Kirim email"),
        hint: SITE.email,
        icon: Mail,
        run: () => {
          window.location.href = `mailto:${SITE.email}`;
        },
        group: t("Actions", "Aksi"),
      },
      {
        id: "gh",
        label: "GitHub",
        icon: Github,
        run: () => window.open(SITE.github, "_blank", "noopener"),
        group: t("Actions", "Aksi"),
      },
    ];
    const posts: Item[] = (blogs || []).map((b) => ({
      id: `post-${b.slug}`,
      label: t(b.title_en, b.title_id),
      hint: b.category,
      icon: FileText,
      run: go(`/blog/${b.slug}`),
      group: t("Articles", "Artikel"),
    }));
    return [...nav, ...posts, ...actions];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs, lang, resolvedTheme]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items.filter((i) => i.group !== t("Articles", "Artikel")).concat(items.filter((i) => i.group === t("Articles", "Artikel")).slice(0, 4));
    return items.filter((i) => `${i.label} ${i.hint || ""}`.toLowerCase().includes(needle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, q]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      results[active]?.run();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={t("Command palette", "Palet perintah")}
        >
          <button
            aria-label="Close"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search size={17} className="text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={t("Search pages, articles, actions…", "Cari halaman, artikel, aksi…")}
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                esc
              </kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && (
                <li className="px-3 py-10 text-center text-sm text-muted-foreground">
                  {t("Nothing found.", "Tidak ditemukan.")}
                </li>
              )}
              {results.map((item, i) => {
                const header = item.group !== lastGroup;
                lastGroup = item.group;
                return (
                  <li key={item.id} role="presentation">
                    {header && (
                      <div className="eyebrow px-3 pb-1 pt-3">{item.group}</div>
                    )}
                    <button
                      role="option"
                      aria-selected={i === active}
                      onMouseMove={() => setActive(i)}
                      onClick={item.run}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        i === active ? "bg-muted" : ""
                      }`}
                    >
                      <item.icon size={16} />
                      <span className="grow truncate">{item.label}</span>
                      {item.hint && (
                        <span className="chip !py-0.5">{item.hint}</span>
                      )}
                      {i === active && (
                        <CornerDownLeft size={14} className="text-muted-foreground" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
