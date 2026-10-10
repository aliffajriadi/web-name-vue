"use client";

import { useState } from "react";
import { Check, Copy, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";
import Reveal from "@/components/Reveal";

export default function Contact() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  return (
    <section id="contact" className="section rule-top">
      <div className="container-custom">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-[var(--ink)] px-6 py-16 text-[color:var(--paper)] md:px-16 md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-30 blur-[90px]"
              style={{ background: "var(--lime)" }}
            />
            <div className="eyebrow mb-6 !text-[color:var(--paper)]/60">
              <span className="idx !text-[color:var(--lime)]">(07)</span> {t("Contact", "Kontak")}
            </div>
            <h2 className="font-display max-w-[14ch] text-5xl leading-[0.98] !text-[color:var(--paper)] md:text-8xl">
              {t("Got an idea?", "Punya ide?")}{" "}
              <span className="font-accent text-[color:var(--lime)]">{t("Let's talk.", "Ayo ngobrol.")}</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-lg text-[color:var(--paper)]/70">
              {t(
                "Open for freelance projects, collaborations, and interesting full-time conversations.",
                "Terbuka untuk proyek freelance, kolaborasi, dan obrolan menarik tentang pekerjaan penuh waktu.",
              )}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--lime)] px-7 py-4 text-sm font-semibold text-[color:var(--lime-ink)] transition-transform hover:-translate-y-0.5"
              >
                {SITE.email} <ArrowUpRight size={16} />
              </a>
              <button
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--paper)]/25 px-6 py-4 text-sm transition-colors hover:border-[var(--paper)]"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? t("Copied!", "Tersalin!") : t("Copy email", "Salin email")}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
