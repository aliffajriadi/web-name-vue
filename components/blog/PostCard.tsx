"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Eye, Heart } from "lucide-react";
import { Blog } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { readingMinutes } from "@/lib/site";
import BookmarkButton from "./BookmarkButton";

export function PostMeta({ post }: { post: Blog }) {
  const { t, lang } = useLanguage();
  const d = new Date(post.date ?? 0);
  const mins = readingMinutes(t(post.content_en, post.content_id) || post.content_en);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
      <time dateTime={d.toISOString()}>
        {d.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </time>
      <span className="inline-flex items-center gap-1">
        <Clock size={11} /> {mins} {t("min", "mnt")}
      </span>
      {typeof post.views === "number" && post.views > 0 && (
        <span className="inline-flex items-center gap-1">
          <Eye size={11} /> {post.views}
        </span>
      )}
      {!!post.likesCount && (
        <span className="inline-flex items-center gap-1">
          <Heart size={11} /> {post.likesCount}
        </span>
      )}
    </div>
  );
}

export default function PostCard({
  post,
  priority = false,
  size = "md",
}: {
  post: Blog;
  priority?: boolean;
  size?: "md" | "lg";
}) {
  const { t } = useLanguage();
  const title = t(post.title_en, post.title_id);
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted"
        tabIndex={-1}
        aria-hidden
      >
        {post.image ? (
          <Image
            src={post.image}
            alt=""
            fill
            priority={priority}
            sizes={size === "lg" ? "(min-width:1024px) 720px, 100vw" : "(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center font-accent text-6xl text-[color:var(--accent)]/60">
            {title.charAt(0)}
          </div>
        )}
        <span className="chip absolute left-3 top-3 !bg-background/85 backdrop-blur">{post.category}</span>
      </Link>
        <BookmarkButton
          slug={post.slug}
          size={16}
          className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full border border-border bg-background/85 backdrop-blur hover:bg-background"
        />
      </div>

      <div className="mt-5 flex grow flex-col gap-3">
        <PostMeta post={post} />
        <h3
          className={`font-display ${
            size === "lg" ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
          } leading-[1.12]`}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 hover:text-[color:var(--accent)] transition-colors">
            {title}
          </Link>
        </h3>
        <p className={`text-muted-foreground ${size === "lg" ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
          {t(post.excerpt_en, post.excerpt_id)}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium">
          {t("Read article", "Baca artikel")}
          <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
