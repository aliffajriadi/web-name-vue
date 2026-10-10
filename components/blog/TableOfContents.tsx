"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import { cn } from "@/lib/utils";

export type Heading = { id: string; text: string; level: 2 | 3 };

export default function TableOfContents({
  headings,
  title,
  variant,
}: {
  headings: Heading[];
  title: string;
  variant: "sidebar" | "inline";
}) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (!headings.length) return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const list = (
    <ol className="space-y-0.5 border-l border-border">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            aria-current={active === h.id ? "location" : undefined}
            className={cn(
              "-ml-px block border-l py-1.5 text-[13px] leading-snug transition-colors",
              h.level === 3 ? "pl-7" : "pl-4",
              active === h.id
                ? "border-[var(--accent)] font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === "inline") {
    return (
      <details className="group mb-10 rounded-2xl border border-border bg-card xl:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <ListTree size={15} className="text-[color:var(--accent)]" /> {title}
          </span>
          <span className="font-mono text-xs text-muted-foreground transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="px-5 pb-5">{list}</div>
      </details>
    );
  }

  return (
    <nav aria-label={title} className="sticky top-28 hidden xl:block">
      <div className="eyebrow mb-4">{title}</div>
      {list}
    </nav>
  );
}
