export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://aliffajriadi.my.id"
).replace(/\/$/, "");

export const SITE = {
  name: "Alif Fajriadi",
  shortName: "Alif.dev",
  email: "aliffajriadi@gmail.com",
  description:
    "Portfolio dan blog Alif Fajriadi — Full-Stack Developer dengan fokus pada web modern, IoT, dan AI. Studi kasus, catatan teknis, dan proyek pilihan.",
  github: "https://github.com/aliffajriadi",
  linkedin: "https://www.linkedin.com/in/alif-fajriadi-434815276/",
} as const;

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Strip tags + collapse whitespace so we can measure / excerpt article HTML. */
export const htmlToText = (html = "") =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

export const readingMinutes = (html = "") =>
  Math.max(1, Math.round(htmlToText(html).split(" ").filter(Boolean).length / 200));

export const wordCount = (html = "") =>
  htmlToText(html).split(" ").filter(Boolean).length;

export const truncate = (s: string, n: number) =>
  s.length <= n ? s : `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…`;

/** Server-side fetch that never throws (build must survive an offline API). */
export async function apiFetch<T>(
  path: string,
  revalidate = 60,
): Promise<T | null> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${base}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
