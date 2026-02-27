"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu as BubbleMenuComponent } from "@tiptap/react/menus";
import TiptapBubbleMenu from "@tiptap/extension-bubble-menu";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ImageIcon,
  Minus,
  ExternalLink,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Quote,
  Type,
  Layout,
  X,
  Camera,
} from "lucide-react";
import NextImage from "next/image";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import { API_BASE_URL } from "@/lib/api";

const publicKey = "public_eCQf3j533fEHqgIkNhMjXChRUf4=";
const urlEndpoint = "https://ik.imagekit.io/8zzj11dsp";

const authenticator = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/imagekit/auth`);
    if (!response.ok) throw new Error("Auth failed");
    return await response.json();
  } catch (error) {
    console.error(error);
    return {};
  }
};

interface GhostEditorProps {
  title: string;
  onTitleChange: (val: string) => void;
  content: string;
  onContentChange: (html: string) => void;
  featureImage: string;
  onFeatureImageChange: (url: string) => void;
  placeholder?: string;
}

export default function GhostEditor({
  title,
  onTitleChange,
  content,
  onContentChange,
  featureImage,
  onFeatureImageChange,
  placeholder = "Begin writing your post...",
}: GhostEditorProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const ikFeatureRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        horizontalRule: {
          HTMLAttributes: {
            class: "border-t border-border my-8",
          },
        },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      TiptapImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-xl border border-border bg-muted/20 w-full my-8",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline cursor-pointer" },
      }),
      TiptapBubbleMenu,
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
      const text = editor.getText();
      setWordCount(text.split(/\s+/).filter((w) => w.length > 0).length);
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none text-lg leading-relaxed min-h-[500px]",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const addImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
  };

  const addDivider = () => {
    editor.chain().focus().setHorizontalRule().run();
    setIsMenuOpen(false);
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div className="relative max-w-4xl mx-auto py-20 px-4 md:px-0 bg-background text-foreground min-h-screen">
        {/* Feature Image Section */}
        <div className="mb-12 group relative">
          {featureImage ? (
            <div className="relative w-full aspect-21/9 rounded-2xl overflow-hidden mb-4 border border-border">
              <NextImage
                src={featureImage}
                alt="Feature"
                fill
                className="object-cover"
              />
              <button
                onClick={() => onFeatureImageChange("")}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => ikFeatureRef.current?.click()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-4"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">Add feature image</span>
              <Camera size={18} className="ml-2" />
            </button>
          )}
          <IKUpload
            ref={ikFeatureRef}
            className="hidden"
            onSuccess={(res) => onFeatureImageChange(res.url)}
          />
        </div>

        {/* Title Input */}
        <textarea
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Post title"
          className="w-full bg-transparent border-none focus:ring-0 text-5xl md:text-6xl font-bold placeholder:text-muted-foreground/30 resize-none h-auto overflow-hidden mb-8 outline-none"
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
          }}
        />

        {/* Editor Area with Floating Plus */}
        <div className="relative">
          {/* Floating Menu Toggle */}
          <div className="absolute left-[-60px] top-1 z-10 hidden md:block">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-1.5 border border-border rounded-full hover:border-primary hover:text-primary transition-all ${isMenuOpen ? "rotate-45" : ""}`}
            >
              <Plus size={24} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute left-[45px] top-0 w-64 bg-card border border-border rounded-xl shadow-2xl p-2 z-50 overflow-hidden"
                >
                  <div className="text-[10px] font-bold text-muted-foreground px-3 py-2 uppercase tracking-widest border-b border-border/50 mb-1">
                    Primary blocks
                  </div>
                  <button
                    onClick={() => ikUploadRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg text-sm transition-colors"
                  >
                    <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded">
                      <ImageIcon size={16} />
                    </div>
                    <span>Image</span>
                  </button>
                  <button
                    onClick={addDivider}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg text-sm transition-colors"
                  >
                    <div className="p-1.5 bg-gray-500/10 text-gray-400 rounded">
                      <Minus size={16} />
                    </div>
                    <span>Divider</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg text-sm transition-colors opacity-50 cursor-not-allowed">
                    <div className="p-1.5 bg-purple-500/10 text-purple-500 rounded">
                      <Layout size={16} />
                    </div>
                    <span>Gallery</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg text-sm transition-colors opacity-50 cursor-not-allowed">
                    <div className="p-1.5 bg-green-500/10 text-green-500 rounded">
                      <ExternalLink size={16} />
                    </div>
                    <span>Button</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg text-sm transition-colors opacity-50 cursor-not-allowed">
                    <div className="p-1.5 bg-orange-500/10 text-orange-500 rounded">
                      <X size={16} />
                    </div>
                    <span>Bookmark</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg text-sm transition-colors opacity-50 cursor-not-allowed">
                    <div className="p-1.5 bg-red-500/10 text-red-500 rounded">
                      <Type size={16} />
                    </div>
                    <span>Callout</span>
                  </button>

                  <IKUpload
                    ref={ikUploadRef}
                    className="hidden"
                    onSuccess={(res) => {
                      addImage(res.url);
                      setIsMenuOpen(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <EditorContent editor={editor} />
        </div>

        {/* Bubble Menu for Text Formatting */}
        {editor && (
          <BubbleMenuComponent
            editor={editor}
            className="flex items-center gap-0.5 bg-black text-white p-1 rounded-lg shadow-xl"
          >
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 hover:bg-white/10 rounded ${editor.isActive("bold") ? "text-primary" : ""}`}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 hover:bg-white/10 rounded ${editor.isActive("italic") ? "text-primary" : ""}`}
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 hover:bg-white/10 rounded ${editor.isActive("underline") ? "text-primary" : ""}`}
            >
              <UnderlineIcon size={16} />
            </button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-2 hover:bg-white/10 rounded ${editor.isActive("heading", { level: 2 }) ? "text-primary" : ""}`}
            >
              <Heading1 size={16} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-2 hover:bg-white/10 rounded ${editor.isActive("heading", { level: 3 }) ? "text-primary" : ""}`}
            >
              <Heading2 size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 hover:bg-white/10 rounded ${editor.isActive("blockquote") ? "text-primary" : ""}`}
            >
              <Quote size={16} />
            </button>
          </BubbleMenuComponent>
        )}

        {/* Word Count Footer */}
        <div className="fixed bottom-8 right-8 text-xs font-medium text-muted-foreground/50 uppercase tracking-widest hidden md:block">
          {wordCount} words
        </div>
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--muted-foreground);
          opacity: 0.3;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          outline: none !important;
        }
      `}</style>
    </ImageKitProvider>
  );
}
