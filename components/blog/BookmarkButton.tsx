"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";

export default function BookmarkButton({
  slug,
  className,
  size = 18,
  onToggle,
}: {
  slug: string;
  className?: string;
  size?: number;
  onToggle?: (saved: boolean) => void;
}) {
  const { has, toggle } = useBookmarks();
  const saved = has(slug);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from reading list" : "Save for later"}
      title={saved ? "Saved — click to remove" : "Save for later"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle?.(toggle(slug));
      }}
      className={cn("grid place-items-center transition-all active:scale-90", className)}
    >
      <Bookmark size={size} className={cn(saved && "fill-[var(--accent)] text-[color:var(--accent)]")} />
    </button>
  );
}
