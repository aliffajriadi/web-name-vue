"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects, Project } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";

export default function HighlightProjects() {
  const { t } = useLanguage();
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const featured = (projects?.filter((p) => p.isFeatured).length
    ? projects.filter((p) => p.isFeatured)
    : projects
  )?.slice(0, 4);

  return (
    <section className="section rule-top bg-muted/40">
      <div className="container-custom">
        <SectionHead
          index="02"
          label={t("Selected work", "Karya terpilih")}
          aside={
            <Link href="/projects" className="btn-outline self-start md:self-end">
              {t("All projects", "Semua proyek")} <ArrowUpRight size={16} />
            </Link>
          }
        >
          {t("Things I've", "Hal-hal yang")}{" "}
          <span className="font-accent text-[color:var(--accent)]">{t("built.", "kubuat.")}</span>
        </SectionHead>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="aspect-[16/11] animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        )}

        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {featured?.map((p, i) => {
            const href = p.demoUrl || p.githubUrl || "/projects";
            const external = href.startsWith("http");
            return (
              <Reveal key={p.id} delay={(i % 2) * 0.08} className={i % 2 === 1 ? "md:mt-20" : ""}>
                <Link
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group block"
                >
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
                    <span className="chip absolute left-4 top-4 !bg-background/85 backdrop-blur">
                      {p.type}
                    </span>
                    <span className="absolute bottom-4 right-4 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-[var(--lime)] text-[color:var(--lime-ink)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <div className="mt-5 flex items-baseline gap-4">
                    <span className="font-mono text-xs text-[color:var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl">
                        {t(p.title_en, p.title_id)}
                      </h3>
                      <p className="mt-2 max-w-[48ch] text-sm text-muted-foreground line-clamp-2">
                        {t(p.description_en, p.description_id)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.techStack.split(",").slice(0, 4).map((tech) => (
                          <span key={tech} className="chip">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
