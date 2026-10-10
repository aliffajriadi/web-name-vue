import { Node, mergeAttributes } from "@tiptap/core";

/* ───────────────────────── Callout ───────────────────────── */
export const CALLOUTS = {
  info: { emoji: "💡", label: "Info" },
  tip: { emoji: "✅", label: "Tip" },
  warning: { emoji: "⚠️", label: "Warning" },
  danger: { emoji: "🚫", label: "Danger" },
  note: { emoji: "📝", label: "Note" },
} as const;
export type CalloutVariant = keyof typeof CALLOUTS;

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: { setCallout: (variant?: CalloutVariant) => ReturnType };
    buttonCard: { insertButtonCard: (a: { href: string; label: string; style?: "primary" | "outline" }) => ReturnType };
    bookmarkCard: { insertBookmarkCard: (a: Record<string, string>) => ReturnType };
    videoEmbed: { insertVideoEmbed: (a: { videoId: string }) => ReturnType };
    imageGallery: { insertImageGallery: (a: { images: { src: string; alt?: string }[] }) => ReturnType };
  }
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      variant: {
        default: "info",
        parseHTML: (el) => el.getAttribute("data-callout") || "info",
        renderHTML: () => ({}),
      },
      emoji: {
        default: "💡",
        parseHTML: (el) => el.getAttribute("data-emoji") || "💡",
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-callout]", contentElement: ".callout-body" }];
  },
  renderHTML({ node }) {
    return [
      "div",
      { class: `callout callout-${node.attrs.variant}`, "data-callout": node.attrs.variant, "data-emoji": node.attrs.emoji },
      ["span", { class: "callout-emoji", contenteditable: "false" }, node.attrs.emoji],
      ["div", { class: "callout-body" }, 0],
    ];
  },
  addCommands() {
    return {
      setCallout:
        (variant = "info") =>
        ({ commands }) =>
          commands.wrapIn(this.name, { variant, emoji: CALLOUTS[variant].emoji }),
    };
  },
});

/* ───────────────────────── Button ───────────────────────── */
export const ButtonCard = Node.create({
  name: "buttonCard",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      href: { default: "", parseHTML: (el: HTMLElement) => el.querySelector("a")?.getAttribute("href") || "" },
      label: { default: "Click here", parseHTML: (el: HTMLElement) => el.querySelector("a")?.textContent || "Click here" },
      style: {
        default: "primary",
        parseHTML: (el: HTMLElement) => (el.querySelector("a")?.classList.contains("kg-btn-outline") ? "outline" : "primary"),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-kg-button]" }];
  },
  renderHTML({ node }) {
    return [
      "div",
      { class: "kg-button", "data-kg-button": "1" },
      [
        "a",
        { class: `kg-btn kg-btn-${node.attrs.style}`, href: node.attrs.href, target: "_blank", rel: "noopener noreferrer" },
        node.attrs.label,
      ],
    ];
  },
  addCommands() {
    return {
      insertButtonCard:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

/* ───────────────────────── Bookmark (link preview card) ───────────────────────── */
export const BookmarkCard = Node.create({
  name: "bookmarkCard",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      url: { default: "", parseHTML: (el: HTMLElement) => el.getAttribute("href") || "" },
      title: { default: "", parseHTML: (el: HTMLElement) => el.querySelector(".kg-bookmark-title")?.textContent || "" },
      description: { default: "", parseHTML: (el: HTMLElement) => el.querySelector(".kg-bookmark-desc")?.textContent || "" },
      image: { default: "", parseHTML: (el: HTMLElement) => el.querySelector("img")?.getAttribute("src") || "" },
      publisher: { default: "", parseHTML: (el: HTMLElement) => el.querySelector(".kg-bookmark-meta")?.textContent || "" },
    };
  },
  parseHTML() {
    return [{ tag: "a[data-kg-bookmark]", priority: 1100 }];
  },
  renderHTML({ node }) {
    const { url, title, description, image, publisher } = node.attrs;
    const content: unknown[] = [
      "span",
      { class: "kg-bookmark-content" },
      ["span", { class: "kg-bookmark-title" }, title || url],
    ];
    if (description) content.push(["span", { class: "kg-bookmark-desc" }, description]);
    content.push(["span", { class: "kg-bookmark-meta" }, publisher]);
    const children: unknown[] = [content];
    if (image) children.push(["span", { class: "kg-bookmark-thumb" }, ["img", { src: image, alt: "", loading: "lazy" }]]);
    return [
      "a",
      { class: "kg-bookmark", "data-kg-bookmark": "1", href: url, target: "_blank", rel: "noopener noreferrer" },
      ...children,
    ] as never;
  },
  addCommands() {
    return {
      insertBookmarkCard:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

/* ───────────────────────── YouTube ───────────────────────── */
export const parseYouTubeId = (input: string): string | null => {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname === "youtu.be") return u.pathname.slice(1, 12) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v")!.slice(0, 11);
      const m = u.pathname.match(/\/(embed|shorts|live)\/([\w-]{11})/);
      if (m) return m[2];
    }
  } catch {}
  return null;
};

export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return { videoId: { default: "", parseHTML: (el: HTMLElement) => el.getAttribute("data-video-id") || "" } };
  },
  parseHTML() {
    return [{ tag: "div[data-video-id]" }];
  },
  renderHTML({ node }) {
    const id = node.attrs.videoId;
    return [
      "div",
      { class: "video-embed", "data-video-id": id },
      [
        "iframe",
        {
          src: `https://www.youtube-nocookie.com/embed/${id}`,
          title: "YouTube video",
          loading: "lazy",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true",
          frameborder: "0",
        },
      ],
    ];
  },
  addCommands() {
    return {
      insertVideoEmbed:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

/* ───────────────────────── Gallery ───────────────────────── */
export const ImageGallery = Node.create({
  name: "imageGallery",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      images: {
        default: [] as { src: string; alt?: string }[],
        parseHTML: (el: HTMLElement) =>
          Array.from(el.querySelectorAll("img")).map((i) => ({ src: i.getAttribute("src") || "", alt: i.getAttribute("alt") || "" })),
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-kg-gallery]" }];
  },
  renderHTML({ node }) {
    const imgs = (node.attrs.images as { src: string; alt?: string }[]) || [];
    return [
      "div",
      mergeAttributes({ class: `kg-gallery kg-gallery-${Math.min(imgs.length, 4)}`, "data-kg-gallery": "1" }),
      ...imgs.map((i) => ["img", { src: i.src, alt: i.alt || "", loading: "lazy" }]),
    ] as never;
  },
  addCommands() {
    return {
      insertImageGallery:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
