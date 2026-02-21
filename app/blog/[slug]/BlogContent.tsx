"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Calendar,
  Tag,
  Clock,
  Share2,
  Check,
  InstagramIcon,
  LinkedinIcon,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import parse from "html-react-parser";
import { Blog, API_BASE_URL, getProfile, getBlogs } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function BlogContent({ blog }: { blog: Blog }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: allBlogs } = useQuery<Blog[]>({
    queryKey: ["blogs"],
    queryFn: () => getBlogs(),
  });

  const relatedBlogs = allBlogs
    ?.filter((b) => (b.id && blog.id ? b.id !== blog.id : b.slug !== blog.slug))
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === blog.category && b.category !== blog.category)
        return -1;
      if (a.category !== blog.category && b.category === blog.category)
        return 1;
      return 0;
    })
    .slice(0, 3);

  console.log(profile);

  const content = t(blog.content_en, blog.content_id);
  const title = t(blog.title_en, blog.title_id);
  const excerpt = t(blog.excerpt_en, blog.excerpt_id);

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        url: API_BASE_URL,
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
      <article className="py-24 animate-in fade-in duration-700 selection:bg-primary selection:text-primary-foreground min-h-screen">
        <div className="container-custom max-w-4xl">
          <div className="flex justify-between items-center mb-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all group"
            >
              <ChevronLeft
                size={20}
                className="transition-transform group-hover:-translate-x-1.5"
              />{" "}
              {t("Return to Archives", "Kembali ke Arsip")}
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all group"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Share2
                    size={16}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          <header className="mb-20">
            {/* Title First as requested */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-12 leading-none tracking-tighter uppercase whitespace-pre-line wrap-break-word">
              {title}
            </h1>

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

          <div className="tiptap-content text-foreground">
            {parse(content || "")}
          </div>

          <div className="mt-40 pt-20 border-t border-border flex flex-col items-center text-center group">
            {profile?.imageUrl && (
              <div className="relative w-32 h-32 mb-10">
                <Image
                  src={profile.imageUrl}
                  alt="Alif"
                  fill
                  className="object-cover rounded-full transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              </div>
            )}
            <h4 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">
              {t(
                `Article by ${profile?.name}`,
                `Artikel oleh ${profile?.name}`,
              )}
            </h4>
            <p className="text-muted-foreground max-w-md font-medium text-lg leading-relaxed">
              {t(profile?.tagline_en, profile?.tagline_id)}
            </p>
            <div className="flex gap-4 mt-4">
              <Link href={profile?.instagram || "#"} target="_blank">
                <InstagramIcon size={24} />
              </Link>
              <Link href={profile?.linkedin || "#"} target="_blank">
                <LinkedinIcon size={24} />
              </Link>
            </div>
          </div>
        </div>

        {relatedBlogs && relatedBlogs.length > 0 && (
          <div className="container-custom mt-40 pt-20 border-t border-border/50">
            <div className="flex items-center justify-between pt-10 mb-12">
              <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter">
                {t("Continue Reading", "Artikel Terkait")}
              </h3>
              <Link
                href="/blog"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all"
              >
                {t("View Archive", "Lihat Arsip")} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedPost) => (
                <Link
                  key={relatedPost.id || relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-border bg-muted">
                    {relatedPost.image && (
                      <Image
                        src={relatedPost.image}
                        alt={t(relatedPost.title_en, relatedPost.title_id)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">
                      {relatedPost.category}
                    </div>
                    <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-tight uppercase tracking-tight line-clamp-2">
                      {t(relatedPost.title_en, relatedPost.title_id)}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 font-medium">
                      {t(relatedPost.excerpt_en, relatedPost.excerpt_id)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <style jsx global>{`
        /* Typography System */
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
          font-size: 1.25rem;
          line-height: 1.8;
          margin-bottom: 2rem;
          color: var(--muted-foreground);
          font-weight: 400;
        }

        /* Lists */
        .tiptap-content ul,
        .tiptap-content ol {
          margin: 2rem 0;
          padding-left: 2rem;
          color: var(--muted-foreground);
          font-size: 1.25rem;
          line-height: 1.8;
        }
        .tiptap-content ul {
          list-style-type: disc;
        }
        .tiptap-content ol {
          list-style-type: decimal;
        }
        .tiptap-content li {
          margin-bottom: 0.75rem;
        }

        /* Tables */
        .tiptap-content table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 3rem 0;
          border-radius: 1.5rem;
          overflow: hidden;
          border: 1px solid var(--border);
          font-size: 1rem;
        }
        .tiptap-content th,
        .tiptap-content td {
          padding: 1.25rem;
          border-bottom: 1px solid var(--border);
          text-align: left;
        }
        .tiptap-content th {
          background-color: var(--muted);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85rem;
          color: var(--foreground);
        }
        .tiptap-content tr:last-child td {
          border-bottom: none;
        }
        .tiptap-content tr:hover td {
          background-color: var(--muted);
          transition: background-color 0.2s;
        }

        /* Quotes & Code */
        .tiptap-content blockquote {
          border-left: 6px solid var(--primary);
          padding: 2.5rem;
          background: var(--muted);
          border-radius: 0 2rem 2rem 0;
          margin: 3rem 0;
          font-size: 2rem;
          font-weight: 900;
          line-height: 1.2;
          color: var(--foreground);
          font-style: italic;
        }
        .tiptap-content pre {
          background: #0f172a; /* Slate 950 */
          color: #f8fafc;
          padding: 2rem;
          border-radius: 2rem;
          margin: 3rem 0;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* Images */
        .tiptap-content img {
          border-radius: 2rem;
          margin: 4rem 0;
          width: 100%;
          height: auto;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
        }

        /* Links */
        .tiptap-content a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 6px;
          text-decoration-thickness: 2px;
          font-weight: 700;
          transition: opacity 0.2s;
        }
        .tiptap-content a:hover {
          opacity: 0.8;
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
