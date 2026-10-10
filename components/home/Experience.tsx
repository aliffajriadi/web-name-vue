"use client";

import { useQuery } from "@tanstack/react-query";
import { getExperiences, Experience as Exp } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";

export default function Experience() {
  const { t } = useLanguage();
  const { data: experiences } = useQuery<Exp[]>({
    queryKey: ["experiences"],
    queryFn: getExperiences,
  });
  if (!experiences?.length) return null;

  return (
    <section className="section rule-top bg-muted/40">
      <div className="container-custom">
        <SectionHead index="04" label={t("Experience", "Pengalaman")}>
          {t("The road", "Perjalanan")}{" "}
          <span className="font-accent text-[color:var(--accent)]">{t("so far.", "sejauh ini.")}</span>
        </SectionHead>

        <ol className="border-t border-border">
          {experiences.map((exp, i) => (
            <Reveal as="li" key={exp.id} delay={i * 0.05}>
              <div className="grid gap-3 border-b border-border py-8 md:grid-cols-[180px_1fr_1.2fr] md:gap-10 md:py-10 transition-colors hover:bg-background/60">
                <span className="font-mono text-sm text-[color:var(--accent)]">{exp.year}</span>
                <div>
                  <h3 className="font-display text-2xl">{t(exp.role_en, exp.role_id)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{exp.company}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t(exp.description_en, exp.description_id)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
