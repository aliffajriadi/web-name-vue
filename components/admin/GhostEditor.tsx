"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu as BubbleMenuComponent, FloatingMenu as FloatingMenuComponent } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import { Details, DetailsContent, DetailsSummary } from "@tiptap/extension-details";
import { createLowlight, common } from "lowlight";
import {
  Plus, Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3, Quote, X, Camera,
  Highlighter, Link2, Code, Strikethrough, Unlink, Loader2,
} from "lucide-react";
import NextImage from "next/image";
import { uploadImage } from "@/lib/imagekit";
import { useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { ButtonCard, BookmarkCard, Callout, ImageGallery, VideoEmbed } from "./editor/extensions";
import BlockPicker from "./editor/BlockPicker";
import BlockDialog from "./editor/Dialogs";
import ContextBar from "./editor/ContextBar";
import type { BlockCtx, DialogKind } from "./editor/blocks";

const lowlight = createLowlight(common);

interface GhostEditorProps {
  title: string;
  onTitleChange: (val: string) => void;
  content: string;
  onContentChange: (html: string) => void;
  featureImage: string;
  onFeatureImageChange: (url: string) => void;
  placeholder?: string;
}

type DialogState = { kind: DialogKind; initial?: Record<string, unknown>; editing: boolean } | null;

export default function GhostEditor({
  title,
  onTitleChange,
  content,
  onContentChange,
  featureImage,
  onFeatureImageChange,
  placeholder = "Type / for blocks…",
}: GhostEditorProps) {
  const [wordCount, setWordCount] = useState(() => content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length);
  const [picker, setPicker] = useState<{ top: number; left: number } | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [uploading, setUploading] = useState(0);
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  /** Upload images and drop them into the document at `pos` (or the current selection). */
  const uploadInto = useCallback(
    async (files: File[], pos?: number) => {
      const ed = editorRef.current;
      const images = files.filter((f) => f.type.startsWith("image/"));
      if (!ed || !images.length) return;
      setUploading((n) => n + images.length);
      let at = pos;
      for (const file of images) {
        try {
          const src = await uploadImage(file);
          const chain = ed.chain().focus();
          if (at !== undefined) chain.insertContentAt(at, { type: "image", attrs: { src, alt: "" } }).run();
          else chain.setImage({ src, alt: "" }).run();
          at = undefined;
        } catch (e) {
          toast("error", e instanceof Error ? e.message : "Image upload failed");
        } finally {
          setUploading((n) => n - 1);
        }
      }
    },
    [toast],
  );
  const uploadIntoRef = useRef(uploadInto);
  useEffect(() => {
    uploadIntoRef.current = uploadInto;
  }, [uploadInto]);
  const openPickerRef = useRef<() => void>(() => {});

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        link: false,
        underline: false,
        trailingNode: { node: "paragraph" },
      }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
      Placeholder.configure({
        placeholder: ({ node }) => (node.type.name === "paragraph" ? placeholder : ""),
      }),
      Underline,
      Highlight,
      TiptapImage.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TableKit.configure({ table: { resizable: false } }),
      Details.configure({ persist: true }),
      DetailsSummary,
      DetailsContent,
      Callout,
      ButtonCard,
      BookmarkCard,
      VideoEmbed,
      ImageGallery,
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
      setWordCount(editor.getText().split(/\s+/).filter(Boolean).length);
    },
    editorProps: {
      attributes: { class: "article-prose focus:outline-none min-h-[420px] pb-40" },
      handlePaste: (_view, e) => {
        const files = Array.from(e.clipboardData?.files || []).filter((f) => f.type.startsWith("image/"));
        if (!files.length) return false;
        e.preventDefault();
        void uploadIntoRef.current(files);
        return true;
      },
      handleDrop: (view, e) => {
        const files = Array.from(e.dataTransfer?.files || []).filter((f) => f.type.startsWith("image/"));
        if (!files.length) return false;
        e.preventDefault();
        const pos = view.posAtCoords({ left: e.clientX, top: e.clientY })?.pos;
        void uploadIntoRef.current(files, pos);
        return true;
      },
      handleKeyDown: (view, e) => {
        if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
          const { $from, empty } = view.state.selection;
          if (empty && $from.parent.type.name === "paragraph" && $from.parent.content.size === 0) {
            e.preventDefault();
            openPickerRef.current();
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // only sync from the outside when the editor isn't the source of the change
  useEffect(() => {
    if (editor && !editor.isFocused && content !== editor.getHTML()) editor.commands.setContent(content, { emitUpdate: false });
  }, [content, editor]);

  const fitTitle = useCallback(() => {
    const t = titleRef.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = `${t.scrollHeight}px`;
  }, []);
  useEffect(() => {
    fitTitle();
  }, [title, fitTitle]);

  const openPicker = useCallback(() => {
    if (!editor) return;
    const c = editor.view.coordsAtPos(editor.state.selection.from);
    setPicker({ top: Math.min(c.bottom + 8, window.innerHeight - 380), left: Math.max(16, c.left - 8) });
  }, [editor]);
  useEffect(() => {
    openPickerRef.current = openPicker;
  }, [openPicker]);

  if (!editor) return null;

  const ctx: BlockCtx = {
    openDialog: (kind) => setDialog({ kind, editing: false }),
    pickImage: () => fileRef.current?.click(),
  };

  const insertFromDialog = (attrs: Record<string, unknown>) => {
    if (!dialog) return;
    const c = editor.chain().focus();
    if (dialog.editing) {
      const type = { button: "buttonCard", bookmark: "bookmarkCard", video: "videoEmbed", gallery: "imageGallery" }[dialog.kind];
      c.updateAttributes(type, attrs).run();
    } else if (dialog.kind === "button") c.insertButtonCard(attrs as never).run();
    else if (dialog.kind === "bookmark") c.insertBookmarkCard(attrs as never).run();
    else if (dialog.kind === "video") c.insertVideoEmbed(attrs as never).run();
    else c.insertImageGallery(attrs as never).run();
    setDialog(null);
  };

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const fmt = (active: boolean) => cn("grid h-9 w-9 place-items-center rounded-md transition-colors hover:bg-white/15", active && "bg-white/20 text-[color:var(--lime)]");

  return (
    <>
      <div className="relative mx-auto max-w-[760px] bg-background px-4 py-10 text-foreground md:px-0">
        {/* Feature image */}
        <div className="group relative mb-10">
          {featureImage ? (
            <div className="relative mb-4 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border">
              <NextImage src={featureImage} alt="Feature" fill className="object-cover" />
              <button
                type="button"
                onClick={() => onFeatureImageChange("")}
                aria-label="Remove cover image"
                className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              className="flex items-center gap-2 py-3 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">Add cover image</span>
              <Camera size={18} className="ml-1" />
            </button>
          )}
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setUploading((n) => n + 1);
              try {
                onFeatureImageChange(await uploadImage(file));
              } catch (err) {
                toast("error", err instanceof Error ? err.message : "Cover upload failed");
              } finally {
                setUploading((n) => n - 1);
              }
            }}
          />
        </div>

        {/* Title */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Article title"
          aria-label="Article title"
          className="mb-8 h-auto w-full resize-none overflow-hidden border-none bg-transparent font-display text-4xl font-semibold leading-[1.08] tracking-tight outline-none placeholder:text-muted-foreground/30 md:text-5xl"
          rows={1}
        />

        <ContextBar editor={editor} onEditCard={(kind, initial) => setDialog({ kind, initial, editing: true })} />

        {/* "+" handle on empty lines */}
        <FloatingMenuComponent editor={editor} options={{ placement: "left-start", offset: 10 }}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={openPicker}
            aria-label="Insert block (or type /)"
            title="Insert block — or type /"
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-[var(--ink)] hover:text-foreground"
          >
            <Plus size={16} />
          </button>
        </FloatingMenuComponent>

        <EditorContent editor={editor} />

        {/* Text formatting bubble */}
        <BubbleMenuComponent
          editor={editor}
          shouldShow={({ editor: e, state }) => !state.selection.empty && !e.isActive("codeBlock") && !(state.selection as { node?: unknown }).node}
          className="flex items-center gap-0.5 rounded-xl bg-[#14180f] p-1 text-white shadow-2xl ring-1 ring-white/10"
        >
          <button type="button" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={fmt(editor.isActive("bold"))}><Bold size={15} /></button>
          <button type="button" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={fmt(editor.isActive("italic"))}><Italic size={15} /></button>
          <button type="button" aria-label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={fmt(editor.isActive("underline"))}><UnderlineIcon size={15} /></button>
          <button type="button" aria-label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} className={fmt(editor.isActive("strike"))}><Strikethrough size={15} /></button>
          <button type="button" aria-label="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()} className={fmt(editor.isActive("highlight"))}><Highlighter size={15} /></button>
          <button type="button" aria-label="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} className={fmt(editor.isActive("code"))}><Code size={15} /></button>
          <span className="mx-1 h-5 w-px bg-white/20" />
          <button type="button" aria-label="Link" onClick={setLink} className={fmt(editor.isActive("link"))}><Link2 size={15} /></button>
          {editor.isActive("link") && (
            <button type="button" aria-label="Remove link" onClick={() => editor.chain().focus().unsetLink().run()} className={fmt(false)}><Unlink size={15} /></button>
          )}
          <span className="mx-1 h-5 w-px bg-white/20" />
          <button type="button" aria-label="Heading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={fmt(editor.isActive("heading", { level: 2 }))}><Heading2 size={15} /></button>
          <button type="button" aria-label="Subheading" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={fmt(editor.isActive("heading", { level: 3 }))}><Heading3 size={15} /></button>
          <button type="button" aria-label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={fmt(editor.isActive("blockquote"))}><Quote size={15} /></button>
        </BubbleMenuComponent>

        {/* hidden picker for the Image block */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            e.target.value = ""; // allow re-picking the same file
            void uploadInto(files);
          }}
        />
        {uploading > 0 && (
          <div role="status" className="fixed bottom-5 right-5 z-[220] flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm shadow-lg">
            <Loader2 size={14} className="animate-spin" /> Uploading {uploading > 1 ? `${uploading} images` : "image"}…
          </div>
        )}

        {picker && <BlockPicker editor={editor} pos={picker} ctx={ctx} onClose={() => setPicker(null)} />}
        {dialog && (
          <BlockDialog kind={dialog.kind} initial={dialog.initial} editing={dialog.editing} onSubmit={insertFromDialog} onClose={() => setDialog(null)} />
        )}

        <div className="fixed bottom-5 left-5 hidden select-none rounded-full border border-border bg-background/90 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur md:block">
          {wordCount} words · {Math.max(1, Math.round(wordCount / 200))} min
        </div>
      </div>
    </>
  );
}
