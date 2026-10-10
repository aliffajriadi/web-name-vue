"use client";

import { useQuery } from "@tanstack/react-query";
import { Github, Linkedin, Twitter } from "lucide-react";
import { getProfile } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";
import Reveal from "@/components/Reveal";

export default function About() {
  const { t } = useLanguage();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const name = profile?.name || "Alif";

  const socials = [
    { href: profile?.github || SITE.github, label: "GitHub", icon: Github },
    { href: profile?.linkedin || SITE.linkedin, label: "LinkedIn", icon: Linkedin },
    ...(profile?.twitter ? [{ href: profile.twitter, label: "X / Twitter", icon: Twitter }] : []),
  ];

  return (
    <section id="about" className="section">
      <div className="container-custom grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <div className="eyebrow mb-5">
              <span className="idx">(01)</span> {t("About", "Tentang")}
            </div>
            <h2 className="font-display text-4xl md:text-6xl">
              {t("Code is the", "Kode hanyalah")}{" "}
              <span className="font-accent text-[color:var(--accent)]">
                {t("medium,", "medium,")}
              </span>{" "}
              {t("the product is the point.", "produknya yang utama.")}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p className="text-foreground">
              {t(
                `I'm ${name} — a developer who likes the whole path from a rough idea to a thing people actually use: the interface, the API behind it, the database, and the deployment.`,
                `Saya ${name} — developer yang menyukai seluruh perjalanan dari ide mentah hingga produk yang benar-benar dipakai orang: antarmuka, API, database, sampai deployment.`,
              )}
            </p>
            <p className="text-muted-foreground">
              {t(
                "I believe good software is quiet. When it works, nobody notices the complexity underneath — they just feel the flow. That's the bar I hold myself to.",
                "Saya percaya software yang baik itu tenang. Ketika bekerja dengan baik, tidak ada yang menyadari kerumitan di baliknya — mereka hanya merasakan alurnya. Itulah standar yang saya pegang.",
              )}
            </p>
            <p className="text-muted-foreground">
              {t(
                "Beyond the stack I care about clarity, curiosity and consistency. I try to be the bridge between a business problem and a technical solution — and I write things down so others can learn from them.",
                "Di luar tech stack, saya peduli pada kejelasan, rasa ingin tahu, dan konsistensi. Saya berusaha menjadi jembatan antara masalah bisnis dan solusi teknis — dan saya menuliskannya agar orang lain bisa belajar.",
              )}
            </p>

            <ul className="flex flex-wrap gap-3 pt-4">
              {socials.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="btn-outline !py-3 !px-5 !text-sm"
                  >
                    <Icon size={15} /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
