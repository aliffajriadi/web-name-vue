"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import parse, { DOMNode, Element, attributesToProps, domToReact } from "html-react-parser";
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Clock, Eye } from "lucide-react";
import { Blog, getBlogs, getProfile, registerBlogView } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { htmlToText, readingMinutes, SITE } from "@/lib/site";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents, { Heading } from "@/components/blog/TableOfContents";
import LikeButton, { useBlogStats } from "@/components/blog/LikeButton";
import ShareButtons from "@/components/blog/ShareButtons";
import CodeBlock from "@/components/blog/CodeBlock";
import PostCard from "@/components/blog/PostCard";
import BookmarkButton from "@/components/blog/BookmarkButton";
import Lightbox, { LightboxImage } from "@/components/blog/Lightbox";
import SelectionToolbar from "@/components/blog/SelectionToolbar";
import ListenButton from "@/components/blog/ListenButton";
import FloatingActions from "@/components/blog/FloatingActions";
import { useReadingProgress } from "@/hooks/useReadingProgress";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70) || "section";

/** Pull h2/h3 out of the raw HTML so the TOC exists on the very first render. */
function extractHeadings(html: string): Heading[] {
  const seen = new Map<string, number>();
  const out: Heading[] = [];
  for (const m of html.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const text = htmlToText(m[2]);
    if (!text) continue;
    const base = slugify(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    out.push({ id: n ? `${base}-${n}` : base, text, level: Number(m[1]) as 2 | 3 });
  }
  return out;
}

function nodeText(n: unknown): string {
  const node = n as { data?: string; children?: unknown[] };
  if (typeof node.data === "string") return node.data;
  return (node.children || []).map(nodeText).join("");
}

function renderArticle(html: string, headings: Heading[]) {
  let h = 0;
  return parse(html, {
    replace(node) {
      if (!(node instanceof Element)) return;

      if (node.name === "h2" || node.name === "h3") {
        const text = htmlToText(nodeText(node));
        const heading = text ? headings[h++] : undefined;
        const Tag = node.name;
        return (
          <Tag id={heading?.id}>
            {domToReact(node.children as DOMNode[])}
            {heading && (
              <a href={`#${heading.id}`} className="anchor" aria-label={`Link to ${heading.text}`}>
                #
              </a>
            )}
          </Tag>
        );
      }

      if (node.name === "pre") {
        const code = node.children.find(
          (c): c is Element => c instanceof Element && c.name === "code",
        );
        const lang = code?.attribs?.class?.match(/language-([\w-]+)/)?.[1];
        return <CodeBlock language={lang} code={nodeText(code ?? node).replace(/\n$/, "")} />;
      }

      if (node.name === "table") {
        return (
          <div className="table-wrap">
            <table>{domToReact(node.children as DOMNode[])}</table>
          </div>
        );
      }

      if (node.name === "img" && node.attribs.src) {
        const { src, alt } = node.attribs;
        const parentClass = (node.parent as Element | null)?.attribs?.class || "";
        if (/kg-bookmark-thumb|kg-gallery/.test(parentClass)) {
          // eslint-disable-next-line @next/next/no-img-element
          return <img src={src} alt={alt || ""} loading="lazy" decoding="async" />;
        }
        return (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt || ""} loading="lazy" decoding="async" />
            {alt && <figcaption>{alt}</figcaption>}
          </figure>
        );
      }

      if (node.name === "a" && /^https?:\/\//.test(node.attribs.href || "")) {
        const { href } = node.attribs;
        const internal = href.includes("aliffajriadi.my.id");
        return (
          <a {...attributesToProps(node.attribs)} {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
            {domToReact(node.children as DOMNode[], { replace: undefined })}
          </a>
        );
      }
    },
  });
}

export default function BlogContent({ blog }: { blog: Blog }) {
  const { t, lang } = useLanguage();

  const title = t(blog.title_en, blog.title_id) || blog.title_en || blog.title_id;
  const excerpt = t(blog.excerpt_en, blog.excerpt_id) || blog.excerpt_en || blog.excerpt_id;
  const content = t(blog.content_en, blog.content_id) || blog.content_en || blog.content_id || "";

  const headings = useMemo(() => extractHeadings(content), [content]);
  const body = useMemo(() => renderArticle(content, headings), [content, headings]);
  const minutes = readingMinutes(content);
  const pct = useReadingProgress("article-body");

  // click any image in the article to open the viewer
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const onProseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = (e.target as HTMLElement).closest("img");
    if (!img || img.closest(".kg-bookmark")) return;
    const all = Array.from(e.currentTarget.querySelectorAll("img")).filter((i) => !i.closest(".kg-bookmark"));
    setImages(all.map((i) => ({ src: i.currentSrc || i.src, alt: i.alt })));
    setLbIndex(all.indexOf(img));
  };
  const closeLb = useCallback(() => setLbIndex(null), []);

  const { data: stats } = useBlogStats(blog.slug);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: allBlogs } = useQuery<Blog[]>({
    queryKey: ["blogs", "All", ""],
    queryFn: () => getBlogs(),
  });

  // count a view once per browser session
  useEffect(() => {
    const key = `viewed:${blog.slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode: count anyway */
    }
    registerBlogView(blog.slug).catch(() => {});
  }, [blog.slug]);

  const others = (allBlogs || []).filter((b) => b.slug !== blog.slug);
  const related = [...others]
    .sort((a, b) => Number(b.category === blog.category) - Number(a.category === blog.category))
    .slice(0, 3);
  const idx = (allBlogs || []).findIndex((b) => b.slug === blog.slug);
  const newer = idx > 0 ? allBlogs![idx - 1] : undefined;
  const older = idx >= 0 && idx < (allBlogs?.length ?? 0) - 1 ? allBlogs![idx + 1] : undefined;

  const date = new Date(blog.date ?? 0);
  const dateLabel = date.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const tocTitle = t("On this page", "Di halaman ini");

  return (
    <>
      <ReadingProgress pct={pct} />

      <article className="pb-24 pt-10 md:pt-16">
        {/* ───────── header ───────── */}
        <header className="container-custom">
          <div className="mx-auto max-w-[860px]">
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <Link href="/blog" className="inline-flex items-center gap-1.5 link-u hover:text-foreground">
                <ArrowLeft size={12} /> {t("Writing", "Tulisan")}
              </Link>
              <span aria-hidden>/</span>
              <span className="chip !py-0.5 !text-[color:var(--accent)]">{blog.category}</span>
            </nav>

            <h1 className="font-display text-[clamp(2.2rem,5.6vw,4.4rem)] leading-[1.02] tracking-[-0.04em]">
              {title}
            </h1>

            {excerpt && (
              <p className="mt-6 max-w-[60ch] font-serif text-xl leading-relaxed text-muted-foreground md:text-2xl">
                {excerpt}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-muted">
                  {profile?.imageUrl && (
                    <Image src={profile.imageUrl} alt="" fill sizes="36px" className="object-cover" />
                  )}
                </span>
                <span className="font-medium">{profile?.name || SITE.name}</span>
              </div>
              <time dateTime={date.toISOString()} className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Calendar size={14} /> {dateLabel}
              </time>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock size={14} /> {minutes} {t("min read", "menit baca")}
              </span>
              {typeof stats?.views === "number" && (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Eye size={14} /> {stats.views.toLocaleString(lang === "id" ? "id-ID" : "en-US")}
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <ListenButton
                title={title}
                html={content}
                lang={lang}
                labels={{
                  listen: t("Listen", "Dengarkan"),
                  pause: t("Pause", "Jeda"),
                  resume: t("Resume", "Lanjut"),
                  stop: t("Stop", "Berhenti"),
                }}
              />
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookmarkButton slug={blog.slug} className="h-10 w-10 rounded-full hover:bg-muted hover:text-foreground" />
                <button
                  onClick={() => window.print()}
                  className="hidden h-10 rounded-full px-3 text-xs hover:bg-muted hover:text-foreground sm:block"
                >
                  {t("Print", "Cetak")}
                </button>
              </div>
            </div>
          </div>

          {blog.image && (
            <div className="mx-auto mt-8 max-w-[860px]">
              <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-border bg-muted">
                <Image
                  src={blog.image}
                  alt={title}
                  fill
                  priority
                  sizes="(min-width:900px) 860px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </header>

        {/* ───────── body ───────── */}
        <div className="container-custom mt-12 md:mt-16">
          <div className="mx-auto grid max-w-[1120px] gap-x-12 lg:grid-cols-[48px_minmax(0,720px)] lg:justify-center xl:grid-cols-[48px_minmax(0,720px)_240px]">
            {/* left action rail */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 flex flex-col items-center gap-9">
                <LikeButton slug={blog.slug} variant="rail" />
                <div className="h-4" />
                <BookmarkButton slug={blog.slug} className="h-12 w-12 rounded-full border border-border bg-card hover:border-[var(--ink)]" />
                <ShareButtons title={title} text={excerpt} vertical />
              </div>
            </aside>

            <div id="article-body" className="min-w-0">
              <TableOfContents headings={headings} title={tocTitle} variant="inline" />

              <div className="article-prose" onClick={onProseClick}>
                {body}
              </div>

              {/* end-of-article */}
              <div className="mt-16 rounded-3xl border border-border bg-muted/50 p-6 md:p-8">
                <p className="font-display text-2xl md:text-3xl">
                  {t("Did this help you?", "Artikel ini membantu?")}{" "}
                  <span className="font-accent text-[color:var(--accent)]">
                    {t("Say thanks.", "Beri apresiasi.")}
                  </span>
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
                  <LikeButton slug={blog.slug} variant="pill" label={t("Like", "Suka")} />
                  <ShareButtons title={title} text={excerpt} />
                </div>
              </div>

              {/* author */}
              <div className="mt-10 flex items-start gap-5 border-t border-border pt-10">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                  {profile?.imageUrl && (
                    <Image src={profile.imageUrl} alt={profile?.name || "Author"} fill sizes="64px" className="object-cover" />
                  )}
                </span>
                <div>
                  <div className="eyebrow mb-1">{t("Written by", "Ditulis oleh")}</div>
                  <p className="font-display text-xl">{profile?.name || SITE.name}</p>
                  <p className="mt-1 max-w-[46ch] text-sm text-muted-foreground">
                    {t(profile?.tagline_en, profile?.tagline_id)}
                  </p>
                  <Link href="/#contact" className="mt-3 inline-flex items-center gap-1 text-sm font-medium link-u">
                    {t("Work with me", "Bekerja sama")} <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* right TOC */}
            <aside className="hidden xl:block">
              <TableOfContents headings={headings} title={tocTitle} variant="sidebar" />
            </aside>
          </div>
        </div>

        {/* ───────── prev / next ───────── */}
        {(newer || older) && (
          <nav aria-label="Article navigation" className="container-custom mt-20">
            <div className="mx-auto grid max-w-[1120px] gap-4 md:grid-cols-2">
              {[
                { post: newer, dir: "prev" as const },
                { post: older, dir: "next" as const },
              ].map(({ post, dir }) =>
                post ? (
                  <Link
                    key={dir}
                    href={`/blog/${post.slug}`}
                    className={`group rounded-2xl border border-border p-6 transition-colors hover:border-[var(--ink)] ${
                      dir === "next" ? "md:text-right" : ""
                    }`}
                  >
                    <span
                      className={`eyebrow mb-3 flex ${dir === "next" ? "md:justify-end" : ""}`}
                    >
                      {dir === "prev" ? (
                        <>
                          <ArrowLeft size={13} /> {t("Newer", "Lebih baru")}
                        </>
                      ) : (
                        <>
                          {t("Older", "Lebih lama")} <ArrowRight size={13} />
                        </>
                      )}
                    </span>
                    <span className="font-display text-xl leading-snug group-hover:text-[color:var(--accent)] md:text-2xl">
                      {t(post.title_en, post.title_id)}
                    </span>
                  </Link>
                ) : (
                  <div key={dir} />
                ),
              )}
            </div>
          </nav>
        )}

        {/* ───────── related ───────── */}
        {related.length > 0 && (
          <section className="container-custom mt-24 border-t border-border pt-16" aria-labelledby="related-h">
            <div className="mb-10 flex items-end justify-between">
              <h2 id="related-h" className="font-display text-3xl md:text-5xl">
                {t("Keep", "Lanjut")}{" "}
                <span className="font-accent text-[color:var(--accent)]">{t("reading.", "membaca.")}</span>
              </h2>
              <Link href="/blog" className="hidden text-sm font-medium link-u sm:inline-flex">
                {t("All articles", "Semua artikel")} →
              </Link>
            </div>
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id || p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </article>

      <FloatingActions
        slug={blog.slug}
        title={title}
        text={excerpt}
        pct={pct}
        minutes={minutes}
        minLeftLabel={t("min left", "mnt lagi")}
      />
      <SelectionToolbar containerSelector=".article-prose" title={title} />
      <Lightbox images={images} index={lbIndex} onClose={closeLb} onIndex={setLbIndex} />
    </>
  );
}
