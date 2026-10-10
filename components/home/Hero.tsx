"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { getBlogs, getProfile, getProjects, getSkills, Blog, Project, Skill } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { t } = useLanguage();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: projects } = useQuery<Project[]>({ queryKey: ["projects"], queryFn: getProjects });
  const { data: blogs } = useQuery<Blog[]>({ queryKey: ["blogs", "All", ""], queryFn: () => getBlogs() });
  const { data: skills } = useQuery<Skill[]>({ queryKey: ["skills"], queryFn: getSkills });

  const tagline: string =
    t(profile?.tagline_en, profile?.tagline_id) ||
    t("Building digital experiences that matter.", "Membangun pengalaman digital yang bermakna.");
  const words = tagline.replace(/\.$/, "").split(" ");
  // highlight the middle chunk in the serif italic
  const a = Math.max(1, Math.floor(words.length / 3));
  const b = Math.max(a + 1, Math.ceil((words.length * 2) / 3));
  const pre = words.slice(0, a).join(" ");
  const mid = words.slice(a, b).join(" ");
  const post = words.slice(b).join(" ");

  const stats = [
    { n: projects?.length, l: t("Projects", "Proyek") },
    { n: blogs?.length, l: t("Articles", "Artikel") },
    { n: skills?.length, l: t("Technologies", "Teknologi") },
  ];

  const marquee = (skills?.map((s) => s.name) ?? [
    "Next.js", "React", "TypeScript", "Node.js", "Prisma", "IoT", "AI", "Tailwind",
  ]);

  return (
    <section className="relative overflow-hidden">
      {/* soft lime glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-40 blur-[110px] dark:opacity-25"
        style={{ background: "var(--lime)" }}
      />

      <div className="container-custom relative pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="grid items-end gap-12 lg:grid-cols-[1.35fr_0.65fr]">
          <div>

            <h1 className="font-display text-[clamp(2.6rem,7.4vw,6rem)] leading-[0.98] tracking-[-0.045em]">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
              >
                {pre}
              </motion.span>
              <motion.span
                className="block font-accent text-[color:var(--accent)] tracking-[-0.03em] text-[1.08em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
              >
                {mid}
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease }}
              >
                {post}
                <span className="text-[color:var(--accent)]">.</span>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              className="mt-8 max-w-[52ch] text-base md:text-lg text-muted-foreground"
            >
              {t(
                "I'm a full-stack developer who ships clean, fast web products — with a soft spot for IoT and AI. I write about what I learn along the way.",
                "Saya full-stack developer yang membangun produk web yang bersih dan cepat — dengan ketertarikan khusus pada IoT dan AI. Saya menulis tentang apa yang saya pelajari di sepanjang jalan.",
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link href="/projects" className="btn-primary">
                {t("See my work", "Lihat proyek")} <ArrowUpRight size={16} />
              </Link>
              <Link href="#contact" className="btn-outline">
                {t("Get in touch", "Hubungi saya")}
              </Link>
            </motion.div>
          </div>

          {/* portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="relative mx-auto w-full max-w-[340px] lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tr-[8rem] border border-border bg-muted">
              {profile?.imageUrl ? (
                <Image
                  src={profile.imageUrl}
                  alt={`${profile?.name || "Alif"} — portrait`}
                  fill
                  priority
                  sizes="(min-width:1024px) 380px, 340px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center font-accent text-8xl text-[color:var(--accent)]">
                  a
                </div>
              )}
            </div>

            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2.5 text-xs backdrop-blur-xl shadow-lg">
              <MapPin size={13} className="text-[color:var(--accent)]" />
              {t("Based in Indonesia", "Berbasis di Indonesia")}
            </div>

            <svg
              aria-hidden
              viewBox="0 0 120 120"
              className="absolute -right-6 -top-6 h-28 w-28 animate-spin-slow"
            >
              <defs>
                <path id="circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <circle cx="60" cy="60" r="58" fill="var(--lime)" />
              <text fontSize="10.5" fontFamily="var(--font-geist-mono)" letterSpacing="2.6" fill="var(--lime-ink)">
                <textPath href="#circ">FULL-STACK · IOT · AI · WEB ·</textPath>
              </text>
            </svg>
          </motion.div>
        </div>

        {/* stats */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 md:mt-24 grid grid-cols-3 border-y border-border"
        >
          {stats.map((s, i) => (
            <div key={s.l} className={`py-6 md:py-8 ${i > 0 ? "border-l border-border pl-5 md:pl-10" : ""}`}>
              <dd className="font-display text-4xl md:text-6xl tabular-nums">
                {s.n ?? "–"}
                <span className="text-[color:var(--accent)]">+</span>
              </dd>
              <dt className="eyebrow mt-2">{s.l}</dt>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* tech marquee */}
      <div className="marquee overflow-hidden border-b border-border py-5" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center">
              {marquee.map((m, i) => (
                <li key={`${k}-${i}`} className="flex items-center font-display text-2xl md:text-3xl text-muted-foreground">
                  <span className="px-6 md:px-9">{m}</span>
                  <span className="font-accent text-[color:var(--accent)]">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

    </section>
  );
}
