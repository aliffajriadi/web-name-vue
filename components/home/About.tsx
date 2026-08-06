"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  return (
    <section
      className="py-20 md:py-28"
      style={{ borderTop: "1px solid var(--border-outline)" }}
    >
      <div className="container-custom">
        {/* Eyebrow label */}
        <div className="eyebrow-label mb-6" style={{ justifyContent: "flex-start" }}>
          {t("Origins", "Asal-usul")}
        </div>

        {/* Section headline */}
        <h2
          className="text-3xl md:text-4xl font-bold mb-12"
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            color: "var(--color-primary-dark)",
            lineHeight: 1.15,
          }}
        >
          {t("The story behind the", "Cerita di balik")}
          <br />
          <em style={{ color: "var(--color-accent-italic)" }}>
            {t("code & craft", "kode & karya")}
          </em>
        </h2>

        {/* Body text grid */}
        <div
          className="grid md:grid-cols-2 gap-10 text-base leading-[1.8]"
          style={{ color: "var(--color-text-body)" }}
        >
          <div className="space-y-5">
            <p>
              {t(
                `I'm ${profile?.name || "Alif"}, and I've spent the better part of the last decade mastering the art of software engineering. My journey started with a fascination for logic and has evolved into a passion for creating interfaces that feel as good as they function.`,
                `Saya ${profile?.name || "Alif"}, dan saya telah menghabiskan sebagian besar dekade terakhir menguasai seni rekayasa perangkat lunak. Perjalanan saya dimulai dengan kekaguman pada logika dan telah berkembang menjadi gairah untuk membuat antarmuka yang terasa sebagus fungsinya.`,
              )}
            </p>
            <p>
              {t(
                `I believe that great code is invisible. When a product works perfectly, the user shouldn't notice the complexity behind it — they should just feel the flow.`,
                `Saya percaya bahwa kode yang hebat itu tidak terlihat. Ketika sebuah produk bekerja dengan sempurna, pengguna tidak seharusnya menyadari kerumitannya — mereka seharusnya hanya merasakan alurnya.`,
              )}
            </p>
          </div>
          <div className="space-y-5">
            <p>
              {t(
                `Beyond the tech stack, I value clarity, curiosity, and consistency. I approach every project not just as a developer, but as a bridge between a business problem and a technical solution.`,
                `Di luar tumpukan teknologi, saya menghargai kejelasan, rasa ingin tahu, dan konsistensi. Saya mendekati setiap proyek tidak hanya sebagai pengembang, tetapi sebagai jembatan antara masalah bisnis dan solusi teknis.`,
              )}
            </p>
            <p>
              {t(
                `When I'm not in front of a terminal, I'm exploring the intersection of design and psychology — or helping other engineers grow through mentorship.`,
                `Saat saya tidak di depan terminal, saya menjelajahi persimpangan desain dan psikologi, atau membantu insinyur lain berkembang melalui bimbingan.`,
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
