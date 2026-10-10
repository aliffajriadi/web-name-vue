import type { ReactNode } from "react";

/** "(01) Label" + big display heading, used by every home section. */
export default function SectionHead({
  index,
  label,
  children,
  aside,
}: {
  index: string;
  label: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div className="eyebrow mb-5">
          <span className="idx">({index})</span>
          <span>{label}</span>
        </div>
        <h2 className="font-display text-4xl md:text-6xl max-w-[16ch]">
          {children}
        </h2>
      </div>
      {aside}
    </div>
  );
}
