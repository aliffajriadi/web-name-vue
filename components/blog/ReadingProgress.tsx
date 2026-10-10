"use client";

/** Thin bar pinned to the top that tracks how far through the article you are. */
export default function ReadingProgress({ pct }: { pct: number }) {
  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
    >
      <div className="h-full origin-left bg-[var(--accent)]" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}
