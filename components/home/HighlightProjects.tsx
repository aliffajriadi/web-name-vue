"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects, Project } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HighlightProjects() {
  const { t } = useLanguage();
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const featured = projects?.filter((p: Project) => p.isFeatured).slice(0, 3);

  if (isLoading)
    return (
      <div
        className="py-20 text-center text-xs uppercase tracking-[0.25em] animate-pulse"
        style={{ color: "var(--color-text-body)" }}
      >
        {t("Loading projects...", "Memuat proyek...")}
      </div>
    );

  return (
    <section
      className="py-20 md:py-28"
      style={{ borderTop: "1px solid var(--border-outline)", background: "var(--muted)" }}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
          <div>
            <div className="eyebrow-label mb-5" style={{ justifyContent: "flex-start" }}>
              {t("Selected Work", "Karya Terpilih")}
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold leading-tight"
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                color: "var(--color-primary-dark)",
              }}
            >
              {t("Featured", "Proyek")}
              <br />
              <em style={{ color: "var(--color-accent-italic)" }}>
                {t("Projects", "Unggulan")}
              </em>
            </h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors group"
            style={{ color: "var(--color-primary)" }}
          >
            {t("View All", "Lihat Semua")}
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured?.map((project: Project) => (
            <div
              key={project.id}
              className="group flex flex-col overflow-hidden transition-all duration-400 hover:-translate-y-1"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border-outline)",
                borderRadius: "1.5rem",
              }}
            >
              {project.image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={t(project.title_en, project.title_id)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md"
                      style={{
                        background: "rgba(242,248,241,0.9)",
                        color: "var(--color-primary)",
                        border: "1px solid var(--border-outline)",
                      }}
                    >
                      {project.type}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-7 flex flex-col flex-grow">
                <h3
                  className="text-xl font-bold mb-3 leading-snug transition-colors duration-200 group-hover:text-[var(--color-primary)]"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    color: "var(--color-primary-dark)",
                  }}
                >
                  {t(project.title_en, project.title_id)}
                </h3>
                <p
                  className="text-sm mb-6 flex-grow leading-relaxed line-clamp-3"
                  style={{ color: "var(--color-text-body)" }}
                >
                  {t(project.description_en, project.description_id)}
                </p>

                {/* Tech stack pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.split(",").map(
                    (tech: string, i: number) =>
                      i < 4 && (
                        <span
                          key={tech}
                          className="text-[10px] font-medium px-3 py-1 rounded-full"
                          style={{
                            background: "var(--muted)",
                            color: "var(--color-text-body)",
                            border: "1px solid var(--border-outline)",
                          }}
                        >
                          {tech.trim()}
                        </span>
                      ),
                  )}
                </div>

                {/* CTA link */}
                <Link
                  href={project.demoUrl || project.githubUrl || "/projects"}
                  target="_blank"
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] pt-5 transition-colors group/link"
                  style={{
                    borderTop: "1px solid var(--border-outline)",
                    color: "var(--color-primary)",
                  }}
                >
                  {t("View Project", "Lihat Proyek")}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
