"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu as BubbleMenuComponent } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  Code,
  Link as LinkIcon,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

interface MediumEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onAutoSaveStatus?: (status: "saving" | "saved" | "idle") => void;
}

export default function MediumEditor({
  content,
  onChange,
  placeholder = "Tell your story...",
  onAutoSaveStatus,
}: MediumEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class:
            "rounded-[1.5rem] border border-border bg-muted/20 mx-auto block max-w-full my-12",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline decoration-2 underline-offset-4 cursor-pointer",
        },
      }),
      BubbleMenu.configure({
        element: null,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none min-h-[600px] text-xl leading-relaxed py-20 px-4 md:px-0 selection:bg-primary/20",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      debouncedChange(html);
    },
  });

  const debouncedChange = debounce((html: string) => {
    onAutoSaveStatus?.("saving");
    onChange(html);
  }, 1000);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted || !editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL Link:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Selection Toolbar */}
      {editor && (
        <BubbleMenuComponent
          editor={editor}
          className="flex gap-1 bg-card/80 backdrop-blur-xl border border-border p-1.5 rounded-2xl shadow-4xl animate-in fade-in zoom-in-95"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-xl transition-all ${editor.isActive("bold") ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground"}`}
            type="button"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-xl transition-all ${editor.isActive("italic") ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground"}`}
            type="button"
          >
            <Italic size={16} />
          </button>
          <div className="w-px bg-border h-4 self-center mx-1" />
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded-xl transition-all ${editor.isActive("heading", { level: 2 }) ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground"}`}
            type="button"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded-xl transition-all ${editor.isActive("heading", { level: 3 }) ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground"}`}
            type="button"
          >
            <Heading2 size={16} />
          </button>
          <div className="w-px bg-border h-4 self-center mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-xl transition-all ${editor.isActive("blockquote") ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground"}`}
            type="button"
          >
            <Quote size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-xl transition-all ${editor.isActive("codeBlock") ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground"}`}
            type="button"
          >
            <Code size={16} />
          </button>
          <div className="w-px bg-border h-4 self-center mx-1" />
          <button
            onClick={setLink}
            className={`p-2 rounded-xl transition-all ${editor.isActive("link") ? "text-primary" : "hover:bg-muted text-muted-foreground"}`}
            type="button"
          >
            <LinkIcon size={16} />
          </button>
        </BubbleMenuComponent>
      )}

      {/* Floating Add Menu (Only on desktop, shown when line is empty) */}
      <div className="absolute left-0 -translate-x-full md:-translate-x-16 pt-2 group hidden md:block">
        <button
          type="button"
          onClick={addImage}
          className="p-3 text-muted-foreground hover:text-primary bg-card/50 border border-border rounded-full shadow-lg opacity-0 transition-all group-hover:opacity-100 hover:rotate-90"
        >
          <Plus size={20} />
        </button>
      </div>

      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--muted-foreground);
          opacity: 0.3;
          pointer-events: none;
          height: 0;
          font-weight: 500;
        }
        .ProseMirror blockquote {
          border-left: 6px solid var(--primary);
          padding-left: 2.5rem;
          font-style: italic;
          font-size: 1.5rem;
          line-height: 1.4;
          margin: 3rem 0;
          color: var(--foreground);
        }
        .ProseMirror pre {
          background: var(--muted);
          border-radius: 1.5rem;
          padding: 2rem;
          border: 1px solid var(--border);
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 4px solid var(--primary);
        }
      `}</style>
    </div>
  );
}
