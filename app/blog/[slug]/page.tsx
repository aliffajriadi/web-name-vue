import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Blog } from "@/lib/api";
import {
  absoluteUrl,
  apiFetch,
  htmlToText,
  SITE,
  SITE_URL,
  truncate,
  wordCount,
} from "@/lib/site";
import BlogContent from "./BlogContent";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

const getBlog = (slug: string) => apiFetch<Blog>(`/blogs/${encodeURIComponent(slug)}`);

export async function generateStaticParams() {
  const blogs = await apiFetch<Blog[]>("/blogs", 300);
  return (blogs || []).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Artikel tidak ditemukan", robots: { index: false } };

  const title = blog.title_en || blog.title_id;
  const description = truncate(
    htmlToText(blog.excerpt_en || blog.excerpt_id || blog.content_en || blog.content_id),
    158,
  );
  const url = `/blog/${blog.slug}`;
  const ogImage = blog.image
    ? [{ url: blog.image, alt: title }]
    : [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    keywords: [blog.category, "Alif Fajriadi", "blog teknologi", ...title.split(" ").filter((w) => w.length > 5).slice(0, 5)],
    authors: [{ name: SITE.name, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: SITE.shortName,
      images: ogImage,
      publishedTime: blog.date ? new Date(blog.date).toISOString() : undefined,
      modifiedTime: blog.updatedAt || (blog.date ? new Date(blog.date).toISOString() : undefined),
      authors: [SITE.name],
      section: blog.category,
      tags: [blog.category],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage.map((i) => i.url),
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const title = blog.title_en || blog.title_id;
  const url = absoluteUrl(`/blog/${blog.slug}`);
  const published = blog.date ? new Date(blog.date).toISOString() : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        headline: truncate(title, 110),
        description: truncate(htmlToText(blog.excerpt_en || blog.excerpt_id), 300),
        image: blog.image ? [blog.image] : [absoluteUrl(`/blog/${blog.slug}/opengraph-image`)],
        datePublished: published,
        dateModified: blog.updatedAt || published,
        articleSection: blog.category,
        wordCount: wordCount(blog.content_en || blog.content_id),
        inLanguage: blog.content_en ? "en" : "id",
        author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: SITE.name, url: SITE_URL },
        publisher: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: SITE.name },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BlogContent blog={blog} />
    </>
  );
}
