"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBlogs, Blog } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import PostCard from "@/components/blog/PostCard";

export default function BlogPreview() {
  const { t } = useLanguage();
  const { data: blogs } = useQuery<Blog[]>({
    queryKey: ["blogs", "All", ""],
    queryFn: () => getBlogs(),
  });
  const latest = blogs?.slice(0, 3);
  if (!latest?.length) return null;

  return (
    <section className="section rule-top">
      <div className="container-custom">
        <SectionHead
          index="03"
          label={t("Writing", "Tulisan")}
          aside={
            <Link href="/blog" className="btn-outline self-start md:self-end">
              {t("All articles", "Semua artikel")} <ArrowUpRight size={16} />
            </Link>
          }
        >
          {t("Notes from the", "Catatan dari")}{" "}
          <span className="font-accent text-[color:var(--accent)]">{t("workbench.", "meja kerja.")}</span>
        </SectionHead>

        <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
          {latest.map((post, i) => (
            <Reveal key={post.id || post.slug} delay={i * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
