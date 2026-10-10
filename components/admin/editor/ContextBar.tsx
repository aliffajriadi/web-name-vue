"use client";

import type { Editor } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import { useEditorState } from "@tiptap/react";
import { ArrowDownToLine, ArrowRightToLine, Pencil, Rows3, Trash2, TableProperties, X } from "lucide-react";
import { CALLOUTS, CalloutVariant } from "./extensions";
import type { DialogKind } from "./blocks";
import { cn } from "@/lib/utils";

const LANGS = ["plaintext", "javascript", "typescript", "json", "html", "xml", "css", "bash", "python", "sql", "php", "java", "go", "rust", "yaml", "markdown", "diff", "c", "cpp", "csharp", "kotlin", "swift"];

type Ctx =
  | { kind: "none" }
  | { kind: "callout"; variant: CalloutVariant }
  | { kind: "codeBlock"; language: string }
  | { kind: "table" }
  | { kind: "details" }
  | { kind: "image"; alt: string }
  | { kind: "card"; node: "buttonCard" | "bookmarkCard" | "videoEmbed" | "imageGallery" };

const CARD_DIALOG: Record<string, DialogKind> = {
  buttonCard: "button",
  bookmarkCard: "bookmark",
  videoEmbed: "video",
  imageGallery: "gallery",
};

/** Contextual toolbar that adapts to whichever block the cursor is in. */
function Btn({ onClick, children, danger, title }: { onClick: () => void; children: React.ReactNode; danger?: boolean; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn("btn-sm !h-8 !px-2.5 !text-xs", danger && "danger")}
    >
      {children}
    </button>
  );
}

export default function ContextBar({
  editor,
  onEditCard,
}: {
  editor: Editor;
  onEditCard: (kind: DialogKind, attrs: Record<string, unknown>) => void;
}) {
  const ctx = useEditorState({
    editor,
    selector: ({ editor: e }): Ctx => {
      const sel = e.state.selection;
      if (sel instanceof NodeSelection) {
        const n = sel.node.type.name;
        if (n === "image") return { kind: "image", alt: sel.node.attrs.alt || "" };
        if (n in CARD_DIALOG) return { kind: "card", node: n as never };
      }
      if (e.isActive("callout")) return { kind: "callout", variant: (e.getAttributes("callout").variant || "info") as CalloutVariant };
      if (e.isActive("codeBlock")) return { kind: "codeBlock", language: e.getAttributes("codeBlock").language || "plaintext" };
      if (e.isActive("table")) return { kind: "table" };
      if (e.isActive("details")) return { kind: "details" };
      return { kind: "none" };
    },
    equalityFn: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  }) as Ctx;

  if (ctx.kind === "none") return null;
  const chain = () => editor.chain().focus();
  return (
    <div
      role="toolbar"
      aria-label="Block options"
      className="sticky top-2 z-20 mx-auto mb-4 flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-xl border border-border bg-background/95 px-2 py-1.5 shadow-lg backdrop-blur animate-in fade-in slide-in-from-top-1 duration-150"
    >
      {ctx.kind === "callout" && (
        <>
          {(Object.keys(CALLOUTS) as CalloutVariant[]).map((k) => (
            <button
              key={k}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => chain().updateAttributes("callout", { variant: k, emoji: CALLOUTS[k].emoji }).run()}
              className={cn("btn-sm !h-8 !px-2.5 !text-xs", ctx.variant === k && "solid")}
            >
              <span aria-hidden>{CALLOUTS[k].emoji}</span> {CALLOUTS[k].label}
            </button>
          ))}
          <Btn danger onClick={() => chain().lift("callout").run()} title="Remove callout (keep text)">
            <X size={13} /> Unwrap
          </Btn>
        </>
      )}

      {ctx.kind === "codeBlock" && (
        <>
          <label className="flex items-center gap-2 pl-1 text-xs text-muted-foreground">
            Language
            <select
              value={ctx.language}
              onChange={(e) => chain().updateAttributes("codeBlock", { language: e.target.value }).run()}
              className="field-input !h-8 !w-auto !py-0 !text-xs"
            >
              {LANGS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <Btn danger onClick={() => chain().deleteNode("codeBlock").run()}>
            <Trash2 size={13} />
          </Btn>
        </>
      )}

      {ctx.kind === "table" && (
        <>
          <Btn onClick={() => chain().addRowAfter().run()}><ArrowDownToLine size={13} /> Row</Btn>
          <Btn onClick={() => chain().addColumnAfter().run()}><ArrowRightToLine size={13} /> Column</Btn>
          <Btn onClick={() => chain().toggleHeaderRow().run()}><TableProperties size={13} /> Header</Btn>
          <Btn danger onClick={() => chain().deleteRow().run()}><Rows3 size={13} /> Row</Btn>
          <Btn danger onClick={() => chain().deleteColumn().run()}><Trash2 size={13} /> Col</Btn>
          <Btn danger onClick={() => chain().deleteTable().run()}>Delete table</Btn>
        </>
      )}

      {ctx.kind === "details" && (
        <Btn danger onClick={() => chain().unsetDetails().run()}>
          <X size={13} /> Remove toggle
        </Btn>
      )}

      {ctx.kind === "image" && (
        <>
          <input
            key={ctx.alt}
            defaultValue={ctx.alt}
            placeholder="Caption / alt text"
            aria-label="Image caption"
            onBlur={(e) => editor.chain().updateAttributes("image", { alt: e.target.value }).run()}
            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), editor.commands.focus())}
            className="field-input !h-8 !w-64 !py-0 !text-xs"
          />
          <Btn danger onClick={() => chain().deleteSelection().run()}><Trash2 size={13} /></Btn>
        </>
      )}

      {ctx.kind === "card" && (
        <>
          <Btn
            onClick={() => {
              const sel = editor.state.selection as NodeSelection;
              onEditCard(CARD_DIALOG[ctx.node], sel.node.attrs);
            }}
          >
            <Pencil size={13} /> Edit
          </Btn>
          <Btn danger onClick={() => chain().deleteSelection().run()}>
            <Trash2 size={13} /> Delete
          </Btn>
        </>
      )}
    </div>
  );
}
