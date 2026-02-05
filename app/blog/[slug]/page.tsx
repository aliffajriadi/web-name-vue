import { API_BASE_URL } from "@/lib/api";
import BlogContent from "./BlogContent";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// Fetch data on the server
async function getBlog(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    });

    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  // Fallback title if en/id is missing
  const title = blog.title_en || blog.title_id || "Blog Post";
  const desc = blog.excerpt_en || blog.excerpt_id || "";

  return {
    title: title,
    description: desc,
    openGraph: {
      title: title,
      description: desc,
      type: "article",
      images: blog.image ? [blog.image] : [],
      publishedTime: blog.date,
      authors: ["Alif"],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: desc,
      images: blog.image ? [blog.image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return <BlogContent blog={blog} />;
}
