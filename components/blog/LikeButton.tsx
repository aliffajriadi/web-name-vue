"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { BlogStats, getBlogStats, toggleBlogLike } from "@/lib/api";
import { cn } from "@/lib/utils";

const PARTICLES = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

export function useBlogStats(slug: string) {
  return useQuery<BlogStats>({
    queryKey: ["blog-stats", slug],
    queryFn: () => getBlogStats(slug),
    staleTime: 15_000,
  });
}

export default function LikeButton({
  slug,
  variant = "rail",
  label,
}: {
  slug: string;
  variant?: "rail" | "pill" | "bare";
  label?: string;
}) {
  const qc = useQueryClient();
  const { data } = useBlogStats(slug);
  const [burst, setBurst] = useState(0);
  const liked = !!data?.isLiked;
  const prev = useRef(liked);

  useEffect(() => {
    prev.current = liked;
  }, [liked]);

  const mutation = useMutation({
    mutationFn: () => toggleBlogLike(slug),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["blog-stats", slug] });
      const snapshot = qc.getQueryData<BlogStats>(["blog-stats", slug]);
      qc.setQueryData<BlogStats>(["blog-stats", slug], (old) => ({
        views: old?.views ?? 0,
        isLiked: !old?.isLiked,
        likesCount: Math.max(0, (old?.likesCount ?? 0) + (old?.isLiked ? -1 : 1)),
      }));
      return { snapshot };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(["blog-stats", slug], ctx?.snapshot),
    onSuccess: (res) =>
      qc.setQueryData<BlogStats>(["blog-stats", slug], (old) => ({
        views: old?.views ?? 0,
        isLiked: res.liked,
        likesCount: res.likesCount,
      })),
  });

  const onClick = () => {
    if (!liked) setBurst((b) => b + 1);
    mutation.mutate();
  };

  const count = data?.likesCount ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this article" : "Like this article"}
      className={cn(
        "group relative inline-flex items-center justify-center transition-all active:scale-90",
        variant === "rail" && "h-12 w-12 flex-col rounded-full border border-border bg-card hover:border-[var(--ink)]",
        variant === "bare" && "h-10 w-10 rounded-full hover:bg-muted",
        variant === "pill" && "h-12 gap-2.5 rounded-full border px-6 text-sm font-medium",
        variant === "pill" &&
          (liked
            ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
            : "border-border bg-card hover:border-[var(--ink)]"),
      )}
    >
      <Heart
        size={variant === "rail" ? 18 : 17}
        className={cn("transition-colors", liked ? "fill-rose-500 text-rose-500" : "text-foreground")}
      />
      {variant === "pill" && (
        <span>
          {label} <span className="font-mono text-xs opacity-70">{count}</span>
        </span>
      )}
      <AnimatePresence>
        {burst > 0 &&
          PARTICLES.map((a, i) => (
            <motion.span
              key={`${burst}-${i}`}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-rose-500"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(a) * 26, y: Math.sin(a) * 26, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          ))}
      </AnimatePresence>
      {variant === "rail" && (
        <span className="absolute -bottom-6 font-mono text-[11px] text-muted-foreground">{count}</span>
      )}
    </button>
  );
}
