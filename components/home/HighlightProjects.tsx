"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects, Project } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Cpu } from "lucide-react";
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
      <div className="py-20 text-center text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
        Scanning Portfolios...
      </div>
    );

  return (
    <section className="py-24 border-t border-border bg-muted/10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tighter uppercase leading-[1.0]">
              {t("Protocols", "Protokol")}
            </h2>
            <p className="text-muted-foreground font-medium max-w-md">
              {t(
                "Direct implementations of high-performance architectural solutions.",
                "Implementasi langsung dari solusi arsitektur berperforma tinggi.",
              )}
            </p>
          </div>
          <Link
            href="/projects"
            className="text-primary hover:text-foreground text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 group transition-colors"
          >
            {t("Explore All", "Jelajahi Semua")}{" "}
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured?.map((project: Project) => (
            <div
              key={project.id}
              className="group flex flex-col bg-card border border-border rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-3xl hover:shadow-primary/5 active:scale-[0.98]"
            >
              {project.image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={t(project.title_en, project.title_id)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="flex items-center gap-2 px-4 py-1.5 bg-background/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-border shadow-xl">
                      <Cpu size={12} className="text-primary" /> {project.type}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-10 flex flex-col h-full bg-gradient-to-b from-card to-muted/20">
                <h3 className="text-2xl font-black mb-4 text-foreground group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                  {t(project.title_en, project.title_id)}
                </h3>
                <p className="text-muted-foreground text-base mb-8 flex-grow leading-relaxed font-medium line-clamp-3">
                  {t(project.description_en, project.description_id)}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.split(",").map(
                    (tech: string, i: number) =>
                      i < 4 && (
                        <span
                          key={tech}
                          className="text-[10px] uppercase font-black px-3 py-1 bg-muted text-muted-foreground rounded-xl border border-border/50"
                        >
                          {tech.trim()}
                        </span>
                      ),
                  )}
                </div>
                <Link
                  href={project.demoUrl || project.githubUrl || "/projects"}
                  target="_blank"
                  className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-foreground group-hover:text-primary transition-colors pt-6 border-t border-border"
                >
                  {t("Initialize Access", "Inisialisasi Akses")}{" "}
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
