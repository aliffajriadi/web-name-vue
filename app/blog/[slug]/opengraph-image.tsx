import { ImageResponse } from "next/og";
import type { Blog } from "@/lib/api";
import { apiFetch, SITE, truncate } from "@/lib/site";

export const alt = "Article cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await apiFetch<Blog>(`/blogs/${encodeURIComponent(slug)}`, 3600);
  const title = truncate(blog?.title_en || blog?.title_id || SITE.name, 110);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0B0E09",
          color: "#ECEEE4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 700 }}>
            alif<div style={{ width: 14, height: 14, borderRadius: 99, background: "#B9E86C" }} />
          </div>
          {blog?.category && (
            <div
              style={{
                border: "2px solid rgba(236,238,228,0.3)",
                borderRadius: 99,
                padding: "8px 22px",
                fontSize: 24,
                textTransform: "uppercase",
                letterSpacing: 3,
              }}
            >
              {blog.category}
            </div>
          )}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 62 : 78, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9AA492" }}>
          <span>{SITE.name}</span>
          <span style={{ color: "#B9E86C" }}>aliffajriadi.my.id</span>
        </div>
      </div>
    ),
    size,
  );
}
