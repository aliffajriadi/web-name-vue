"use client";

import { useQuery } from "@tanstack/react-query";
import { getSkills, Skill } from "@/lib/api";
import { Loader2, Sparkles } from "lucide-react";

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
      <div className="py-20 flex justify-center items-center gap-4">
        <Loader2 className="animate-spin text-primary" size={24} />
        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Calibrating Neural Net...
        </span>
      </div>
    );
  }

  return (
    <section className="py-32 relative overflow-hidden" id="skills">
      {/* Ambient background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={14} /> Intelligence Stack
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">
              Skills / <br /> Tech Stack
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md font-medium text-lg leading-relaxed italic">
            A curated list of technical protocols and frameworks I use to build
            resilient digital architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
          {groupedSkills &&
            Object.entries(groupedSkills).map(
              ([category, items]: [string, Skill[]]) => (
                <div key={category} className="group">
                  <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-10 pb-4 border-b border-border group-hover:border-primary/50 transition-colors">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {items.map((skill: Skill) => (
                      <div
                        key={skill.id}
                        className="group/item relative px-5 py-3 bg-muted/30 border border-border rounded-2xl hover:border-primary/50 hover:bg-card transition-all duration-300 flex items-center gap-3 overflow-hidden"
                      >
                        {/* Progress background */}
                        <div
                          className="absolute bottom-0 left-0 h-[2px] bg-primary/40 group-hover/item:h-full group-hover/item:opacity-5 transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />

                        <span className="relative text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">
                          {skill.name}
                        </span>
                        <span className="relative text-[8px] font-black text-muted-foreground opacity-40 group-hover/item:opacity-100 transition-opacity">
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
