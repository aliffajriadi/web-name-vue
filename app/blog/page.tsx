"use client";

import { useState, useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlogs, getBlogCategories, Blog } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const deferredSearch = useDeferredValue(search);

  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ["blogs", category, deferredSearch],
    queryFn: () => getBlogs({ category, search: deferredSearch }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getBlogCategories,
  });

  return (
    <div className="py-24">
      <div className="container-custom">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight uppercase">
            Articles
          </h1>
          <p className="text-xl text-muted-foreground mb-8 font-medium">
            {t(
              "Ideas, technical deep dives, and engineering solutions.",
              "Ide, pendalaman teknis, dan solusi rekayasa.",
            )}
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative grow">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                placeholder={t("Search articles...", "Cari artikel...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-2xl px-12 py-4 text-foreground font-medium focus:outline-none focus:border-primary transition-all shadow-sm"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-card border border-border rounded-2xl px-6 py-4 text-foreground font-black uppercase tracking-widest text-xs focus:outline-none focus:border-primary cursor-pointer min-w-[180px] shadow-sm appearance-none"
            >
              {categories?.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </header>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="space-y-20">
            {blogs?.length === 0 && (
              <div className="py-20 text-center border border-dashed border-border rounded-4xl">
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
                  No records found matching criteria.
                </p>
              </div>
            )}
            {blogs?.map((post: Blog) => (
              <article
                key={post.id}
                className="group flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {post.image && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-video w-full md:w-80 rounded-4xl overflow-hidden shrink-0 border border-border bg-muted shadow-lg"
                  >
                    <Image
                      src={post.image}
                      alt={t(post.title_en, post.title_id)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                )}
                <div className="grow space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                    <span>{post.category}</span>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-muted-foreground font-medium">
                      {new Date(post.date || new Date()).toLocaleDateString(
                        undefined,
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                      {t(post.title_en, post.title_id)}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground leading-relaxed text-base font-medium line-clamp-2 md:line-clamp-3">
                    {t(post.excerpt_en, post.excerpt_id)}
                  </p>
                  <div className="flex items-center gap-6">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary group/link"
                    >
                      {t("Open File", "Buka File")}{" "}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover/link:translate-x-1"
                      />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const url = `${window.location.origin}/blog/${post.slug}`;
                        if (navigator.share) {
                          navigator
                            .share({
                              title: post.title_en || "Blog Post",
                              text: post.excerpt_en || "",
                              url: url,
                            })
                            .catch(console.error);
                        } else {
                          navigator.clipboard.writeText(url);
                          alert("Link copied!");
                        }
                      }}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
