"use client";

import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-12 pb-32 md:pb-12"
      style={{
        borderTop: "1px solid var(--border-outline)",
        background: "var(--muted)",
      }}
    >
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Branding */}
          <div className="text-center md:text-left">
            <div className="flex flex-col items-center md:items-start mb-2">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  color: "var(--color-primary-dark)",
                }}
              >
                AF
              </span>
              <span
                className="h-[2px] w-5 mt-0.5"
                style={{ background: "var(--color-primary)" }}
              />
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-body)" }}
            >
              © {year}{" "}
              {t("Designed & Built by Alif", "Didesain & Dibangun oleh Alif")}
            </p>
          </div>

          {/* Social links */}
          <div className="flex gap-5">
            {[
              {
                href: "https://github.com/aliffajriadi",
                icon: Github,
                label: "GitHub",
              },
              {
                href: "https://www.linkedin.com/in/alif-fajriadi-434815276/",
                icon: Linkedin,
                label: "LinkedIn",
              },
              { href: "#", icon: Twitter, label: "Twitter" },
              {
                href: "mailto:aliffajriadi@gmail.com",
                icon: Mail,
                label: "Email",
              },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="p-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  color: "var(--color-text-body)",
                  border: "1px solid var(--border-outline)",
                  background: "var(--card)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-body)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-outline)";
                }}
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
