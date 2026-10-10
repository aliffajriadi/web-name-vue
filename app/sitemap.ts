import type { MetadataRoute } from "next";
import type { Blog } from "@/lib/api";
import { absoluteUrl, apiFetch } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = (await apiFetch<Blog[]>("/blogs", 3600)) || [];
  const latest = blogs[0]?.updatedAt || blogs[0]?.date;

  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/projects"), changeFrequency: "monthly", priority: 0.8 },
    {
      url: absoluteUrl("/blog"),
      lastModified: latest ? new Date(latest) : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: absoluteUrl("/gallery"), changeFrequency: "monthly", priority: 0.4 },
    ...blogs.map((b) => ({
      url: absoluteUrl(`/blog/${b.slug}`),
      lastModified: new Date(b.updatedAt || b.date || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
