"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects, Project } from "@/lib/api";
import { ExternalLink, Github, Loader2, Cpu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("All");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const types = [
    "All",
    ...Array.from(new Set(projects?.map((p: Project) => p.type) || [])),
  ];

  const filteredProjects =
    filter === "All"
      ? projects
      : projects?.filter((p: Project) => p.type === filter);

  return (
    <div className="py-24">
      <div className="container-custom max-w-5xl!">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
            {t("Selected Work", "Proyek Terpilih")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-medium">
            {t(
              "Exploring the intersection of AI, IoT, and high-performance web engineering.",
              "Menjelajahi persimpangan AI, IoT, dan rekayasa web berperforma tinggi.",
            )}
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {types.map((type: string) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${
                filter === type
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {filteredProjects?.map((project: Project) => (
              <div
                key={project.id}
                className="group bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all flex flex-col shadow-sm hover:shadow-2xl hover:shadow-primary/10 duration-500"
              >
                {project.image && (
                  <div className="relative aspect-16/10 w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={t(project.title_en, project.title_id)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="flex items-center gap-2 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-border">
                        <Cpu size={12} className="text-primary" />{" "}
                        {project.type}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-8 flex flex-col grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors pr-4">
                      {t(project.title_en, project.title_id)}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {project.githubUrl && (
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-muted rounded-full border border-border"
                        >
                          <Github size={18} />
                        </Link>
                      )}
                      {project.demoUrl && (
                        <Link
                          href={project.demoUrl}
                          target="_blank"
                          className="p-2 text-primary hover:bg-primary hover:text-primary-foreground transition-all bg-primary/10 rounded-full border border-primary/20"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-base mb-8 grow leading-relaxed font-medium">
                    {t(project.description_en, project.description_id)}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
                    {project.techStack.split(",").map((tech: string) => (
                      <span
                        key={tech}
                        className="text-[9px] uppercase font-black tracking-widest px-2.5 py-1 bg-muted/50 text-muted-foreground rounded-lg border border-border/50"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
