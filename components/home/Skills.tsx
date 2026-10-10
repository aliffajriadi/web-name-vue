"use client";

import { useQuery } from "@tanstack/react-query";
import { getSkills, Skill } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";

export default function Skills() {
  const { t } = useLanguage();
  const { data: skills } = useQuery<Skill[]>({ queryKey: ["skills"], queryFn: getSkills });

  const grouped = (skills || []).reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category || "General"] ||= []).push(s);
    return acc;
  }, {});
  if (!skills?.length) return null;

  return (
    <section id="skills" className="section rule-top">
      <div className="container-custom">
        <SectionHead index="05" label={t("Toolbox", "Perangkat")}>
          {t("Tools I reach for", "Alat yang sering")}{" "}
          <span className="font-accent text-[color:var(--accent)]">{t("daily.", "kupakai.")}</span>
        </SectionHead>

        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([category, items], gi) => (
            <Reveal key={category} delay={gi * 0.06}>
              <h3 className="eyebrow mb-5 border-b border-border pb-3 w-full">{category}</h3>
              <ul className="space-y-4">
                {items.map((s) => (
                  <li key={s.id}>
                    <div className="mb-1.5 flex items-baseline justify-between text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{s.level}%</span>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${Math.min(100, Math.max(0, s.level))}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
