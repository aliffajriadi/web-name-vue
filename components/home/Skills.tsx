"use client";

import { useQuery } from "@tanstack/react-query";
import { getSkills, Skill } from "@/lib/api";

export default function Skills() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  const groupedSkills = skills?.reduce(
    (acc: Record<string, Skill[]>, skill: Skill) => {
      const category = skill.category || "General";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  if (isLoading) {
    return (
      <div
        className="py-20 flex justify-center items-center gap-3"
        style={{ color: "var(--color-text-body)" }}
      >
        <span className="text-xs uppercase tracking-[0.2em] animate-pulse">
          Loading skills...
        </span>
      </div>
    );
  }

  return (
    <section
      className="py-20 md:py-28"
      id="skills"
      style={{ borderTop: "1px solid var(--border-outline)", background: "var(--muted)" }}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="mb-16">
          <div className="eyebrow-label mb-5" style={{ justifyContent: "flex-start" }}>
            Tech Stack
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              color: "var(--color-primary-dark)",
            }}
          >
            Skills &amp;
            <br />
            <em style={{ color: "var(--color-accent-italic)" }}>Expertise</em>
          </h2>
          <p
            className="mt-4 text-base leading-relaxed max-w-md"
            style={{ color: "var(--color-text-body)" }}
          >
            A curated set of technologies I use to build resilient,
            thoughtful digital products.
          </p>
        </div>

        {/* Grouped skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {groupedSkills &&
            Object.entries(groupedSkills).map(
              ([category, items]: [string, Skill[]]) => (
                <div key={category}>
                  {/* Category label */}
                  <div
                    className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-5 pb-3"
                    style={{
                      color: "var(--color-primary)",
                      borderBottom: "1px solid var(--border-outline)",
                    }}
                  >
                    {category}
                  </div>

                  {/* Pill skills */}
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((skill: Skill) => (
                      <div
                        key={skill.id}
                        className="group/skill relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-default hover:-translate-y-0.5"
                        style={{
                          background: "var(--card)",
                          border: "1px solid var(--border-outline)",
                          color: "var(--color-text-body)",
                        }}
                        title={`${skill.level}% proficiency`}
                      >
                        <span
                          className="transition-colors duration-200 group-hover/skill:text-[var(--color-primary)]"
                          style={{ color: "var(--color-primary-dark)" }}
                        >
                          {skill.name}
                        </span>
                        <span
                          className="text-[10px] opacity-50 group-hover/skill:opacity-80 transition-opacity"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {skill.level}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
        </div>
      </div>
    </section>
  );
}
