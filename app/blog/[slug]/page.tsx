"use client";

import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, getBlogBySlug } from "@/lib/api";
import Link from "next/link";
import { ChevronLeft, Calendar, Tag, Clock, Loader2 } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import parse from "html-react-parser";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguage();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => getBlogBySlug(slug as string),
  });

  if (isLoading)
    return (
      <div className="py-40 flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Retrieving Manuscript...
        </p>
      </div>
    );
  if (isError || !blog) notFound();

  const content = t(blog.content_en, blog.content_id);
  const title = t(blog.title_en, blog.title_id);
  const excerpt = t(blog.excerpt_en, blog.excerpt_id);

  // SEO JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    image: blog.image ? [blog.image] : [],
    datePublished: blog.date,
    dateModified: blog.date,
    author: [
      {
        "@type": "Person",
        name: "Alif",
        url: API_BASE_URL, // Update for prod
      },
    ],
    description: excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="py-24 animate-in fade-in duration-700 selection:bg-primary selection:text-primary-foreground">
        <div className="container-custom max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all mb-16 group"
          >
            <ChevronLeft
              size={20}
              className="transition-transform group-hover:-translate-x-1.5"
            />{" "}
            {t("Return to Archives", "Kembali ke Arsip")}
          </Link>

          <header className="mb-20">
            <div className="flex flex-wrap items-center gap-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-12">
              <span className="flex items-center gap-2.5 text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-lg shadow-primary/5">
                <Tag size={12} strokeWidth={3} /> {blog.category}
              </span>
              <span className="flex items-center gap-2.5">
                <Calendar size={12} strokeWidth={3} />{" "}
                {new Date(blog.date || new Date()).toLocaleDateString(
                  undefined,
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </span>
              <span className="flex items-center gap-2.5">
                <Clock size={12} strokeWidth={3} />{" "}
                {Math.ceil((content?.length || 0) / 200)} min read
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-12 leading-none tracking-tighter uppercase whitespace-pre-line">
              {title}
            </h1>

            <div className="relative p-10 bg-muted/30 rounded-5xl border border-border mb-20 group hover:border-primary/30 transition-all duration-500">
              <div className="absolute top-0 left-10 -translate-y-1/2 bg-primary text-primary-foreground text-[8px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-xl">
                Abstract
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed italic">
                &quot;{excerpt}&quot;
              </p>
            </div>

            {blog.image && (
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-20 border border-border bg-muted shadow-3xl group">
                <Image
                  src={blog.image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent" />
              </div>
            )}
          </header>

          <div className="tiptap-content">{parse(content || "")}</div>

          <div className="mt-40 pt-20 border-t border-border flex flex-col items-center text-center group">
            <div className="relative w-32 h-32 mb-10">
              <div className="absolute inset-0 bg-primary/20 rounded-[3rem] rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary text-primary-foreground flex items-center justify-center text-4xl font-black rounded-[3rem] shadow-2xl">
                A
              </div>
            </div>
            <h4 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">
              Manuscript by Alif
            </h4>
            <p className="text-muted-foreground max-w-md font-medium text-lg leading-relaxed">
              Full-stack Engineer dedicated to the craft of technical
              storytelling through code and architecture.
            </p>
          </div>
        </div>
      </article>

      <style jsx global>{`
        .tiptap-content h2 {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.1;
          margin-top: 6rem;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: -0.05em;
          color: var(--foreground);
        }
        .tiptap-content h3 {
          font-size: 2rem;
          font-weight: 900;
          line-height: 1.1;
          margin-top: 4rem;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          color: var(--foreground);
        }
        .tiptap-content p {
          font-size: 1.35rem;
          line-height: 1.8;
          margin-bottom: 2.5rem;
          color: var(--muted-foreground);
          font-weight: 500;
        }
        .tiptap-content blockquote {
          border-left: 8px solid var(--primary);
          padding: 3rem;
          background: var(--muted);
          border-radius: 0 3rem 3rem 0;
          margin: 4rem 0;
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1.1;
          color: var(--foreground);
          font-style: italic;
        }
        .tiptap-content pre {
          background: var(--muted);
          padding: 2.5rem;
          border-radius: 2rem;
          margin: 4rem 0;
          border: 1px solid var(--border);
          overflow-x: auto;
          font-family: var(--font-geist-mono);
          font-size: 1.1rem;
        }
        .tiptap-content img {
          border-radius: 3rem;
          margin: 5rem 0;
          border: 1px solid var(--border);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .tiptap-content a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 8px;
          text-decoration-thickness: 3px;
          font-weight: 700;
        }
        @media (max-width: 768px) {
          .tiptap-content h2 {
            font-size: 2rem;
          }
          .tiptap-content p {
            font-size: 1.15rem;
          }
          .tiptap-content blockquote {
            font-size: 1.5rem;
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
