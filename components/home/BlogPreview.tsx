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
    <section
      className="py-20 md:py-28"
      style={{ borderTop: "1px solid var(--border-outline)" }}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="eyebrow-label mb-4" style={{ justifyContent: "flex-start" }}>
              {t("Writing", "Tulisan")}
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold leading-tight"
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                color: "var(--color-primary-dark)",
              }}
            >
              {t("Latest", "Artikel")}
              <br />
              <em style={{ color: "var(--color-accent-italic)" }}>
                {t("Articles", "Terkini")}
              </em>
            </h2>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors group"
            style={{ color: "var(--color-primary)" }}
          >
            {t("Read All", "Baca Semua")}
            <ChevronRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {latest?.map((post: Blog) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border-outline)",
                borderRadius: "1.5rem",
              }}
            >
              {/* Image */}
              <Link
                href={`/blog/${post.slug}`}
                className="relative h-44 w-full overflow-hidden block"
              >
                <Image
                  src={post.image || "/blog-placeholder.png"}
                  alt={t(post.title_en, post.title_id)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest backdrop-blur-md"
                    style={{
                      background: "rgba(242,248,241,0.92)",
                      color: "var(--color-primary)",
                      border: "1px solid var(--border-outline)",
                    }}
                  >
                    {post.category}
                  </span>
                </div>
              </Link>

              {/* Content */}
              <Link
                href={`/blog/${post.slug}`}
                className="p-6 flex flex-col flex-grow"
              >
                <div
                  className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest mb-3"
                  style={{ color: "var(--color-text-body)" }}
                >
                  <Calendar size={10} style={{ color: "var(--color-primary)" }} />
                  {new Date(post.date || new Date()).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                <h3
                  className="text-lg font-bold mb-2 leading-snug transition-colors duration-200 group-hover:text-[var(--color-primary)]"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    color: "var(--color-primary-dark)",
                  }}
                >
                  {t(post.title_en, post.title_id)}
                </h3>

                <p
                  className="text-sm line-clamp-2 mb-5 leading-relaxed italic"
                  style={{ color: "var(--color-text-body)" }}
                >
                  {t(post.excerpt_en, post.excerpt_id)}
                </p>

                <div
                  className="mt-auto pt-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest"
                  style={{
                    borderTop: "1px solid var(--border-outline)",
                    color: "var(--color-primary)",
                  }}
                >
                  <span>{t("Read Article", "Baca Artikel")}</span>
                  <ChevronRight
                    size={13}
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
