"use client";

import { useDeferredValue, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Search, X } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { getBlogs, getBlogCategories, Blog } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import PostCard from "@/components/blog/PostCard";
import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";

export default function BlogList({
  initialBlogs,
  initialCategories,
}: {
  initialBlogs: Blog[];
  initialCategories: string[];
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const deferredSearch = useDeferredValue(search);
  const { slugs: saved } = useBookmarks();
  const [onlySaved, setOnlySaved] = useState(false);
  const pristine = category === "All" && deferredSearch === "" && !onlySaved;

  const { data: blogs, isFetching } = useQuery<Blog[]>({
    queryKey: ["blogs", category, deferredSearch],
    queryFn: () => getBlogs({ category, search: deferredSearch }),
    initialData: pristine ? initialBlogs : undefined,
    staleTime: 30_000,
  });
  const { data: categories } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: getBlogCategories,
    initialData: initialCategories,
  });

  const list = onlySaved ? (blogs || []).filter((b) => saved.includes(b.slug)) : blogs || [];
  const [hero, ...rest] = list;
  const showHero = pristine && hero;

  return (
    <div className="pb-24 pt-12 md:pt-20">
      <div className="container-custom">
        <header className="mb-12 md:mb-16">
          <div className="eyebrow mb-5">
            <span className="idx">(Writing)</span> {blogs?.length ?? 0} {t("articles", "artikel")}
          </div>
          <h1 className="font-display text-5xl md:text-8xl leading-[0.95]">
            {t("Notes &", "Catatan &")}{" "}
            <span className="font-accent text-[color:var(--accent)]">{t("essays.", "esai.")}</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg text-muted-foreground">
            {t(
              "Technical deep dives, things I broke and fixed, and ideas worth writing down.",
              "Pendalaman teknis, hal-hal yang pernah rusak dan kuperbaiki, serta ide yang layak dicatat.",
            )}
          </p>
        </header>

        <div className="mb-12 flex flex-col gap-4 border-y border-border py-4 md:flex-row md:items-center md:justify-between">
          <div
            role="tablist"
            aria-label={t("Categories", "Kategori")}
            className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1"
          >
            <button
              role="tab"
              aria-selected={onlySaved}
              onClick={() => setOnlySaved((v) => !v)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors",
                onlySaved
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[color:var(--accent)]"
                  : "border-border text-muted-foreground hover:border-[var(--ink)] hover:text-foreground",
              )}
            >
              <Bookmark size={14} className={cn(onlySaved && "fill-current")} />
              {t("Saved", "Tersimpan")} {saved.length > 0 && <span className="font-mono text-xs">{saved.length}</span>}
            </button>
            {categories?.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={category === cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                  category === cat
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[color:var(--paper)]"
                    : "border-border text-muted-foreground hover:border-[var(--ink)] hover:text-foreground",
                )}
              >
                {cat === "All" ? t("All", "Semua") : cat}
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search articles…", "Cari artikel…")}
              aria-label={t("Search articles", "Cari artikel")}
              className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-10 text-sm outline-none transition-colors focus:border-[var(--ink)]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {list.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border py-24 text-center">
            <p className="font-accent text-3xl">{onlySaved ? t("Your reading list is empty.", "Daftar bacamu masih kosong.") : t("Nothing here yet.", "Belum ada apa-apa.")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {onlySaved
                ? t("Tap the bookmark on any article to save it for later.", "Ketuk ikon bookmark pada artikel untuk menyimpannya.")
                : t("Try a different keyword or category.", "Coba kata kunci atau kategori lain.")}
            </p>
          </div>
        )}

        <div className={cn("transition-opacity", isFetching && !pristine && "opacity-60")}>
          {showHero && (
            <Reveal className="mb-16">
              <PostCard post={hero} size="lg" priority />
            </Reveal>
          )}

          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {(showHero ? rest : list).map((post, i) => (
              <Reveal key={post.id || post.slug} delay={(i % 3) * 0.06}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
