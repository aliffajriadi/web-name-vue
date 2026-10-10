"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "@/components/Reveal";

export default function HowIWork() {
  const { t } = useLanguage();
  const steps = [
    {
      title: t("Understand the problem", "Pahami masalahnya"),
      body: t(
        'I start with the "why" before the "how". Business goals and real user needs are the foundation everything else stands on.',
        'Saya mulai dari "mengapa" sebelum "bagaimana". Tujuan bisnis dan kebutuhan pengguna yang nyata adalah fondasi dari semuanya.',
      ),
    },
    {
      title: t("Clean architecture", "Arsitektur yang bersih"),
      body: t(
        "Modular, testable, documented. Technical debt is a choice — I choose to avoid it.",
        "Modular, teruji, terdokumentasi. Technical debt adalah pilihan — saya memilih menghindarinya.",
      ),
    },
    {
      title: t("Iterate in the open", "Iterasi secara terbuka"),
      body: t(
        "Ship a small version fast, learn from real feedback, then improve — instead of chasing theoretical perfection.",
        "Rilis versi kecil dengan cepat, belajar dari umpan balik nyata, lalu perbaiki — bukan mengejar kesempurnaan teoretis.",
      ),
    },
    {
      title: t("Honest communication", "Komunikasi jujur"),
      body: t(
        "Transparent updates and realistic timelines. Trust and clarity over over-promising.",
        "Kabar yang transparan dan tenggat yang realistis. Kepercayaan dan kejelasan di atas janji berlebihan.",
      ),
    },
  ];

  return (
    <section className="section rule-top bg-muted/40">
      <div className="container-custom grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="eyebrow mb-5">
            <span className="idx">(06)</span> {t("Process", "Proses")}
          </div>
          <h2 className="font-display text-4xl md:text-6xl">
            {t("How I", "Cara saya")}{" "}
            <span className="font-accent text-[color:var(--accent)]">{t("work.", "bekerja.")}</span>
          </h2>
        </div>
        <ol>
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.06}>
              <div className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-8 first:border-t-0 first:pt-0">
                <span className="font-mono text-sm text-[color:var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-[52ch] text-muted-foreground">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
