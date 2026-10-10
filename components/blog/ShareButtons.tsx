"use client";

import { useState } from "react";
import { Check, Link2, Linkedin, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function ShareButtons({
  title,
  text,
  vertical = false,
}: {
  title: string;
  text?: string;
  vertical?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window === "undefined" ? "" : window.location.href);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const native = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: url() });
        return;
      } catch {
        return;
      }
    }
    copy();
  };

  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer,width=640,height=560");
  const enc = encodeURIComponent;

  const btn =
    "grid h-12 w-12 place-items-center rounded-full border border-border bg-card transition-all hover:border-[var(--ink)] hover:-translate-y-0.5 active:scale-90";

  return (
    <div className={cn("flex gap-2.5", vertical && "flex-col")} role="group" aria-label="Share">
      <button type="button" onClick={copy} className={btn} aria-label="Copy link" title="Copy link">
        {copied ? <Check size={16} className="text-[color:var(--accent)]" /> : <Link2 size={16} />}
      </button>
      <button
        type="button"
        onClick={() => open(`https://wa.me/?text=${enc(`${title} ${url()}`)}`)}
        className={btn}
        aria-label="Share on WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle size={16} />
      </button>
      <button
        type="button"
        onClick={() => open(`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url())}`)}
        className={btn}
        aria-label="Share on X"
        title="X"
      >
        <XIcon />
      </button>
      <button
        type="button"
        onClick={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url())}`)}
        className={btn}
        aria-label="Share on LinkedIn"
        title="LinkedIn"
      >
        <Linkedin size={16} />
      </button>
      <button type="button" onClick={native} className={cn(btn, "md:hidden")} aria-label="More share options">
        <Share2 size={16} />
      </button>
    </div>
  );
}
