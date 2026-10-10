"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";
import { Search } from "lucide-react";
import { BLOCKS, BlockCtx } from "./blocks";
import { cn } from "@/lib/utils";

/** Notion/Ghost-style block menu: opened by the "+" handle or by typing "/" on an empty line. */
export default function BlockPicker({
  editor,
  pos,
  ctx,
  onClose,
}: {
  editor: Editor;
  pos: { top: number; left: number };
  ctx: BlockCtx;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    const n = q.trim().toLowerCase();
    return BLOCKS.filter((b) => !n || `${b.title} ${b.hint} ${b.keywords}`.toLowerCase().includes(n));
  }, [q]);

  useEffect(() => {
    input.current?.focus();
  }, []);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (i: number) => {
    const item = items[i];
    if (!item) return;
    onClose();
    // let the menu unmount and the editor regain focus before mutating the doc
    setTimeout(() => item.run(editor, ctx), 0);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      editor.commands.focus();
    }
  };

  const left = Math.min(pos.left, (typeof window !== "undefined" ? window.innerWidth : 1200) - 340);

  return (
    <>
      <div className="fixed inset-0 z-[210]" onMouseDown={onClose} />
      <div
        role="dialog"
        aria-label="Insert block"
        style={{ top: pos.top, left }}
        className="fixed z-[211] w-[320px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in fade-in zoom-in-95 duration-100"
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search size={15} className="text-muted-foreground" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKey}
            placeholder="Search blocks…"
            aria-label="Search blocks"
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div ref={listRef} className="max-h-[340px] overflow-y-auto p-1.5">
          {items.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted-foreground">No block found</p>}
          {items.map((b, i) => {
            const header = i === 0 || items[i - 1].group !== b.group;
            return (
              <div key={b.id}>
                {header && <div className="eyebrow px-3 pb-1 pt-3">{b.group}</div>}
                <button
                  type="button"
                  data-i={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors", i === active && "bg-muted")}
                >
                  <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", b.tint)}>
                    <b.icon size={17} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{b.title}</span>
                    <span className="block text-xs text-muted-foreground">{b.hint}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
