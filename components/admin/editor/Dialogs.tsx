"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, Plus, Trash2, Upload, Wand2 } from "lucide-react";
import { IKUpload } from "imagekitio-next";
import { Field } from "@/components/admin/ui";
import { unfurlUrl } from "@/lib/api";
import { parseYouTubeId } from "./extensions";
import { cn } from "@/lib/utils";
import type { DialogKind } from "./blocks";

type Initial = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const TITLES: Record<DialogKind, string> = {
  button: "Button",
  bookmark: "Bookmark",
  video: "YouTube video",
  gallery: "Image gallery",
};

export default function BlockDialog({
  kind,
  initial,
  editing,
  onSubmit,
  onClose,
}: {
  kind: DialogKind;
  initial?: Initial;
  editing: boolean;
  onSubmit: (attrs: Initial) => void;
  onClose: () => void;
}) {
  const [v, setV] = useState<Initial>(initial ?? (kind === "button" ? { style: "primary" } : kind === "gallery" ? { images: [] } : {}));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const upload = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (p: Initial) => setV((d) => ({ ...d, ...p }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (kind === "button") {
      if (!v.label?.trim() || !v.href?.trim()) return setErr("Add a label and a link.");
      return onSubmit({ label: v.label.trim(), href: normalizeUrl(v.href), style: v.style || "primary" });
    }
    if (kind === "video") {
      const id = parseYouTubeId(v.url || v.videoId || "");
      if (!id) return setErr("That doesn't look like a YouTube link.");
      return onSubmit({ videoId: id });
    }
    if (kind === "gallery") {
      if (!v.images?.length) return setErr("Add at least one image.");
      return onSubmit({ images: v.images });
    }
    // bookmark
    if (!v.url?.trim()) return setErr("Paste a link first.");
    if (v.title) return onSubmit({ ...v, url: normalizeUrl(v.url) });
    setBusy(true);
    try {
      onSubmit(await unfurlUrl(normalizeUrl(v.url)));
    } catch {
      setBusy(false);
      setErr("Couldn't fetch a preview. Fill in the title manually below.");
      setV((d) => ({ ...d, title: d.title || "", manual: true }));
    }
  };

  const fetchPreview = async () => {
    if (!v.url?.trim()) return;
    setBusy(true);
    setErr("");
    try {
      set(await unfurlUrl(normalizeUrl(v.url)));
    } catch {
      setErr("Couldn't fetch a preview — you can fill it in manually.");
      set({ manual: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[260] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={TITLES[kind]}>
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-150">
        <h3 className="font-display text-xl">
          {editing ? "Edit" : "Add"} {TITLES[kind].toLowerCase()}
        </h3>

        <div className="mt-5 space-y-4">
          {kind === "button" && (
            <>
              <Field label="Button text" required>
                <input ref={first} className="field-input" value={v.label ?? ""} onChange={(e) => set({ label: e.target.value })} placeholder="Read the docs" />
              </Field>
              <Field label="Link" required>
                <input className="field-input" value={v.href ?? ""} onChange={(e) => set({ href: e.target.value })} placeholder="https://…" />
              </Field>
              <div className="flex gap-2" role="radiogroup" aria-label="Style">
                {(["primary", "outline"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={v.style === s}
                    onClick={() => set({ style: s })}
                    className={cn("btn-sm grow justify-center capitalize", v.style === s && "solid")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {kind === "video" && (
            <Field label="YouTube link" required hint="Paste any youtube.com or youtu.be URL.">
              <input ref={first} className="field-input" value={v.url ?? (v.videoId ? `https://youtu.be/${v.videoId}` : "")} onChange={(e) => set({ url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" />
            </Field>
          )}

          {kind === "bookmark" && (
            <>
              <Field label="Link" required hint="We'll grab the title, description and image automatically.">
                <div className="flex gap-2">
                  <input ref={first} className="field-input" value={v.url ?? ""} onChange={(e) => set({ url: e.target.value })} placeholder="https://…" />
                  <button type="button" className="btn-sm shrink-0" onClick={fetchPreview} disabled={busy} title="Fetch preview">
                    {busy ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  </button>
                </div>
              </Field>
              {(v.title || v.manual) && (
                <>
                  <Field label="Title">
                    <input className="field-input" value={v.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
                  </Field>
                  <Field label="Description">
                    <textarea className="field-input" rows={2} value={v.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Publisher">
                      <input className="field-input" value={v.publisher ?? ""} onChange={(e) => set({ publisher: e.target.value })} />
                    </Field>
                    <Field label="Image URL">
                      <input className="field-input" value={v.image ?? ""} onChange={(e) => set({ image: e.target.value })} />
                    </Field>
                  </div>
                  {v.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.image} alt="" className="h-24 w-full rounded-lg border border-border object-cover" />
                  )}
                </>
              )}
            </>
          )}

          {kind === "gallery" && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {(v.images ?? []).map((im: { src: string }, i: number) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={im.src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => set({ images: v.images.filter((_: unknown, j: number) => j !== i) })}
                      className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => upload.current?.click()}
                  className="grid aspect-square place-items-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-[var(--ink)] hover:text-foreground"
                >
                  {uploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={20} />}
                </button>
              </div>
              <IKUpload
                ref={upload}
                className="hidden"
                onUploadStart={() => setUploading(true)}
                onError={() => setUploading(false)}
                onSuccess={(res) => {
                  setUploading(false);
                  set({ images: [...(v.images ?? []), { src: res.url, alt: "" }] });
                }}
              />
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Upload size={12} /> <ImageIcon size={12} /> Upload one at a time — 2 to 4 images look best.
              </p>
            </>
          )}

          {err && (
            <p role="alert" className="text-sm text-red-500">
              {err}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-sm solid" disabled={busy}>
            {busy && <Loader2 size={14} className="animate-spin" />} {editing ? "Update" : "Insert"}
          </button>
        </div>
      </form>
    </div>
  );
}

const normalizeUrl = (u: string) => (/^https?:\/\//i.test(u.trim()) ? u.trim() : `https://${u.trim()}`);
