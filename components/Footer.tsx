"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, ArrowUpRight, Rss } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";

function JakartaClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(new Date());
    const tick = () => setTime(fmt());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return <span suppressHydrationWarning>{time || "--:--"} WIB</span>;
}

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const year = new Date().getFullYear();

  const links = [
    { href: "/", label: t("Home", "Beranda") },
    { href: "/projects", label: t("Work", "Proyek") },
    { href: "/blog", label: t("Writing", "Tulisan") },
    { href: "/gallery", label: t("Gallery", "Galeri") },
  ];
  const socials = [
    { href: SITE.github, label: "GitHub", icon: Github },
    { href: SITE.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: `mailto:${SITE.email}`, label: "Email", icon: Mail },
    { href: "/blog/feed.xml", label: "RSS", icon: Rss },
  ];

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-border pb-28 md:pb-10 pt-14 bg-muted/40">
      <div className="container-custom">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl md:text-4xl leading-tight max-w-[18ch]">
              {t("Let's build something", "Mari bangun sesuatu")}{" "}
              <span className="font-accent text-[color:var(--accent)]">
                {t("worth shipping.", "yang layak rilis.")}
              </span>
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-6 inline-flex items-center gap-2 text-sm link-u"
            >
              {SITE.email} <ArrowUpRight size={15} />
            </a>
          </div>

          <nav aria-label="Footer">
            <div className="eyebrow mb-4">{t("Sitemap", "Peta Situs")}</div>
            <ul className="space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-u">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className="eyebrow mb-4">{t("Elsewhere", "Temukan Saya")}</div>
            <ul className="space-y-2.5 text-sm">
              {socials.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer me" : undefined}
                    className="inline-flex items-center gap-2 link-u"
                  >
                    <Icon size={15} /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {SITE.name}. {t("Designed & built by hand.", "Didesain & dibangun sendiri.")}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="live-dot" /> {t("Jakarta", "Jakarta")} · <JakartaClock />
          </span>
        </div>
      </div>
    </footer>
  );
}
