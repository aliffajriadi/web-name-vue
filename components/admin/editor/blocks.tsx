"use client";
import "@tiptap/extension-details";
import "@tiptap/extension-table";
import "@tiptap/extension-list";

import type { Editor } from "@tiptap/core";
import {
  AlertCircle, Bookmark, CheckSquare, Code2, Heading2, Heading3, ImageIcon, Images, List, ListOrdered,
  Lightbulb, Minus, MousePointerClick, Quote, Table2, ChevronsUpDown, Youtube, TriangleAlert,
} from "lucide-react";
import type { ComponentType } from "react";

export type DialogKind = "button" | "bookmark" | "video" | "gallery";

export type BlockCtx = {
  openDialog: (kind: DialogKind) => void;
  pickImage: () => void;
};

export type BlockItem = {
  id: string;
  group: "Text" | "Media" | "Cards";
  title: string;
  hint: string;
  keywords: string;
  icon: ComponentType<{ size?: number }>;
  tint: string;
  run: (editor: Editor, ctx: BlockCtx) => void;
};

/** Every block the "+" / "/" menu can insert. */
export const BLOCKS: BlockItem[] = [
  { id: "h2", group: "Text", title: "Heading", hint: "Large section title", keywords: "h2 title header", icon: Heading2, tint: "bg-slate-500/10 text-slate-500",
    run: (e) => e.chain().focus().setHeading({ level: 2 }).run() },
  { id: "h3", group: "Text", title: "Subheading", hint: "Smaller section title", keywords: "h3 subtitle", icon: Heading3, tint: "bg-slate-500/10 text-slate-500",
    run: (e) => e.chain().focus().setHeading({ level: 3 }).run() },
  { id: "quote", group: "Text", title: "Quote", hint: "Pull quote", keywords: "blockquote citation", icon: Quote, tint: "bg-slate-500/10 text-slate-500",
    run: (e) => e.chain().focus().setBlockquote().run() },
  { id: "bullets", group: "Text", title: "Bulleted list", hint: "Simple list", keywords: "ul unordered", icon: List, tint: "bg-slate-500/10 text-slate-500",
    run: (e) => e.chain().focus().toggleBulletList().run() },
  { id: "numbers", group: "Text", title: "Numbered list", hint: "Steps in order", keywords: "ol ordered", icon: ListOrdered, tint: "bg-slate-500/10 text-slate-500",
    run: (e) => e.chain().focus().toggleOrderedList().run() },
  { id: "tasks", group: "Text", title: "Checklist", hint: "To-do items", keywords: "task todo checkbox", icon: CheckSquare, tint: "bg-slate-500/10 text-slate-500",
    run: (e) => e.chain().focus().toggleTaskList().run() },
  { id: "divider", group: "Text", title: "Divider", hint: "Section break", keywords: "hr line separator", icon: Minus, tint: "bg-slate-500/10 text-slate-500",
    run: (e) => e.chain().focus().setHorizontalRule().run() },

  { id: "image", group: "Media", title: "Image", hint: "Upload a picture", keywords: "photo picture upload", icon: ImageIcon, tint: "bg-blue-500/10 text-blue-500",
    run: (_e, c) => c.pickImage() },
  { id: "gallery", group: "Media", title: "Gallery", hint: "Grid of images", keywords: "images grid photos", icon: Images, tint: "bg-purple-500/10 text-purple-500",
    run: (_e, c) => c.openDialog("gallery") },
  { id: "video", group: "Media", title: "YouTube", hint: "Embed a video", keywords: "video embed youtube", icon: Youtube, tint: "bg-red-500/10 text-red-500",
    run: (_e, c) => c.openDialog("video") },

  { id: "button", group: "Cards", title: "Button", hint: "Call-to-action link", keywords: "cta link", icon: MousePointerClick, tint: "bg-green-500/10 text-green-500",
    run: (_e, c) => c.openDialog("button") },
  { id: "bookmark", group: "Cards", title: "Bookmark", hint: "Link preview card", keywords: "link url card preview", icon: Bookmark, tint: "bg-orange-500/10 text-orange-500",
    run: (_e, c) => c.openDialog("bookmark") },
  { id: "callout", group: "Cards", title: "Callout", hint: "Highlighted note", keywords: "info tip box alert", icon: Lightbulb, tint: "bg-amber-500/10 text-amber-500",
    run: (e) => e.chain().focus().setCallout("info").run() },
  { id: "warning", group: "Cards", title: "Warning", hint: "Heads-up callout", keywords: "caution danger alert", icon: TriangleAlert, tint: "bg-yellow-500/10 text-yellow-600",
    run: (e) => e.chain().focus().setCallout("warning").run() },
  { id: "toggle", group: "Cards", title: "Toggle", hint: "Collapsible section", keywords: "details accordion faq", icon: ChevronsUpDown, tint: "bg-teal-500/10 text-teal-500",
    run: (e) => e.chain().focus().setDetails().run() },
  { id: "code", group: "Cards", title: "Code block", hint: "Syntax highlighted", keywords: "pre snippet", icon: Code2, tint: "bg-zinc-500/10 text-zinc-500",
    run: (e) => e.chain().focus().setCodeBlock().run() },
  { id: "table", group: "Cards", title: "Table", hint: "Rows and columns", keywords: "grid data", icon: Table2, tint: "bg-indigo-500/10 text-indigo-500",
    run: (e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
];

export const FallbackIcon = AlertCircle;
