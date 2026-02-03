"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/api";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const { t } = useLanguage();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) return <div className="py-24 md:py-32 h-[400px]" />;

  return (
    <section className="py-24 md:py-32">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex flex-col gap-6 max-w-2xl text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              {t(profile?.tagline_en, profile?.tagline_id) ||
                "Building digital experiences that matter."}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
              {t(
                `I'm ${profile?.name}, a ${profile?.role_en}. ${profile?.bio_en}`,
                `Saya ${profile?.name}, seorang ${profile?.role_id}. ${profile?.bio_id}`,
              )}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <Link
                href="/projects"
                className="px-8 py-4 bg-primary text-primary-foreground font-black dark:bg-primary/10 dark:hover:bg-primary/20 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                {t("Explore Projects", "Lihat Proyek")} <ArrowRight size={18} />
              </Link>
              <Link
                href="/blog"
                className="px-8 py-4 bg-muted text-foreground font-black rounded-xl hover:bg-border transition-all border border-border"
              >
                {t("Read Blog", "Baca Blog")}
              </Link>
            </div>
          </div>

          <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 mt-8 md:mt-0">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-6" />
            <div className="absolute inset-0 bg-card rounded-3xl border border-border overflow-hidden shadow-2xl">
              <Image
                src={profile?.imageUrl || "/profile.png"}
                alt={`${profile?.name || "Alif"} Profile`}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
