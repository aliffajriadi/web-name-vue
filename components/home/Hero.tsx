"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/api";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

/* ── Decorative SVG background layer ─────────────────────────── */
function HeroDecoratives() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Large outlined circle — top-left, partially off-canvas */}
      <svg
        className="absolute -top-24 -left-32 animate-pulse-soft"
        width="480"
        height="480"
        viewBox="0 0 480 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="240"
          cy="240"
          r="238"
          stroke="var(--color-primary)"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        <circle
          cx="240"
          cy="240"
          r="180"
          stroke="var(--color-primary)"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      </svg>

      {/* Organic curved line — diagonal through hero */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 900 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M -20 420 C 150 300, 350 480, 580 200 C 720 60, 820 180, 950 120"
          stroke="var(--decorative-line)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 100 600 C 250 440, 420 560, 620 340 C 760 200, 860 320, 1000 240"
          stroke="var(--decorative-line)"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>

      {/* Small outlined circle + dot — bottom-right accent */}
      <svg
        className="absolute bottom-16 right-12 animate-float-slow"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="40"
          cy="40"
          r="38"
          stroke="var(--color-primary)"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="var(--color-primary)"
          fillOpacity="0.35"
        />
      </svg>

      {/* Extra small circles — mid area */}
      <svg
        className="absolute top-1/3 right-[8%]"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="var(--color-primary)"
          strokeOpacity="0.15"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

/* ── Scroll indicator ─────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <div
      className="flex flex-col items-center gap-2 mt-20 md:mt-28"
      style={{ color: "var(--color-text-body)" }}
    >
      <span className="text-[10px] uppercase tracking-[0.22em] font-medium">
        Scroll
      </span>
      <div className="flex flex-col items-center gap-1">
        <span
          className="block w-[1px] h-6 animate-pulse-soft"
          style={{ background: "var(--border-outline)" }}
        />
        <span
          className="block w-[5px] h-[5px] rounded-full"
          style={{ background: "var(--color-primary)", opacity: 0.5 }}
        />
      </div>
    </div>
  );
}

/* ── Main Hero component ──────────────────────────────────────── */
export default function Hero() {
  const { t } = useLanguage();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading)
    return <div className="py-40 md:py-48 h-[600px]" />;

  /* Build 3-line headline from tagline or fallback */
  const tagline =
    t(profile?.tagline_en, profile?.tagline_id) ||
    "Building Digital Experiences That Matter";

  // Split tagline into 3 parts for the editorial headline
  const words = tagline.split(" ");
  const third = Math.ceil(words.length / 3);
  const line1 = words.slice(0, third).join(" ");
  const line2 = words.slice(third, third * 2).join(" ");
  const line3 = words.slice(third * 2).join(" ");

  const subtext = t(
    `I craft web experiences that merge clean code with thoughtful design — where functionality and beauty live together.`,
    `Saya membangun pengalaman web yang memadukan kode bersih dengan desain yang penuh pertimbangan — tempat fungsionalitas dan keindahan berdampingan.`,
  );

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ paddingTop: "clamp(5rem, 12vw, 9rem)", paddingBottom: "2rem" }}
    >
      {/* Decorative background layer */}
      <HeroDecoratives />

      {/* Content */}
      <div className="container-custom relative" style={{ zIndex: 1 }}>
        {/* Eyebrow label */}
        <div className="eyebrow-label justify-center mb-8">
          {t("Web Developer & UI/UX Enthusiast", "Web Developer & UI/UX Enthusiast")}
        </div>

        {/* 3-line headline */}
        <h1 className="hero-headline text-center mb-8">
          <span className="block">{line1}</span>
          <span className="block hero-headline-italic">{line2}</span>
          <span className="block">{line3}</span>
        </h1>

        {/* Subtext */}
        <p
          className="text-center mx-auto mb-10 text-base md:text-lg leading-relaxed max-w-[560px]"
          style={{ color: "var(--color-text-body)" }}
        >
          {subtext}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/projects" className="btn-primary">
            {t("See My Work", "Lihat Proyek")}
          </Link>
          <Link href="/#contact" className="btn-outline">
            {t("Let's Connect", "Hubungi Saya")}
          </Link>
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator />
      </div>
    </section>
  );
}
