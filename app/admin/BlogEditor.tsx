"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Loader2, PanelRight, Save } from "lucide-react";
import GhostEditor from "@/components/admin/GhostEditor";
import { Field } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { slugify } from "./config";

type Props = {
  data: Record<string, any>;
  set: (patch: Record<string, any>) => void;
  isNew: boolean;
  dirty: boolean;
  saving: boolean;
  categories: string[];
  onSave: () => void;
  onClose: () => void;
};

const len = (s?: string) => (s || "").trim().length;
const excerptTone = (n: number) =>
  n === 0 ? "text-muted-foreground" : n >= 90 && n <= 160 ? "text-[var(--accent)]" : "text-amber-600";

export default function BlogEditor({ data, set, isNew, dirty, saving, categories, onSave, onClose }: Props) {
  const [lang, setLang] = useState<"en" | "id">("en");
  const [panel, setPanel] = useState(false);
  const slugTouched = useRef(!isNew);

  const T = lang === "en" ? "title_en" : "title_id";
  const C = lang === "en" ? "content_en" : "content_id";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSave]);

  const filled = (l: "en" | "id") => len(data[`title_${l}`]) > 0 && len(data[`content_${l}`]) > 12;
  const slug = data.slug || "your-article";
  const title = data.title_en || data.title_id || "Untitled article";
  const desc = data.excerpt_en || data.excerpt_id || "Add an excerpt — this is what Google shows under the title.";

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-background animate-in fade-in duration-150" role="dialog" aria-label="Article editor">
      {/* top bar */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 md:px-5">
        <button onClick={onClose} className="btn-sm !px-3" aria-label="Back to articles">
          <ArrowLeft size={15} /> <span className="hidden sm:inline">Articles</span>
        </button>

        <div className="mx-auto flex rounded-lg border border-border bg-muted p-0.5" role="tablist" aria-label="Language">
          {(["en", "id"] as const).map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={lang === l}
              onClick={() => setLang(l)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                lang === l ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l === "en" ? "English" : "Indonesia"}
              <span
                className={cn("h-1.5 w-1.5 rounded-full", filled(l) ? "bg-[var(--accent)]" : "bg-amber-500")}
                title={filled(l) ? "Complete" : "Title or content missing"}
              />
            </button>
          ))}
        </div>

        <span className="hidden text-xs text-muted-foreground md:inline" aria-live="polite">
          {saving ? "Saving…" : dirty ? "Unsaved changes" : isNew ? "New draft" : "All changes saved"}
        </span>
        {!isNew && data.slug && (
          <Link href={`/blog/${data.slug}`} target="_blank" className="btn-sm hidden sm:inline-flex">
            <ExternalLink size={14} /> View
          </Link>
        )}
        <button onClick={() => setPanel((p) => !p)} className="btn-sm !px-3 lg:hidden" aria-label="Article settings">
          <PanelRight size={15} />
        </button>
        <button onClick={onSave} disabled={saving || (!dirty && !isNew)} className="btn-sm solid" title="Ctrl/⌘ + S">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isNew ? "Publish" : "Save"}
        </button>
      </div>

      <div className="relative grid min-h-0 grow lg:grid-cols-[1fr_360px]">
        {/* writing surface */}
        <div className="overflow-y-auto">
          <GhostEditor
            key={`${data.id || "new"}-${lang}`}
            title={data[T] || ""}
            onTitleChange={(v) => {
              set({ [T]: v, ...(lang === "en" && !slugTouched.current ? { slug: slugify(v) } : {}) });
            }}
            content={data[C] || ""}
            onContentChange={(html) => set({ [C]: html })}
            featureImage={data.image || ""}
            onFeatureImageChange={(url) => set({ image: url })}
            placeholder={lang === "en" ? "Tell your story…" : "Tulis ceritamu…"}
          />
        </div>

        {/* settings */}
        <aside
          className={cn(
            "overflow-y-auto border-l border-border bg-muted/30 p-5",
            "max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:z-10 max-lg:w-[min(360px,92vw)] max-lg:bg-background max-lg:shadow-2xl",
            !panel && "max-lg:hidden",
          )}
        >
          <div className="space-y-5">
            <div className="eyebrow">Article settings</div>

            <Field label="URL slug" required hint={`/blog/${slug}`}>
              <input
                className="field-input font-mono !text-[13px]"
                value={data.slug || ""}
                onChange={(e) => {
                  slugTouched.current = true;
                  set({ slug: slugify(e.target.value) });
                }}
                placeholder="my-article"
              />
            </Field>

            <Field label="Category" required>
              <input
                className="field-input"
                list="blog-categories"
                value={data.category || ""}
                onChange={(e) => set({ category: e.target.value })}
                placeholder="Pick or type new"
              />
              <datalist id="blog-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>

            <Field label="Publish date" hint="Only applied when editing an existing article.">
              <input
                type="datetime-local"
                className="field-input"
                value={data.date ? new Date(new Date(data.date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                onChange={(e) => set({ date: e.target.value })}
              />
            </Field>

            <Field label="Excerpt (EN)" required counter={<span className={excerptTone(len(data.excerpt_en))}>{len(data.excerpt_en)}/160</span>}>
              <textarea className="field-input" rows={3} value={data.excerpt_en || ""} onChange={(e) => set({ excerpt_en: e.target.value })} />
            </Field>
            <Field label="Ringkasan (ID)" required counter={<span className={excerptTone(len(data.excerpt_id))}>{len(data.excerpt_id)}/160</span>}>
              <textarea className="field-input" rows={3} value={data.excerpt_id || ""} onChange={(e) => set({ excerpt_id: e.target.value })} />
            </Field>
            <p className="-mt-2 text-xs text-muted-foreground">Aim for 90–160 characters — it becomes the meta description in search results.</p>

            <div>
              <div className="eyebrow mb-2">Google preview</div>
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="truncate text-xs text-muted-foreground">aliffajriadi.my.id › blog › {slug}</div>
                <div className="mt-1 line-clamp-1 text-[17px] text-[#1a0dab] dark:text-[#8ab4f8]">{title}</div>
                <div className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">{desc}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
