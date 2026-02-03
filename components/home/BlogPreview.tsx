"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlogs, Blog } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogPreview() {
  const { t } = useLanguage();
  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ["blogs", "latest"],
    queryFn: () => getBlogs(),
  });

  const latest = blogs?.slice(0, 3);

  if (isLoading) return null;

  return (
    <section className="py-20 border-t border-border">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight uppercase">
              {t("Article", "Artikel")}
            </h2>
            <p className="text-muted-foreground font-medium">
              {t(
                "Thoughts on modern architecture & hardware.",
                "Pemikiran tentang arsitektur modern & perangkat keras.",
              )}
            </p>
          </div>
          <Link
            href="/blog"
            className="text-primary hover:underline text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 group"
          >
            {t("Read All", "Baca Semua")}{" "}
            <ChevronRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latest?.map((post: Blog) => (
            <article
              key={post.id}
              className="group flex flex-col bg-card border border-border rounded-4xl overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative h-48 w-full overflow-hidden"
              >
                <Image
                  src={post.image || "/blog-placeholder.png"}
                  alt={t(post.title_en, post.title_id)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest border border-border">
                    {post.category}
                  </span>
                </div>
              </Link>
              <Link
                href={`/blog/${post.slug}`}
                className="p-8 flex flex-col grow"
              >
                <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                  <Calendar size={10} className="text-primary" />
                  {new Date(post.date || new Date()).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                  {t(post.title_en, post.title_id)}
                </h3>
                <p className="text-muted-foreground text-sm font-medium line-clamp-2 italic mb-6">
                  {t(post.excerpt_en, post.excerpt_id)}
                </p>
                <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                  <span>Open Manuscript</span>
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
