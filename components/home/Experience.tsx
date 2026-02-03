"use client";

import { useQuery } from "@tanstack/react-query";
import { getExperiences } from "@/lib/api";
import { History } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ExperienceRecord {
  id: string;
  year: string;
  role_en: string;
  role_id: string;
  company: string;
  description_en: string;
  description_id: string;
}

export default function Experience() {
  const { t } = useLanguage();
  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: getExperiences,
  });

  return (
    <section className="py-20 border-t border-border">
      <div className="container-custom">
        <h2 className="text-2xl font-black text-foreground mb-12 flex items-center gap-3 uppercase tracking-tighter">
          <History className="text-primary" size={24} />{" "}
          {t("Timeline", "Linimasa")}
        </h2>

        <div className="relative space-y-12 before:absolute before:inset-0 before:ml-4 md:before:ml-[80px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-transparent">
          {isLoading && (
            <p className="text-muted-foreground ml-12 font-black uppercase tracking-widest text-[10px]">
              Accessing records...
            </p>
          )}
          {experiences?.map((exp: ExperienceRecord) => (
            <div
              key={exp.id}
              className="relative grid md:grid-cols-[160px_1fr] gap-4 md:gap-12 pl-12 md:pl-0"
            >
              {/* Dot */}
              <div className="absolute left-3.5 md:left-[76px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background z-10" />

              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pt-1 md:text-right">
                {exp.year}
              </div>
              <div className="space-y-3 bg-card p-8 rounded-[2rem] border border-border shadow-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                <h3 className="text-xl font-black text-foreground leading-none uppercase tracking-tight">
                  {t(exp.role_en, exp.role_id)}{" "}
                  <span className="text-primary mx-1">@</span> {exp.company}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                  {t(exp.description_en, exp.description_id)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
