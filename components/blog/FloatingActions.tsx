"use client";

import { Link2, Share2, Check } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LikeButton, { useBlogStats } from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { cn } from "@/lib/utils";

/** Medium-style pill pinned to the bottom while you read (small screens; desktop has the side rail). */
export default function FloatingActions({
  slug,
  title,
  text,
  pct,
  minutes,
  minLeftLabel,
}: {
  slug: string;
  title: string;
  text?: string;
  pct: number;
  minutes: number;
  minLeftLabel: string;
}) {
  const { data } = useBlogStats(slug);
  const [copied, setCopied] = useState(false);
  const visible = pct > 4 && pct < 97;
  const left = Math.max(1, Math.ceil(minutes * (1 - pct / 100)));

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:hidden"
        >
          <div className="flex items-center gap-1 rounded-full border border-border bg-background/90 px-2 py-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <LikeButton slug={slug} variant="bare" />
            <span className="min-w-5 pr-1 font-mono text-xs text-muted-foreground">{data?.likesCount ?? 0}</span>
            <span className="mx-1 h-5 w-px bg-border" aria-hidden />
            <BookmarkButton slug={slug} className="h-10 w-10 rounded-full hover:bg-muted" />
            <button onClick={share} aria-label="Share" className={cn("grid h-10 w-10 place-items-center rounded-full hover:bg-muted")}>
              {copied ? <Check size={17} className="text-[color:var(--accent)]" /> : typeof navigator !== "undefined" && "share" in navigator ? <Share2 size={17} /> : <Link2 size={17} />}
            </button>
            <span className="mx-1 h-5 w-px bg-border" aria-hidden />
            <span className="whitespace-nowrap pl-1 pr-3 font-mono text-[11px] text-muted-foreground">
              {left} {minLeftLabel}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
