"use client";

import { useQuery } from "@tanstack/react-query";
import { getExperiences } from "@/lib/api";
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
    <section
      className="py-20 md:py-28"
      style={{ borderTop: "1px solid var(--border-outline)" }}
    >
      <div className="container-custom">
        {/* Eyebrow + heading */}
        <div className="eyebrow-label mb-6" style={{ justifyContent: "flex-start" }}>
          {t("Career Path", "Perjalanan Karir")}
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-14 leading-tight"
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            color: "var(--color-primary-dark)",
          }}
        >
          {t("My", "Jejak")}
          <br />
          <em style={{ color: "var(--color-accent-italic)" }}>
            {t("Timeline", "Pengalaman")}
          </em>
        </h2>

        {/* Timeline */}
        <div className="relative space-y-10 pl-6">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-2 bottom-2 w-[1px]"
            style={{
              background: `linear-gradient(to bottom, var(--color-primary), var(--border-outline), transparent)`,
            }}
          />

          {isLoading && (
            <p
              className="text-xs uppercase tracking-[0.2em] animate-pulse"
              style={{ color: "var(--color-text-body)" }}
            >
              {t("Loading...", "Memuat...")}
            </p>
          )}

          {experiences?.map((exp: ExperienceRecord) => (
            <div key={exp.id} className="relative grid md:grid-cols-[120px_1fr] gap-4 md:gap-10">
              {/* Timeline dot */}
              <div
                className="absolute -left-[23px] top-[18px] w-[11px] h-[11px] rounded-full"
                style={{
                  background: "var(--color-primary)",
                  boxShadow: "0 0 0 3px var(--bg-base), 0 0 0 4px var(--border-outline)",
                }}
              />

              {/* Year */}
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.2em] pt-[22px] md:text-right"
                style={{ color: "var(--color-text-body)" }}
              >
                {exp.year}
              </div>

              {/* Card */}
              <div
                className="p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border-outline)",
                }}
              >
                <h3
                  className="text-lg font-bold mb-2 leading-snug"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    color: "var(--color-primary-dark)",
                  }}
                >
                  {t(exp.role_en, exp.role_id)}{" "}
                  <span style={{ color: "var(--color-accent-italic)" }}>@</span>{" "}
                  {exp.company}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-body)" }}
                >
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
