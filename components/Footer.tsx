"use client";

import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 pb-32 md:pb-12 bg-card/30">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-black tracking-tighter mb-2 uppercase">
              Alif
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              © {year}{" "}
              {t("Designed & Built by Alif", "Didesain & Dibangun oleh Alif")}
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="https://github.com/aliffajriadi"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/alif-fajriadi-434815276/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="mailto:aliffajriadi@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
