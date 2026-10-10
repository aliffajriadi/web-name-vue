import type { Blog } from "@/lib/api";
import { absoluteUrl, apiFetch, htmlToText, SITE, truncate } from "@/lib/site";

export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const blogs = (await apiFetch<Blog[]>("/blogs", 3600)) || [];
  const items = blogs
    .slice(0, 30)
    .map((b) => {
      const url = absoluteUrl(`/blog/${b.slug}`);
      return `<item>
  <title>${esc(b.title_en || b.title_id)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${new Date(b.date || Date.now()).toUTCString()}</pubDate>
  <category>${esc(b.category)}</category>
  <description>${esc(truncate(htmlToText(b.excerpt_en || b.excerpt_id), 300))}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(SITE.name)} — Blog</title>
  <link>${absoluteUrl("/blog")}</link>
  <description>${esc(SITE.description)}</description>
  <language>id</language>
  <atom:link href="${absoluteUrl("/blog/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
