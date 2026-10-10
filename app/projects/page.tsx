"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects, Project } from "@/lib/api";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("All");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const types = ["All", ...Array.from(new Set(projects?.map((p) => p.type) || []))];
  const filtered = filter === "All" ? projects : projects?.filter((p) => p.type === filter);

  return (
    <div className="pb-24 pt-12 md:pt-20">
      <div className="container-custom">
        <header className="mb-12 md:mb-16">
          <div className="eyebrow mb-5">
            <span className="idx">(Work)</span> {projects?.length ?? 0} {t("projects", "proyek")}
          </div>
          <h1 className="font-display text-5xl md:text-8xl leading-[0.95]">
            {t("Selected", "Proyek")}{" "}
            <span className="font-accent text-[color:var(--accent)]">{t("work.", "pilihan.")}</span>
          </h1>
          <p className="mt-6 max-w-[54ch] text-lg text-muted-foreground">
            {t(
              "Exploring the intersection of AI, IoT, and high-performance web engineering.",
              "Menjelajahi persimpangan AI, IoT, dan rekayasa web berperforma tinggi.",
            )}
          </p>
        </header>

        <div className="scrollbar-hide -mx-1 mb-12 flex gap-2 overflow-x-auto border-y border-border px-1 py-4">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              aria-pressed={filter === type}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                filter === type
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[color:var(--paper)]"
                  : "border-border text-muted-foreground hover:border-[var(--ink)] hover:text-foreground",
              )}
            >
              {type === "All" ? t("All", "Semua") : type}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="grid gap-8 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/11] animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        )}

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {filtered?.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.08}>
              <article className="group">
                <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-border bg-card">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={t(p.title_en, p.title_id)}
                      fill
                      sizes="(min-width:768px) 560px, 100vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                  )}
                  <span className="chip absolute left-4 top-4 !bg-background/85 backdrop-blur">{p.type}</span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl">{t(p.title_en, p.title_id)}</h2>
                    <p className="mt-2 max-w-[52ch] text-muted-foreground">
                      {t(p.description_en, p.description_id)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {p.githubUrl && (
                      <Link
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Source code"
                        className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-[var(--ink)] hover:text-[color:var(--paper)]"
                      >
                        <Github size={16} />
                      </Link>
                    )}
                    {p.demoUrl && (
                      <Link
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Live demo"
                        className="grid h-10 w-10 place-items-center rounded-full bg-[var(--lime)] text-[color:var(--lime-ink)] transition-transform hover:-translate-y-0.5"
                      >
                        <ArrowUpRight size={18} />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.techStack.split(",").map((tech) => (
                    <span key={tech} className="chip">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
