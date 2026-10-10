"use client";

import { useEffect, useState } from "react";
import { Check, Copy, MessageCircle, Quote } from "lucide-react";

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/** Medium-style popover: select any text in the article to copy or share it as a quote. */
export default function SelectionToolbar({ containerSelector, title }: { containerSelector: string; title: string }) {
  const [state, setState] = useState<{ text: string; x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const check = () => {
      const sel = window.getSelection();
      const container = document.querySelector(containerSelector);
      if (!sel || sel.isCollapsed || !container || !sel.rangeCount) return setState(null);
      const text = sel.toString().trim();
      const range = sel.getRangeAt(0);
      if (text.length < 8 || text.length > 500 || !container.contains(range.commonAncestorContainer)) return setState(null);
      const r = range.getBoundingClientRect();
      setState({
        text,
        x: Math.min(Math.max(r.left + r.width / 2, 130), window.innerWidth - 130),
        y: r.top < 70 ? r.bottom + 10 : r.top - 10,
      });
    };
    const onUp = () => setTimeout(check, 10);
    const hide = () => setState(null);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("keyup", onUp);
    document.addEventListener("touchend", onUp);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("keyup", onUp);
      document.removeEventListener("touchend", onUp);
      window.removeEventListener("scroll", hide);
    };
  }, [containerSelector]);

  if (!state) return null;

  const url = typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
  const quote = `“${state.text}”`;
  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer,width=640,height=560");

  const btn = "grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/15";
  return (
    <div
      role="toolbar"
      aria-label="Share selected text"
      onMouseDown={(e) => e.preventDefault()}
      style={{ left: state.x, top: state.y }}
      className="fixed z-[90] flex -translate-x-1/2 -translate-y-full items-center gap-0.5 rounded-full bg-[#14180f] px-2 py-1.5 text-white shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150 dark:bg-[#eceee4] dark:text-[#0b0e09] dark:ring-black/10"
    >
      <Quote size={13} className="mx-2 opacity-50" aria-hidden />
      <button
        className={btn}
        aria-label="Copy quote"
        title="Copy quote"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(`${quote}\n— ${title}\n${url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <button className={btn} aria-label="Share on X" title="Share on X" onClick={() => open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}&url=${encodeURIComponent(url)}`)}>
        <XIcon />
      </button>
      <button className={btn} aria-label="Share on WhatsApp" title="Share on WhatsApp" onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${quote}\n${url}`)}`)}>
        <MessageCircle size={14} />
      </button>
    </div>
  );
}
