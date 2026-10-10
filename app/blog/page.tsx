import type { Metadata } from "next";
import { apiFetch, absoluteUrl, SITE } from "@/lib/site";
import type { Blog } from "@/lib/api";
import BlogList from "./BlogList";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog & Tulisan Teknis",
  description:
    "Catatan teknis, tutorial, dan pelajaran dari membangun produk web, IoT, dan AI — ditulis oleh Alif Fajriadi.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/feed.xml" },
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog & Tulisan Teknis | Alif Fajriadi",
    description:
      "Catatan teknis, tutorial, dan pelajaran dari membangun produk web, IoT, dan AI.",
  },
};

export default async function BlogPage() {
  const [blogs, categories] = await Promise.all([
    apiFetch<Blog[]>("/blogs"),
    apiFetch<string[]>("/blogs/categories"),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE.name} — Blog`,
    url: absoluteUrl("/blog"),
    inLanguage: ["id-ID", "en-US"],
    author: { "@type": "Person", name: SITE.name, url: absoluteUrl("/") },
    blogPost: (blogs || []).slice(0, 20).map((b) => ({
      "@type": "BlogPosting",
      headline: b.title_en || b.title_id,
      url: absoluteUrl(`/blog/${b.slug}`),
      datePublished: b.date,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogList initialBlogs={blogs || []} initialCategories={categories || ["All"]} />
    </>
  );
}
